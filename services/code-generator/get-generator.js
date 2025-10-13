// GET Request Code Generator
// Generates code for GET requests with and without parameters

import { IMPORTS, generateFetchOptions, capitalize, detectPaginationPattern } from '../../utils/code-templates.js';
import { generatePaginatedCode } from './pagination-generator.js';

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
  const stateInit = allParams.map(p =>
    `  const [${p.name}, set${capitalize(p.name)}] = React.useState(${JSON.stringify(p.default)});`
  ).join('\n');

  const stateVars = allParams.map(p => p.name).join(', ');

  let urlConstruction = `\`${fullUrl}\``;
  pathParams.forEach(param => {
    urlConstruction = urlConstruction.replace(`:${param.name}`, `\${${param.name}}`);
  });

  if (queryParams.length > 0) {
    urlConstruction += ' + "?" + ' + queryParams.map(p => `"${p.name}=" + ${p.name}`).join(' + "&" + ');
  }

  const fetchOptions = generateFetchOptions(null, false, bearerToken);

  const paramInputs = allParams.map(p =>
    `        <Input label="${p.name}" value={${p.name}} onChange={set${capitalize(p.name)}} type="${p.type === 'integer' ? 'number' : 'text'}" />`
  ).join('\n');

  return `function ${funcName}() {
${IMPORTS}
${stateInit}
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(${urlConstruction}${fetchOptions})
      .then(response => response.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [${stateVars}]);

  return (
    <Layout title="${endpoint.title}" loading={loading}>
      <Params>
${paramInputs}
      </Params>
      <Response data={data} />
    </Layout>
  );
}`;
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

  return `function ${funcName}() {
${IMPORTS}
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch('${fullUrl}'${fetchOptions})
      .then(response => response.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="${endpoint.title}" loading={loading}>
      <Response data={data} />
    </Layout>
  );
}`;
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
