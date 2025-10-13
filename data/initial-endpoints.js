// Initial Endpoints Data
// Default endpoints for the API Explorer (JSONPlaceholder demo)

import { generateStarterCode } from '../services/code-generator/index.js';

// Base URL for sample JSONPlaceholder API endpoints
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Metadata-only endpoint definitions (no hardcoded starterCode)
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

// Generate initialEndpointsData by dynamically creating starterCode for each endpoint
// This ensures consistency between initial endpoints and spec-loaded endpoints
export const initialEndpointsData = initialEndpointsMetadata.map(endpoint => ({
  ...endpoint,
  starterCode: generateStarterCode(endpoint, JSONPLACEHOLDER_BASE_URL)
}));
