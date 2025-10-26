// Code generator for virtual endpoints
// Generates standard GET request code (just like regular endpoints)
// The fetch will be intercepted and execute the virtual endpoint's custom code

export function generateVirtualEndpointCode(virtualEndpoint, realEndpoints) {
  const { name, path, method = 'GET' } = virtualEndpoint;

  // Extract path parameters from the path
  const pathParams = extractPathParams(path);

  // Generate standard endpoint code (same as regular endpoints)
  return `import React, { useState, useEffect } from 'react';
import { Layout, Response, Input } from '/services/preview/api-explorer-utils.jsx';

function ${sanitizeFunctionName(name)}() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Path parameters
  ${pathParams.map(param => `const [${param}, set${capitalize(param)}] = useState('');`).join('\n  ')}

  // Fetch data using useEffect${pathParams.length > 0 ? ' when params are provided' : ' on mount'}
  useEffect(() => {
    ${pathParams.length > 0 ? `if (!${pathParams.map(p => p).join(' || !')}) return;` : ''}

    setLoading(true);
    setError(null);

    // Build URL with parameters
    let url = '${path}';
    ${pathParams.map(param => `url = url.replace(':${param}', encodeURIComponent(${param}));`).join('\n    ')}

    fetch(url, {
      method: '${method}',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [${pathParams.join(', ')}]);

  return (
    <Layout>
      ${pathParams.length > 0 ? `<Input label="${pathParams[0]}" value={${pathParams[0]}} onChange={(e) => set${capitalize(pathParams[0])}(e.target.value)} />` : ''}
      <Response data={data} currentPath="${path}" />
    </Layout>
  );
}

export default ${sanitizeFunctionName(name)};`;
}

// Extract path parameters from a path like /virtual/user/:id/:postId
function extractPathParams(path) {
  const matches = path.match(/:([a-zA-Z0-9_]+)/g);
  if (!matches) return [];
  return matches.map(match => match.slice(1)); // Remove the : prefix
}

// Sanitize function name for valid JavaScript identifier
function sanitizeFunctionName(name) {
  return name
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .replace(/^_+/, '')
    || 'VirtualEndpoint';
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
