// Code Generator - Main Entry Point
// Orchestrates code generation for different HTTP methods and endpoint types

import { generateFunctionName } from '../../utils/code-templates.js';
import { generateGetCode } from './get-generator.js';
import { generateMutationCode } from './mutation-generator.js';

/**
 * Generate starter code for an endpoint dynamically
 * @param {Object} endpoint - Endpoint metadata object
 * @param {string} baseUrl - Base URL for the API
 * @param {string|null} bearerToken - Optional bearer token for authentication
 * @returns {string} Generated JSX code as string
 */
export function generateStarterCode(endpoint, baseUrl, bearerToken = null) {
  const fullUrl = baseUrl + endpoint.path;
  const funcName = generateFunctionName(endpoint.method, endpoint.path);

  if (endpoint.method === 'GET') {
    return generateGetCode(funcName, fullUrl, endpoint, bearerToken);
  } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method)) {
    return generateMutationCode(funcName, fullUrl, endpoint, bearerToken);
  }

  // Fallback (should never reach here)
  return `function ${funcName}() {
  return <div>Unsupported method: ${endpoint.method}</div>;
}`;
}
