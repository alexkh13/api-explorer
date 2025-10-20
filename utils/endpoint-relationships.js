// Endpoint Relationships Utility
// Finds related "child" endpoints that can be navigated to from a "parent" endpoint

/**
 * Extract parameter names from a path (supports both :param and {param} syntax)
 * @param {string} path - Path like "/posts/:id" or "/users/{userId}/posts/{postId}"
 * @returns {string[]} Array of parameter names like ["id"] or ["userId", "postId"]
 */
export function extractPathParams(path) {
  const params = [];
  // Match both :param and {param} syntax
  const regex = /[:{]([^}/]+)[}]?/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    params.push(match[1]);
  }
  return params;
}

/**
 * Remove plural 's' from endpoint name
 * @param {string} name - Endpoint name like "attack_paths" or "posts"
 * @returns {string} Singular form like "attack_path" or "post"
 */
function singularize(name) {
  // Simple pluralization removal - just remove trailing 's'
  return name.endsWith('s') ? name.slice(0, -1) : name;
}

/**
 * Get the base name from a path (e.g., "/attack_paths" → "attack_paths")
 * @param {string} path - Path like "/attack_paths" or "/attack_paths/violations"
 * @returns {string} Base name
 */
function getBaseName(path) {
  const parts = path.split('/').filter(p => p && !p.startsWith(':') && !p.startsWith('{'));
  return parts[0] || '';
}

/**
 * Check if a parameter name matches the parent endpoint pattern
 * @param {string} paramName - Parameter name like "attack_path_id" or "id"
 * @param {string} parentPath - Parent path like "/attack_paths"
 * @returns {boolean} True if parameter matches parent
 */
function paramMatchesParent(paramName, parentPath) {
  const baseName = getBaseName(parentPath);
  const singularBase = singularize(baseName);

  // Check if param contains the singular base name
  // Examples: attack_path_id matches attack_paths, post_id matches posts
  const lowerParam = paramName.toLowerCase();
  const lowerSingular = singularBase.toLowerCase();

  // Match patterns: {singular}_id, {singular}Id, or just id/_id
  return lowerParam.includes(lowerSingular) || lowerParam === 'id' || lowerParam === '_id';
}

/**
 * Check if a child endpoint is related to a parent endpoint
 * @param {string} parentPath - Parent path like "/attack_paths"
 * @param {string} childPath - Child path like "/attack_paths/violations"
 * @param {Array} childParams - Child endpoint parameters
 * @returns {boolean} True if child is related to parent
 */
export function isRelatedChildPath(parentPath, childPath, childParams = []) {
  // Remove trailing slashes
  const normalizedParent = parentPath.replace(/\/$/, '');
  const normalizedChild = childPath.replace(/\/$/, '');

  // Child must start with parent path
  if (!normalizedChild.startsWith(normalizedParent)) {
    return false;
  }

  // Child must not be the same as parent
  if (normalizedChild === normalizedParent) {
    return false;
  }

  // Check if any of the child's parameters match the parent pattern
  return childParams.some(param => paramMatchesParent(param.name, parentPath));
}

/**
 * Find child endpoints that can be navigated to from a parent endpoint
 * @param {Object} parentEndpoint - The parent endpoint object
 * @param {Array} allEndpoints - All available endpoints
 * @returns {Array} Array of child endpoint objects with resolved parameter info
 */
export function findChildEndpoints(parentEndpoint, allEndpoints) {
  if (!parentEndpoint || !parentEndpoint.path) {
    return [];
  }

  const children = allEndpoints.filter(endpoint => {
    // Must be the same HTTP method (or GET for reading details)
    const isSameOrGetMethod = endpoint.method === parentEndpoint.method || endpoint.method === 'GET';

    // Get all parameters (path and query) that match parent pattern
    const allParams = endpoint.parameters || [];

    // Must be a related child path with matching parameters
    const isChild = isRelatedChildPath(parentEndpoint.path, endpoint.path, allParams);

    return isSameOrGetMethod && isChild;
  });

  return children.map(child => {
    // Collect all parameter names that match the parent (path or query)
    const matchingParams = (child.parameters || [])
      .filter(param => paramMatchesParent(param.name, parentEndpoint.path))
      .map(param => param.name);

    return {
      ...child,
      paramNames: matchingParams
    };
  });
}

/**
 * Resolve parameter values from row data
 * @param {string[]} paramNames - Parameter names like ["attack_path_id", "id"]
 * @param {Object} rowData - Row data object
 * @returns {Object} Object mapping param names to values
 */
export function resolveParamsFromRow(paramNames, rowData) {
  const resolved = {};

  paramNames.forEach(paramName => {
    // Try exact match first
    if (rowData[paramName] !== undefined) {
      resolved[paramName] = rowData[paramName];
      return;
    }

    // Try common ID field variations: id, _id
    if (paramName.toLowerCase().includes('id')) {
      if (rowData['id'] !== undefined) {
        resolved[paramName] = rowData['id'];
        return;
      }
      if (rowData['_id'] !== undefined) {
        resolved[paramName] = rowData['_id'];
        return;
      }
    }

    // Try partial match (e.g., "attack_path_id" might find "id")
    const possibleKeys = Object.keys(rowData).filter(key =>
      key.toLowerCase().includes(paramName.toLowerCase()) ||
      paramName.toLowerCase().includes(key.toLowerCase())
    );

    if (possibleKeys.length > 0) {
      resolved[paramName] = rowData[possibleKeys[0]];
    }
  });

  return resolved;
}
