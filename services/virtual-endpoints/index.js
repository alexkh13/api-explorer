// Virtual Endpoints Service
// Main exports for virtual endpoint functionality

export { VirtualEndpointExecutor } from './executor.js';
export { virtualEndpointTemplates, getTemplate, getTemplateList } from './templates.js';
export { generateVirtualEndpointCode } from './code-generator.js';
export { initializeFetchInterceptor, updateVirtualEndpoints, cleanupFetchInterceptor } from './fetch-interceptor.js';

// Utility to create a new virtual endpoint
export function createVirtualEndpoint(data) {
  const name = data.name || 'Untitled Virtual Endpoint';
  return {
    id: data.id || `virtual-${Date.now()}`,
    name: name,
    title: name, // For sidebar display compatibility
    description: data.description || '',
    type: 'virtual',
    method: data.method || 'GET',
    path: data.path || '/virtual/endpoint',
    url: data.path || '/virtual/endpoint', // For compatibility with endpoint code
    tags: data.tags || [],
    code: data.code || '',
    config: {
      timeout: data.config?.timeout || 10000,
      cache: data.config?.cache || false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Validate virtual endpoint code
export function validateVirtualEndpointCode(code) {
  const errors = [];
  const warnings = [];

  if (!code || code.trim() === '') {
    errors.push('Code cannot be empty');
    return { valid: false, errors, warnings };
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /eval\s*\(/g, message: 'eval() is not allowed for security reasons' },
    { pattern: /Function\s*\(\s*['"`]/g, message: 'Function constructor with string is discouraged' }
  ];

  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      warnings.push(message);
    }
  });

  // Try to parse as JavaScript
  try {
    // Wrap code in async function if not already
    const wrappedCode = code.trim().startsWith('async function')
      ? code
      : `async function test(context) { ${code} }`;

    new Function(wrappedCode);
  } catch (error) {
    errors.push(`Syntax error: ${error.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
