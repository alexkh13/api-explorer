// OpenAPI v3 Specification Parser
// Parses OpenAPI specs and converts them to endpoint metadata

/**
 * Parse OpenAPI v3 spec and convert to endpoints
 * Returns an object with endpoints (metadata only) and baseUrl for dynamic code generation
 * @param {Object} spec - OpenAPI v3 specification object
 * @param {string|null} bearerToken - Optional bearer token for authentication
 * @returns {{ endpoints: Array, baseUrl: string }} Parsed endpoints and base URL
 */
export function parseOpenAPISpec(spec, bearerToken) {
  const endpoints = [];

  if (!spec || !spec.paths) {
    throw new Error('Invalid OpenAPI spec: missing paths');
  }

  const baseUrl = spec.servers && spec.servers[0] ? spec.servers[0].url : '';
  let idCounter = 1;

  Object.keys(spec.paths).forEach(path => {
    const pathItem = spec.paths[path];

    ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
      if (pathItem[method]) {
        const operation = pathItem[method];
        const endpoint = {
          id: String(idCounter++),
          title: `${method.toUpperCase()} ${path}`,
          description: operation.summary || operation.description || `${method.toUpperCase()} request to ${path}`,
          method: method.toUpperCase(),
          path: path,
          completed: false,
          isFromSpec: true  // Mark this as a spec-loaded endpoint for dynamic generation
        };

        // Extract parameters
        if (operation.parameters) {
          endpoint.parameters = operation.parameters.map(param => ({
            name: param.name,
            in: param.in,
            type: param.schema?.type || 'string',
            default: param.schema?.default || (param.schema?.type === 'integer' ? 1 : '')
          }));
        }

        // Extract request body for POST/PUT/PATCH
        if (operation.requestBody && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
          const content = operation.requestBody.content;
          const jsonSchema = content && content['application/json'] ? content['application/json'].schema : null;

          if (jsonSchema && jsonSchema.properties) {
            endpoint.requestBody = {
              type: 'object',
              properties: {}
            };

            Object.keys(jsonSchema.properties).forEach(propName => {
              const prop = jsonSchema.properties[propName];
              endpoint.requestBody.properties[propName] = {
                type: prop.type || 'string',
                default: prop.default || (prop.type === 'integer' ? 0 : prop.type === 'boolean' ? false : '')
              };
            });
          }
        }

        // Do NOT generate starterCode here - it will be generated dynamically
        endpoints.push(endpoint);
      }
    });
  });

  return { endpoints, baseUrl };
}
