// Virtual Endpoint Helpers
// Utilities and helpers for virtual endpoint preview execution

import { transformationHelpers } from '../../utils/transformation-helpers.js';

// Export utilities directly
export const utils = transformationHelpers;

// Create endpoint caller factory
export function createEndpointCaller(realEndpoints) {
  async function callEndpoint(endpointId, options = {}) {
    const endpoint = realEndpoints.find(e => e.id === endpointId);
    if (!endpoint) throw new Error(`Endpoint not found: ${endpointId}`);

    let url = endpoint.url;
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
      });
    }
    if (options.query) {
      const queryString = new URLSearchParams(options.query).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    const response = await fetch(url, {
      method: options.method || endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...endpoint.headers,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json') ? await response.json() : await response.text();
  }

  async function fetchExternal(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const contentType = res.headers.get('content-type');
    return contentType?.includes('application/json') ? await res.json() : await res.text();
  }

  return {
    call: callEndpoint,
    get: async (id, opts) => await callEndpoint(id, { ...opts, method: 'GET' }),
    post: async (id, opts) => await callEndpoint(id, { ...opts, method: 'POST' }),
    put: async (id, opts) => await callEndpoint(id, { ...opts, method: 'PUT' }),
    delete: async (id, opts) => await callEndpoint(id, { ...opts, method: 'DELETE' }),
    parallel: async (...calls) => await Promise.all(calls.map(c => callEndpoint(c.endpointId, c.options))),
    fetch: fetchExternal
  };
}

// Build context for virtual endpoint execution
export function buildContext(input, realEndpoints, virtualEndpointId, virtualEndpointName) {
  const endpointCaller = createEndpointCaller(realEndpoints);

  return {
    input,
    ...endpointCaller,
    utils: transformationHelpers,
    meta: {
      endpointId: virtualEndpointId,
      name: virtualEndpointName,
      timestamp: Date.now(),
      endpoints: realEndpoints.map(e => ({ id: e.id, name: e.name, method: e.method, url: e.url }))
    }
  };
}
