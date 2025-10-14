// Code Generation Helper Utilities
// Shared patterns and builders for code generation across all generators

import { capitalize as capitalizeUtil } from './code-templates.js';

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  return capitalizeUtil(str);
}

/**
 * Generate useState declarations for parameters
 * @param {Array} params - Array of parameter objects
 * @returns {string} useState declarations
 */
export function generateStateDeclarations(params) {
  return params.map(p =>
    `  const [${p.name}, set${capitalize(p.name)}] = React.useState(${JSON.stringify(p.default)});`
  ).join('\n');
}

/**
 * Generate state variable list for dependency arrays
 * @param {Array} params - Array of parameter objects
 * @returns {string} Comma-separated state variables
 */
export function generateStateVarList(params) {
  return params.map(p => p.name).join(', ');
}

/**
 * Generate parameter input fields for forms
 * @param {Array} params - Array of parameter objects
 * @returns {string} Input field JSX
 */
export function generateParamInputs(params) {
  return params.map(p =>
    `        <Input label="${p.name}" value={${p.name}} onChange={set${capitalize(p.name)}} type="${p.type === 'integer' ? 'number' : 'text'}" />`
  ).join('\n');
}

/**
 * Build a standard fetch chain with error handling
 * @param {string} url - URL expression (can include template literals)
 * @param {string} fetchOptions - Fetch options string
 * @param {string} dataVar - Variable name to store result (default: 'result')
 * @returns {Object} Object with fetchChain and errorHandler strings
 */
export function buildFetchChain(url, fetchOptions, dataVar = 'result') {
  return {
    fetchStart: `    setLoading(true);
    fetch(${url}${fetchOptions})
      .then(response => response.json())
      .then(${dataVar} => {
        setData(${dataVar});
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });`,
  };
}

/**
 * Build standard component state declarations (data, loading)
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeData - Include data state (default: true)
 * @param {boolean} options.includeLoading - Include loading state (default: true)
 * @param {string} options.dataDefault - Default value for data (default: null)
 * @returns {string} State declarations
 */
export function buildStandardState({ includeData = true, includeLoading = true, dataDefault = 'null' } = {}) {
  const states = [];
  if (includeData) states.push(`  const [data, setData] = React.useState(${dataDefault});`);
  if (includeLoading) states.push(`  const [loading, setLoading] = React.useState(false);`);
  return states.join('\n');
}

/**
 * Build URL construction code with path and query params
 * @param {string} baseUrl - Base URL template
 * @param {Array} pathParams - Path parameters
 * @param {Array} queryParams - Query parameters
 * @returns {string} URL construction expression
 */
export function buildUrlConstruction(baseUrl, pathParams = [], queryParams = []) {
  let url = `\`${baseUrl}\``;

  // Replace path parameters
  pathParams.forEach(param => {
    url = url.replace(`:${param.name}`, `\${${param.name}}`);
  });

  // Add query parameters
  if (queryParams.length > 0) {
    url += ' + "?" + ' + queryParams.map(p => `"${p.name}=" + ${p.name}`).join(' + "&" + ');
  }

  return url;
}

/**
 * Wrap component code with Layout
 * @param {string} title - Component title
 * @param {string} content - Inner content
 * @param {Object} options - Additional options
 * @param {boolean} options.includeParams - Include Params section
 * @param {string} options.paramContent - Content inside Params
 * @returns {string} Layout wrapper JSX
 */
export function wrapWithLayout(title, content, { includeParams = false, paramContent = '' } = {}) {
  const paramsSection = includeParams && paramContent
    ? `      <Params>
${paramContent}
      </Params>`
    : '';

  return `    <Layout title="${title}" loading={loading}>
${paramsSection}${paramsSection ? '\n' : ''}${content}
    </Layout>`;
}

/**
 * Generate complete function wrapper
 * @param {string} funcName - Function name
 * @param {string} imports - Import statements
 * @param {string} states - State declarations
 * @param {string} logic - Main function logic
 * @param {string} jsx - Return JSX
 * @returns {string} Complete function code
 */
export function buildFunctionWrapper(funcName, imports, states, logic, jsx) {
  return `function ${funcName}() {
${imports}
${states}

${logic}

  return (
${jsx}
  );
}`;
}

/**
 * Build useEffect hook for data fetching
 * @param {string} fetchCode - Fetch logic to execute
 * @param {string} dependencies - Dependency array content
 * @returns {string} useEffect hook code
 */
export function buildUseEffect(fetchCode, dependencies = '') {
  return `  React.useEffect(() => {
${fetchCode}
  }, [${dependencies}]);`;
}

/**
 * Generate form field based on property type
 * @param {string} name - Field name
 * @param {Object} prop - Property configuration
 * @returns {string} Form field JSX
 */
export function generateFormField(name, prop) {
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
}
