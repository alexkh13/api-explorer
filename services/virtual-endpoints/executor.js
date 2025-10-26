// Virtual Endpoint Executor Engine
// Executes user-defined virtual endpoint functions with context

import { transformationHelpers } from '../../utils/transformation-helpers.js';

export class VirtualEndpointExecutor {
  constructor(virtualEndpoint, realEndpoints) {
    this.virtualEndpoint = virtualEndpoint;
    this.realEndpoints = realEndpoints;
  }

  async execute(input) {
    try {
      // Build the context object
      const context = this.buildContext(input);

      // Execute the user's function with timeout
      const result = await this.executeWithTimeout(
        () => this.runUserFunction(context),
        this.virtualEndpoint.config?.timeout || 10000
      );

      return {
        success: true,
        data: result,
        executionTime: Date.now() - context.meta.timestamp
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  buildContext(input) {
    const context = {
      // Input data
      input: {
        params: input.params || {},
        query: input.query || {},
        body: input.body || {},
        headers: input.headers || {}
      },

      // Endpoint calling methods
      call: this.callEndpoint.bind(this),
      get: (id, opts) => this.callEndpoint(id, { ...opts, method: 'GET' }),
      post: (id, opts) => this.callEndpoint(id, { ...opts, method: 'POST' }),
      put: (id, opts) => this.callEndpoint(id, { ...opts, method: 'PUT' }),
      delete: (id, opts) => this.callEndpoint(id, { ...opts, method: 'DELETE' }),
      parallel: this.callParallel.bind(this),
      fetch: this.fetchExternal.bind(this),

      // Utilities
      utils: transformationHelpers,

      // Metadata
      meta: {
        endpointId: this.virtualEndpoint.id,
        name: this.virtualEndpoint.name,
        timestamp: Date.now(),
        endpoints: this.realEndpoints.map(e => ({
          id: e.id,
          name: e.name,
          method: e.method,
          url: e.url,
          type: e.type || 'real'
        }))
      }
    };

    return context;
  }

  async runUserFunction(context) {
    const code = this.virtualEndpoint.code;

    if (!code || code.trim() === '') {
      throw new Error('Virtual endpoint code is empty');
    }

    // Check if code is a function declaration or direct code
    const trimmedCode = code.trim();
    let wrappedCode;

    if (trimmedCode.startsWith('async function')) {
      // User provided: async function virtualEndpoint(context) { ... }
      wrappedCode = `return (${trimmedCode})(context);`;
    } else if (trimmedCode.startsWith('function')) {
      // User provided: function virtualEndpoint(context) { ... }
      wrappedCode = `return (async ${trimmedCode})(context);`;
    } else {
      // User provided direct code (no function wrapper)
      wrappedCode = `return (async function(context) { ${trimmedCode} })(context);`;
    }

    // Create async function from code
    const asyncFunction = new Function('context', wrappedCode);

    // Execute and return result
    return await asyncFunction(context);
  }

  async callEndpoint(endpointId, options = {}) {
    const endpoint = this.realEndpoints.find(e => e.id === endpointId);

    if (!endpoint) {
      throw new Error(`Endpoint not found: ${endpointId}`);
    }

    // Build URL with params
    let url = endpoint.url;
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
      });
    }

    // Add query string
    if (options.query && Object.keys(options.query).length > 0) {
      const queryString = new URLSearchParams(options.query).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    // Determine method
    const method = options.method || endpoint.method;

    // Make request
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...endpoint.headers,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`${method} ${url} failed: ${response.status} ${response.statusText}`);
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  async callParallel(...calls) {
    if (calls.length === 0) {
      return [];
    }

    const promises = calls.map(call => {
      if (!call || !call.endpointId) {
        throw new Error('Invalid parallel call: missing endpointId');
      }
      return this.callEndpoint(call.endpointId, call.options || {});
    });

    return await Promise.all(promises);
  }

  async fetchExternal(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Fetch ${url} failed: ${response.status} ${response.statusText}`);
    }

    // Try to parse as JSON, fallback to text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  async executeWithTimeout(fn, timeout) {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Execution timeout (${timeout}ms)`)), timeout)
      )
    ]);
  }
}
