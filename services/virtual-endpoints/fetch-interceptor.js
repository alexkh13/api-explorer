// Virtual Endpoint Fetch Interceptor
// Intercepts fetch calls to virtual endpoint paths and executes custom code

import { VirtualEndpointExecutor } from './executor.js';

let virtualEndpoints = [];
let realEndpoints = [];
let originalFetch = null;

// Initialize the fetch interceptor
export function initializeFetchInterceptor(virtuals, reals) {
  virtualEndpoints = virtuals;
  realEndpoints = reals;

  if (!originalFetch) {
    originalFetch = window.fetch;
    window.fetch = interceptedFetch;
  }
}

// Update virtual endpoints list
export function updateVirtualEndpoints(virtuals, reals) {
  virtualEndpoints = virtuals;
  realEndpoints = reals;
}

// Intercepted fetch function
async function interceptedFetch(url, options = {}) {
  // Parse the URL
  const urlObj = typeof url === 'string' ? new URL(url, window.location.origin) : url;
  const pathname = urlObj.pathname;

  // Check if this matches a virtual endpoint
  const virtualEndpoint = findMatchingVirtualEndpoint(pathname);

  if (virtualEndpoint) {
    // This is a virtual endpoint - execute custom code
    return executeVirtualEndpoint(virtualEndpoint, urlObj, options);
  }

  // Not a virtual endpoint - call original fetch
  return originalFetch(url, options);
}

// Find virtual endpoint matching the path
function findMatchingVirtualEndpoint(pathname) {
  for (const endpoint of virtualEndpoints) {
    if (matchPath(endpoint.path, pathname)) {
      return endpoint;
    }
  }
  return null;
}

// Match path with parameters (e.g., /virtual/user/:id matches /virtual/user/123)
function matchPath(pattern, pathname) {
  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/:[^/]+/g, '([^/]+)')  // Replace :param with capture group
    .replace(/\//g, '\\/');          // Escape slashes

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(pathname);
}

// Extract params from path
function extractParams(pattern, pathname) {
  const paramNames = (pattern.match(/:[^/]+/g) || []).map(p => p.slice(1));
  const values = pathname.match(
    new RegExp(
      `^${pattern.replace(/:[^/]+/g, '([^/]+)').replace(/\//g, '\\/')}$`
    )
  );

  if (!values) return {};

  const params = {};
  paramNames.forEach((name, i) => {
    params[name] = values[i + 1];
  });

  return params;
}

// Execute virtual endpoint
async function executeVirtualEndpoint(virtualEndpoint, urlObj, options) {
  try {
    // Extract input from request
    const params = extractParams(virtualEndpoint.path, urlObj.pathname);
    const query = Object.fromEntries(urlObj.searchParams);
    const body = options.body ? JSON.parse(options.body) : {};
    const headers = options.headers || {};

    const input = { params, query, body, headers };

    // Execute using VirtualEndpointExecutor
    const executor = new VirtualEndpointExecutor(virtualEndpoint, realEndpoints);
    const result = await executor.execute(input);

    if (result.success) {
      // Return successful response
      return createMockResponse(result.data, 200);
    } else {
      // Return error response
      return createMockResponse({ error: result.error }, 500);
    }
  } catch (error) {
    return createMockResponse({ error: error.message }, 500);
  }
}

// Create mock Response object
function createMockResponse(data, status = 200) {
  const body = JSON.stringify(data);

  return new Response(body, {
    status,
    statusText: status === 200 ? 'OK' : 'Internal Server Error',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length.toString()
    }
  });
}

// Cleanup
export function cleanupFetchInterceptor() {
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = null;
  }
}
