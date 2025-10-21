// GET Request Code Generator
// Generates code for GET requests with and without parameters

import { IMPORTS, generateFetchOptions, detectPaginationPattern } from '../../utils/code-templates.js';
import { generatePaginatedCode } from './pagination-generator.js';
import { generateClientPaginatedCode } from './client-pagination-generator.js';
import {
  generateStateDeclarations,
  generateStateVarList,
  generateParamInputs,
  buildStandardState,
  buildUrlConstruction,
  buildFetchChain,
  buildUseEffect,
  wrapWithLayout,
  buildFunctionWrapper
} from '../../utils/code-generation-helpers.js';

/**
 * Generate code for GET request with parameters (non-paginated)
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Array} allParams - All parameters
 * @param {Array} pathParams - Path parameters
 * @param {Array} queryParams - Query parameters
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
function generateParameterizedGet(funcName, fullUrl, allParams, pathParams, queryParams, endpoint, bearerToken = null) {
  const stateInit = generateStateDeclarations(allParams);
  const stateVars = generateStateVarList(allParams);
  const urlConstruction = buildUrlConstruction(fullUrl, pathParams, queryParams);
  const fetchOptions = generateFetchOptions(null, false, bearerToken);
  const paramInputs = generateParamInputs(allParams);

  const states = `${stateInit}
${buildStandardState()}`;

  const { fetchStart } = buildFetchChain(urlConstruction, fetchOptions, 'result');
  const useEffectCode = buildUseEffect(fetchStart, stateVars);

  const jsx = wrapWithLayout(`      <Response data={data} currentPath="${endpoint.path}" />`, {
    includeParams: true,
    paramContent: paramInputs
  });

  return buildFunctionWrapper(funcName, IMPORTS, states, useEffectCode, jsx);
}

/**
 * Generate code for simple GET request (no parameters)
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
function generateSimpleGet(funcName, fullUrl, endpoint, bearerToken = null) {
  const fetchOptions = generateFetchOptions(null, false, bearerToken);
  const states = buildStandardState();
  const { fetchStart } = buildFetchChain(`'${fullUrl}'`, fetchOptions, 'result');
  const useEffectCode = buildUseEffect(fetchStart, '');
  const jsx = wrapWithLayout(`      <Response data={data} currentPath="${endpoint.path}" />`);

  return buildFunctionWrapper(funcName, IMPORTS, states, useEffectCode, jsx);
}

/**
 * Generate code for GET request
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
export function generateGetCode(funcName, fullUrl, endpoint, bearerToken = null) {
  const allParams = endpoint.parameters || [];
  const pathParams = allParams.filter(p => p.in === 'path');
  const queryParams = allParams.filter(p => p.in === 'query');

  // Check if server-side pagination pattern is present (skip/limit params)
  const { isPaginated, skipParam, limitParam } = detectPaginationPattern(queryParams);

  if (isPaginated) {
    // Server-side pagination: Generate paginated version with API-driven infinite scroll
    const nonPaginationParams = allParams.filter(p => p.name !== skipParam.name && p.name !== limitParam.name);
    return generatePaginatedCode(funcName, fullUrl, skipParam, limitParam, pathParams, queryParams, nonPaginationParams, endpoint, bearerToken);
  }

  // Check if client-side pagination pattern is present (results + total_count in response)
  if (endpoint.hasClientPagination) {
    // Client-side pagination: Single API call, paginate in browser
    return generateClientPaginatedCode(funcName, fullUrl, allParams, pathParams, queryParams, endpoint, bearerToken);
  }

  // No parameters at all
  if (allParams.length === 0) {
    return generateSimpleGet(funcName, fullUrl, endpoint, bearerToken);
  }

  // Regular GET with parameters (non-paginated)
  return generateParameterizedGet(funcName, fullUrl, allParams, pathParams, queryParams, endpoint, bearerToken);
}
