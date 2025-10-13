// HTTP Methods Constants
// Standardized HTTP method constants for type safety and consistency

/**
 * Standard HTTP methods
 * @constant {Object}
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
};

/**
 * HTTP methods that typically have request bodies
 * @constant {string[]}
 */
export const METHODS_WITH_BODY = [
  HTTP_METHODS.POST,
  HTTP_METHODS.PUT,
  HTTP_METHODS.PATCH
];

/**
 * HTTP methods that are considered safe (read-only, no side effects)
 * @constant {string[]}
 */
export const SAFE_METHODS = [
  HTTP_METHODS.GET,
  HTTP_METHODS.HEAD,
  HTTP_METHODS.OPTIONS
];

/**
 * HTTP methods that are idempotent (same result on repeated calls)
 * @constant {string[]}
 */
export const IDEMPOTENT_METHODS = [
  HTTP_METHODS.GET,
  HTTP_METHODS.PUT,
  HTTP_METHODS.DELETE,
  HTTP_METHODS.HEAD,
  HTTP_METHODS.OPTIONS
];

/**
 * Check if an HTTP method typically includes a request body
 *
 * @param {string} method - HTTP method to check
 * @returns {boolean} True if the method typically has a body
 *
 * @example
 * hasRequestBody('POST'); // true
 * hasRequestBody('GET');  // false
 */
export function hasRequestBody(method) {
  return METHODS_WITH_BODY.includes(method?.toUpperCase());
}

/**
 * Check if an HTTP method is safe (read-only)
 *
 * @param {string} method - HTTP method to check
 * @returns {boolean} True if the method is safe
 *
 * @example
 * isSafeMethod('GET');    // true
 * isSafeMethod('DELETE'); // false
 */
export function isSafeMethod(method) {
  return SAFE_METHODS.includes(method?.toUpperCase());
}

/**
 * Check if an HTTP method is idempotent
 *
 * @param {string} method - HTTP method to check
 * @returns {boolean} True if the method is idempotent
 *
 * @example
 * isIdempotent('PUT');  // true
 * isIdempotent('POST'); // false
 */
export function isIdempotent(method) {
  return IDEMPOTENT_METHODS.includes(method?.toUpperCase());
}

/**
 * Normalize HTTP method to uppercase
 *
 * @param {string} method - HTTP method to normalize
 * @returns {string} Uppercase HTTP method
 *
 * @example
 * normalizeMethod('get'); // 'GET'
 * normalizeMethod('Post'); // 'POST'
 */
export function normalizeMethod(method) {
  return method?.toUpperCase() || HTTP_METHODS.GET;
}
