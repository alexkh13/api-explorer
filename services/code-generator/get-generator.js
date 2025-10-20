// GET Request Code Generator
// Generates code for GET requests with and without parameters

import { IMPORTS, generateFetchOptions, detectPaginationPattern } from '../../utils/code-templates.js';
import { generatePaginatedCode } from './pagination-generator.js';
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
  if (!endpoint.parameters || endpoint.parameters.length === 0) {
    // Simple GET without parameters
    return generateSimpleGet(funcName, fullUrl, endpoint, bearerToken);
  }

  const allParams = endpoint.parameters;
  const pathParams = allParams.filter(p => p.in === 'path');
  const queryParams = allParams.filter(p => p.in === 'query');

  // Check if pagination pattern is present
  const { isPaginated, skipParam, limitParam } = detectPaginationPattern(queryParams);

  if (isPaginated) {
    // Generate paginated version with infinite scroll
    const nonPaginationParams = allParams.filter(p => p.name !== skipParam.name && p.name !== limitParam.name);
    return generatePaginatedCode(funcName, fullUrl, skipParam, limitParam, pathParams, queryParams, nonPaginationParams, endpoint, bearerToken);
  }

  // Regular non-paginated version
  return generateParameterizedGet(funcName, fullUrl, allParams, pathParams, queryParams, endpoint, bearerToken);
}
