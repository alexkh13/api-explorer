// Mutation Code Generator
// Generates code for POST, PUT, PATCH, and DELETE requests

import { IMPORTS, generateFetchOptions } from '../../utils/code-templates.js';

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

  const formFields = propNames.map(name => {
    const prop = props[name];
    const isTextarea = prop.type === 'string' && name.toLowerCase().includes('body');
    const setter = `(val) => setFormData({...formData, ${name}: val})`;

    if (isTextarea) {
      return `        <Textarea label="${name}" value={formData.${name}} onChange=${setter} />`;
    } else if (prop.type === 'boolean') {
      return `        <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', marginBottom: '4px', cursor: 'pointer' }}>
          <input type="checkbox" checked={formData.${name}} onChange={(e) => setFormData({...formData, ${name}: e.target.checked})} style={{ marginRight: '4px' }} />
          ${name}
        </label>`;
    } else {
      return `        <Input label="${name}" value={formData.${name}} onChange=${setter} type="${prop.type === 'integer' ? 'number' : 'text'}" />`;
    }
  }).join('\n');

  return `function ${funcName}() {
${IMPORTS}
  const [formData, setFormData] = React.useState(${initialState});
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
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
  };

  return (
    <Layout title="${endpoint.title}" loading={loading}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '6px' }}>
${formFields}
        <button type="submit" disabled={loading} style={{ marginTop: '2px', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <Response data={result} />
    </Layout>
  );
}`;
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

  return `function ${funcName}() {
${IMPORTS}
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
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
  };

  return (
    <Layout title="${endpoint.title}" loading={loading}>
      <button onClick={handleClick} disabled={loading} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
        {loading ? 'Processing...' : '${endpoint.method}'}
      </button>
      <Response data={result} />
    </Layout>
  );
}`;
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
