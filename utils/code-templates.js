// Code Template Utilities
// Shared utilities and templates for code generation

// Import statement for APIExplorer utilities (used in generated code)
// Note: Absolute paths from root are required for iframe srcdoc imports
// Import both default React (for JSX) and named hooks
// createRoot is handled by preview runtime, not in generated code
export const IMPORTS = `import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout, Params, Input, Textarea, Response, PaginatedResponse, ErrorDisplay } from '/services/preview/api-explorer-utils.jsx';`;

/**
 * Generate fetch options with optional authentication header
 * @param {string|null} method - HTTP method (GET, POST, etc.)
 * @param {boolean} includeBody - Whether to include body in request
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated fetch options as string
 */
export function generateFetchOptions(method, includeBody, bearerToken = null) {
  const options = [];
  if (method && method !== 'GET') {
    options.push(`method: '${method}'`);
  }

  const headers = [];
  if (includeBody) {
    headers.push(`'Content-Type': 'application/json'`);
  }
  if (bearerToken) {
    headers.push(`'Authorization': 'Bearer ${bearerToken}'`);
  }

  if (headers.length > 0) {
    options.push(`headers: {\n        ${headers.join(',\n        ')}\n      }`);
  }

  if (includeBody) {
    options.push('body: JSON.stringify(formData)');
  }

  return options.length > 0 ? `, {\n      ${options.join(',\n      ')}\n    }` : '';
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a safe PascalCase function name from method and path
 * React components must start with uppercase letter
 * @param {string} method - HTTP method
 * @param {string} path - API path
 * @returns {string} Generated function name in PascalCase
 */
export function generateFunctionName(method, path) {
  // Convert to PascalCase: GetUsers, PostUsers, etc.
  const methodPart = capitalize(method.toLowerCase());
  const pathPart = path
    .replace(/[^a-zA-Z0-9]/g, '_')
    .split('_')
    .filter(Boolean)
    .map(part => capitalize(part))
    .join('');
  return `${methodPart}${pathPart}`;
}

/**
 * Check if parameters represent a pagination pattern
 * @param {Array} queryParams - Array of query parameters
 * @returns {{ isPaginated: boolean, skipParam: Object|null, limitParam: Object|null }}
 */
export function detectPaginationPattern(queryParams) {
  const skipNames = ['skip', 'offset', '_start', 'start'];
  const limitNames = ['limit', '_limit', 'count', 'per_page', 'pageSize'];

  const skipParam = queryParams.find(p => skipNames.includes(p.name));
  const limitParam = queryParams.find(p => limitNames.includes(p.name));
  const isPaginated = skipParam && limitParam;

  return { isPaginated, skipParam, limitParam };
}
