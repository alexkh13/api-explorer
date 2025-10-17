// Mutation Code Generator
// Generates code for POST, PUT, PATCH, and DELETE requests

import { IMPORTS, generateFetchOptions } from '../../utils/code-templates.js';
import { generateFormField, buildFunctionWrapper, wrapWithLayout } from '../../utils/code-generation-helpers.js';

/**
 * Generate code for mutation request with request body (POST/PUT/PATCH)
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
function generateMutationWithBody(funcName, fullUrl, endpoint, bearerToken = null) {
  const props = endpoint.requestBody.properties;
  const propNames = Object.keys(props);

  const initialState = '{' + propNames.map(name =>
    `${name}: ${JSON.stringify(props[name].default)}`
  ).join(', ') + '}';

  const fetchOptions = generateFetchOptions(endpoint.method, true, bearerToken);
  const formFields = propNames.map(name => generateFormField(name, props[name])).join('\n');

  const states = `  const [formData, setFormData] = useState(${initialState});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);`;

  const logic = `  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('${fullUrl}'${fetchOptions})
      .then(response => response.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };`;

  const formContent = `      <form onSubmit={handleSubmit} style={{ marginBottom: '6px' }}>
${formFields}
        <button type="submit" disabled={loading} style={{ marginTop: '2px', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <Response data={result} />`;

  const jsx = wrapWithLayout(formContent);

  return buildFunctionWrapper(funcName, IMPORTS, states, logic, jsx);
}

/**
 * Generate code for mutation request without body (e.g., DELETE)
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
function generateMutationWithoutBody(funcName, fullUrl, endpoint, bearerToken = null) {
  const fetchOptions = generateFetchOptions(endpoint.method, false, bearerToken);

  const states = `  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);`;

  const logic = `  const handleClick = () => {
    setLoading(true);
    fetch('${fullUrl}'${fetchOptions})
      .then(response => response.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };`;

  const content = `      <button onClick={handleClick} disabled={loading} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
        {loading ? 'Processing...' : '${endpoint.method}'}
      </button>
      <Response data={result} />`;

  const jsx = wrapWithLayout(content);

  return buildFunctionWrapper(funcName, IMPORTS, states, logic, jsx);
}

/**
 * Generate code for mutation request (POST/PUT/PATCH/DELETE)
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
export function generateMutationCode(funcName, fullUrl, endpoint, bearerToken = null) {
  if (endpoint.requestBody && endpoint.requestBody.properties) {
    return generateMutationWithBody(funcName, fullUrl, endpoint, bearerToken);
  } else {
    return generateMutationWithoutBody(funcName, fullUrl, endpoint, bearerToken);
  }
}
