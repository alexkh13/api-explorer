// Initial Endpoints Data
// Default endpoints for the API Explorer (JSONPlaceholder demo)

import { generateStarterCode } from '../services/code-generator/index.js';

/**
 * @typedef {Object} EndpointParameter
 * @property {string} name - Parameter name
 * @property {string} in - Parameter location ('path', 'query', 'header', 'body')
 * @property {string} type - Parameter type ('string', 'integer', 'boolean')
 * @property {*} default - Default value for the parameter
 */

/**
 * @typedef {Object} RequestBodyProperty
 * @property {string} type - Property type ('string', 'integer', 'boolean', 'object', 'array')
 * @property {*} default - Default value for the property
 */

/**
 * @typedef {Object} RequestBody
 * @property {string} type - Request body type (usually 'object')
 * @property {Object.<string, RequestBodyProperty>} properties - Request body properties
 */

/**
 * @typedef {Object} Endpoint
 * @property {string} id - Unique endpoint identifier
 * @property {string} title - Human-readable endpoint title
 * @property {string} description - Endpoint description
 * @property {string} method - HTTP method ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
 * @property {string} path - API path (may include :params)
 * @property {boolean} completed - Whether user has completed this endpoint
 * @property {EndpointParameter[]} [parameters] - Endpoint parameters (path, query, etc.)
 * @property {RequestBody} [requestBody] - Request body schema for POST/PUT/PATCH
 * @property {string} [starterCode] - Generated JSX starter code
 * @property {boolean} [isFromSpec] - Whether loaded from OpenAPI spec
 */

/**
 * Base URL for sample JSONPlaceholder API endpoints
 * @type {string}
 * @constant
 */
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Metadata-only endpoint definitions (no hardcoded starterCode)
 * Starter code is generated dynamically using code-generator service
 * @type {Endpoint[]}
 */
const initialEndpointsMetadata = [
    {
      id: "1",
      title: "Users List",
      description: "Fetch a list of all users",
      method: "GET",
      path: "/users",
      completed: false,
    },
    {
      id: "2",
      title: "Post Details",
      description: "Fetch a specific post by ID",
      method: "GET",
      path: "/posts/:id",
      parameters: [
        { name: "id", in: "path", type: "integer", default: 1 }
      ],
      completed: false,
    },
    {
      id: "3",
      title: "Create Post",
      description: "Create a new post",
      method: "POST",
      path: "/posts",
      requestBody: {
        type: "object",
        properties: {
          title: { type: "string", default: "" },
          body: { type: "string", default: "" },
          userId: { type: "integer", default: 1 }
        }
      },
      completed: false,
    },
    {
      id: "4",
      title: "Photos (Paginated)",
      description: "Fetch photos with infinite scroll pagination",
      method: "GET",
      path: "/photos",
      parameters: [
        { name: "_start", in: "query", type: "integer", default: 0 },
        { name: "_limit", in: "query", type: "integer", default: 10 }
      ],
      completed: false,
    },
];

/**
 * Initial endpoints data with dynamically generated starter code
 * Creates fully-formed endpoint objects by generating JSX code for each endpoint
 * This ensures consistency between initial demo endpoints and spec-loaded endpoints
 *
 * @type {Endpoint[]}
 * @constant
 *
 * @example
 * import { initialEndpointsData } from './data/initial-endpoints.js';
 * const firstEndpoint = initialEndpointsData[0]; // { id, title, description, method, path, starterCode, ... }
 */
export const initialEndpointsData = initialEndpointsMetadata.map(endpoint => ({
  ...endpoint,
  starterCode: generateStarterCode(endpoint, JSONPLACEHOLDER_BASE_URL)
}));
