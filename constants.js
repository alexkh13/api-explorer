// Plain JS module - no JSX, no imports
// This file exports constants and configuration data

window.AppConstants = {
  initialEndpointsData: [
    {
      id: "1",
      title: "GET /users",
      description: "Fetch a list of all users",
      method: "GET",
      path: "/users",
      starterCode: `function fetchUsers() {
  const { Layout, Response } = window.APIExplorer;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
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
    <Layout title="Users List" loading={loading}>
      <Response data={data} />
    </Layout>
  );
}`,
      completed: false,
    },
    {
      id: "2",
      title: "GET /posts/:id",
      description: "Fetch a specific post by ID",
      method: "GET",
      path: "/posts/:id",
      parameters: [
        { name: "id", in: "path", type: "integer", default: 1 }
      ],
      starterCode: `function fetchPost() {
  const { Layout, Params, Input, Response } = window.APIExplorer;
  const [id, setId] = React.useState(1);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`)
      .then(response => response.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [id]);

  return (
    <Layout title="Post Details" loading={loading}>
      <Params>
        <Input label="id" value={id} onChange={setId} type="number" />
      </Params>
      <Response data={data} />
    </Layout>
  );
}`,
      completed: false,
    },
    {
      id: "3",
      title: "POST /posts",
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
      starterCode: `function createPost() {
  const { Layout, Input, Textarea, Response } = window.APIExplorer;
  const [formData, setFormData] = React.useState({title: '', body: '', userId: 1});
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    })
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
    <Layout title="Create New Post" loading={loading}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '6px' }}>
        <Input label="title" value={formData.title} onChange={(val) => setFormData({...formData, title: val})} type="text" />
        <Textarea label="body" value={formData.body} onChange={(val) => setFormData({...formData, body: val})} />
        <Input label="userId" value={formData.userId} onChange={(val) => setFormData({...formData, userId: val})} type="number" />
        <button type="submit" disabled={loading} style={{ marginTop: '2px', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
      <Response data={result} />
    </Layout>
  );
}`,
      completed: false,
    },
  ],

  AI_PROVIDERS: {
    OPENAI: {
      name: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKeyName: 'OPENAI_API_KEY',
      defaultModel: 'gpt-3.5-turbo',
      models: [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
      ],
      formatRequest: (prompt, code, model) => ({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant that helps write and improve code for a browser-based React application.

IMPORTANT ENVIRONMENT CONSTRAINTS:
- This is a pure browser environment using ES modules (no Node.js, no build steps)
- Code uses React 18 with Babel standalone for JSX transpilation
- All imports must use ES module syntax (import React from 'react')
- No npm packages are available except those explicitly imported via CDN/import maps
- Available libraries: React, ReactDOM, CodeMirror
- No server-side code, database access, or file system operations
- All code must run entirely in the browser

AVAILABLE COMPONENTS:
- Header: Main application header with logo and action buttons
- Sidebar: Shows list of API endpoints
- EndpointItem: Individual endpoint in the sidebar with accordion expansion
- CodeEditor: CodeMirror-based editor component
- Preview: Live preview of code execution
- AIAssistant: AI code generation assistant (this component)
- APIKeyDialog: Dialog for API configuration

Respond with only the code changes requested. No explanations, just the code.`
          },
          {
            role: 'user',
            content: `I have the following code:\n\n\`\`\`\n${code}\n\`\`\`\n\nRequest: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }),
      customHeaders: (apiKey) => ({
        'Authorization': `Bearer ${apiKey}`
      }),
      extractResponse: (data) => data.choices[0].message.content
    },
    ANTHROPIC: {
      name: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1/messages',
      apiKeyName: 'ANTHROPIC_API_KEY',
      defaultModel: 'claude-3-haiku-20240307',
      models: [
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }
      ],
      formatRequest: (prompt, code, model) => ({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 2048,
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant that helps write and improve code for a browser-based React application.

IMPORTANT ENVIRONMENT CONSTRAINTS:
- This is a pure browser environment using ES modules (no Node.js, no build steps)
- Code uses React 18 with Babel standalone for JSX transpilation
- All imports must use ES module syntax (import React from 'react')
- No npm packages are available except those explicitly imported via CDN/import maps
- Available libraries: React, ReactDOM, CodeMirror
- No server-side code, database access, or file system operations
- All code must run entirely in the browser

AVAILABLE COMPONENTS:
- Header: Main application header with logo and action buttons
- Sidebar: Shows list of API endpoints
- EndpointItem: Individual endpoint in the sidebar with accordion expansion
- CodeEditor: CodeMirror-based editor component
- Preview: Live preview of code execution
- AIAssistant: AI code generation assistant (this component)
- APIKeyDialog: Dialog for API configuration`
          },
          {
            role: 'user',
            content: `I have the following code:\n\n\`\`\`\n${code}\n\`\`\`\n\nRequest: ${prompt}\n\nRespond with only the code changes requested. No explanations, just the code.`
          }
        ]
      }),
      customHeaders: (apiKey) => ({
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }),
      extractResponse: (data) => data.content[0].text
    }
  }
};

// Parse OpenAPI v3 spec and convert to endpoints
window.parseOpenAPISpec = function(spec, bearerToken) {
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
          completed: false
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

        // Generate starter code
        endpoint.starterCode = generateStarterCode(endpoint, baseUrl, bearerToken);
        endpoints.push(endpoint);
      }
    });
  });

  return endpoints;
};

// Import shared utilities from APIExplorer global
const IMPORTS = `const { Layout, Params, Input, Textarea, Response } = window.APIExplorer;`;

// Generate starter code for an endpoint
function generateStarterCode(endpoint, baseUrl, bearerToken) {
  const fullUrl = baseUrl + endpoint.path;
  const funcName = `${endpoint.method.toLowerCase()}${endpoint.path.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // Generate fetch options with auth header if bearer token is provided
  const generateFetchOptions = (method, includeBody) => {
    const options = [];
    if (method && method !== 'GET') {
      options.push(`method: '${method}'`);
    }

    const headers = [];
    if (includeBody) {
      headers.push(`'Content-Type': 'application/json'`);
    }
    if (bearerToken) {
      headers.push(`'Authorization': 'Bearer ${bearerToken}'`);
    }

    if (headers.length > 0) {
      options.push(`headers: {\n        ${headers.join(',\n        ')}\n      }`);
    }

    if (includeBody) {
      options.push('body: JSON.stringify(formData)');
    }

    return options.length > 0 ? `, {\n      ${options.join(',\n      ')}\n    }` : '';
  };

  if (endpoint.method === 'GET') {
    // Generate GET request with parameters
    if (endpoint.parameters && endpoint.parameters.length > 0) {
      const allParams = endpoint.parameters;
      const pathParams = allParams.filter(p => p.in === 'path');
      const queryParams = allParams.filter(p => p.in === 'query');

      const stateInit = allParams.map(p =>
        `  const [${p.name}, set${p.name.charAt(0).toUpperCase() + p.name.slice(1)}] = React.useState(${JSON.stringify(p.default)});`
      ).join('\n');

      const stateVars = allParams.map(p => p.name).join(', ');

      let urlConstruction = `\`${fullUrl}\``;
      pathParams.forEach(param => {
        urlConstruction = urlConstruction.replace(`:${param.name}`, `\${${param.name}}`);
      });

      if (queryParams.length > 0) {
        urlConstruction += ' + "?" + ' + queryParams.map(p => `"${p.name}=" + ${p.name}`).join(' + "&" + ');
      }

      const fetchOptions = generateFetchOptions(null, false);

      const paramInputs = allParams.map(p =>
        `        <Input label="${p.name}" value={${p.name}} onChange={set${p.name.charAt(0).toUpperCase() + p.name.slice(1)}} type="${p.type === 'integer' ? 'number' : 'text'}" />`
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
    } else {
      // Simple GET without parameters
      const fetchOptions = generateFetchOptions(null, false);

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
  } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method)) {
    // Generate form for POST/PUT/PATCH/DELETE
    if (endpoint.requestBody && endpoint.requestBody.properties) {
      const props = endpoint.requestBody.properties;
      const propNames = Object.keys(props);

      const initialState = '{' + propNames.map(name =>
        `${name}: ${JSON.stringify(props[name].default)}`
      ).join(', ') + '}';

      const fetchOptions = generateFetchOptions(endpoint.method, true);

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
    } else {
      // Simple request without body (e.g., DELETE)
      const fetchOptions = generateFetchOptions(endpoint.method, false);

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
  }
}

// Test runner utility (updated for endpoints)
window.runTests = function(endpointId, userCode, endpoints) {
  endpoints = endpoints || window.AppConstants.initialEndpointsData;
  const endpoint = endpoints.find(e => e.id === endpointId);

  if (!endpoint) return { success: false, error: 'Endpoint not found' };

  try {
    // For API endpoints, we just validate that the code is valid
    const match = userCode.match(/function\s+(\w+)/);
    if (!match) return { success: false, error: 'Cannot identify function name' };

    // Try to parse the code with Babel to ensure it's valid
    window.Babel.transform(userCode, { presets: ['react'] });

    return { success: true, message: 'Code is valid and ready to run' };
  } catch (e) {
    return { success: false, error: e.message || 'Code validation failed' };
  }
};
