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
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const DataDisplay = ({ data }) => {
    if (data === null || data === undefined) return <span style={{ color: '#999', fontSize: '13px' }}>null</span>;

    if (Array.isArray(data)) {
      if (data.length === 0) return <span style={{ color: '#999', fontSize: '13px' }}>[]</span>;

      const firstItem = data[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        const keys = Object.keys(firstItem);
        return (
          <div style={{ overflowX: 'auto', margin: '8px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#4a5568', color: '#fff' }}>
                  {keys.map(key => (
                    <th key={key} style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #2d3748', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    {keys.map(key => (
                      <td key={key} style={{ padding: '6px 10px' }}>
                        <DataDisplay data={item[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <ul style={{ margin: '4px 0', paddingLeft: '18px', fontSize: '13px' }}>
            {data.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}><DataDisplay data={item} /></li>
            ))}
          </ul>
        );
      }
    }

    if (typeof data === 'object') {
      return (
        <div style={{ marginLeft: '12px', fontSize: '13px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#2563eb', fontSize: '12px' }}>{key}:</strong>{' '}
              {Array.isArray(value) || (typeof value === 'object' && value !== null) ? (
                <DataDisplay data={value} />
              ) : (
                <span>{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return <span style={{ fontSize: '13px' }}>{String(data)}</span>;
  };

  React.useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Users List</h3>
      </div>
      {loading && <p style={{ fontSize: '13px', color: '#718096' }}>Loading...</p>}
      {!loading && users.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={users} />
        </div>
      )}
    </div>
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
  const [postId, setPostId] = React.useState(1);
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [paramsOpen, setParamsOpen] = React.useState(false);

  const DataDisplay = ({ data }) => {
    if (data === null || data === undefined) return <span style={{ color: '#999', fontSize: '13px' }}>null</span>;

    if (Array.isArray(data)) {
      if (data.length === 0) return <span style={{ color: '#999', fontSize: '13px' }}>[]</span>;

      const firstItem = data[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        const keys = Object.keys(firstItem);
        return (
          <div style={{ overflowX: 'auto', margin: '8px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#4a5568', color: '#fff' }}>
                  {keys.map(key => (
                    <th key={key} style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #2d3748', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    {keys.map(key => (
                      <td key={key} style={{ padding: '6px 10px' }}>
                        <DataDisplay data={item[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <ul style={{ margin: '4px 0', paddingLeft: '18px', fontSize: '13px' }}>
            {data.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}><DataDisplay data={item} /></li>
            ))}
          </ul>
        );
      }
    }

    if (typeof data === 'object') {
      return (
        <div style={{ marginLeft: '12px', fontSize: '13px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#2563eb', fontSize: '12px' }}>{key}:</strong>{' '}
              {Array.isArray(value) || (typeof value === 'object' && value !== null) ? (
                <DataDisplay data={value} />
              ) : (
                <span>{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return <span style={{ fontSize: '13px' }}>{String(data)}</span>;
  };

  React.useEffect(() => {
    setLoading(true);
    fetch(\`https://jsonplaceholder.typicode.com/posts/\${postId}\`)
      .then(response => response.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [postId]);

  return (
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Post Details</h3>
      </div>
      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', marginBottom: '6px', border: '1px solid #e2e8f0' }}>
        <div
          onClick={() => setParamsOpen(!paramsOpen)}
          style={{
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: 600,
            color: '#4a5568',
            userSelect: 'none'
          }}
        >
          <span>⚙️ Parameters</span>
          <span style={{ transform: paramsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '10px' }}>▶</span>
        </div>
        {paramsOpen && (
          <div style={{ padding: '6px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
            <div style={{ marginBottom: '4px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>Post ID:</label>
              <input
                type="number"
                value={postId}
                onChange={(e) => setPostId(parseInt(e.target.value))}
                min="1"
                max="100"
                style={{ width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}
      </div>
      {loading && <p style={{ fontSize: '13px', color: '#718096' }}>Loading...</p>}
      {post && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={post} />
        </div>
      )}
    </div>
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
  const [formData, setFormData] = React.useState({
    title: '',
    body: '',
    userId: 1
  });
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const DataDisplay = ({ data }) => {
    if (data === null || data === undefined) return <span style={{ color: '#999', fontSize: '13px' }}>null</span>;

    if (Array.isArray(data)) {
      if (data.length === 0) return <span style={{ color: '#999', fontSize: '13px' }}>[]</span>;

      const firstItem = data[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        const keys = Object.keys(firstItem);
        return (
          <div style={{ overflowX: 'auto', margin: '8px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#4a5568', color: '#fff' }}>
                  {keys.map(key => (
                    <th key={key} style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #2d3748', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    {keys.map(key => (
                      <td key={key} style={{ padding: '6px 10px' }}>
                        <DataDisplay data={item[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <ul style={{ margin: '4px 0', paddingLeft: '18px', fontSize: '13px' }}>
            {data.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}><DataDisplay data={item} /></li>
            ))}
          </ul>
        );
      }
    }

    if (typeof data === 'object') {
      return (
        <div style={{ marginLeft: '12px', fontSize: '13px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#2563eb', fontSize: '12px' }}>{key}:</strong>{' '}
              {Array.isArray(value) || (typeof value === 'object' && value !== null) ? (
                <DataDisplay data={value} />
              ) : (
                <span>{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return <span style={{ fontSize: '13px' }}>{String(data)}</span>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Create New Post</h3>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '6px' }}>
        <div style={{ marginBottom: '4px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '4px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>Body:</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({...formData, body: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px', minHeight: '60px', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ marginBottom: '4px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>User ID:</label>
          <input
            type="number"
            value={formData.userId}
            onChange={(e) => setFormData({...formData, userId: parseInt(e.target.value)})}
            style={{ display: 'block', width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '2px', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
      {result && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={result} />
        </div>
      )}
    </div>
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

// Shared DataDisplay component code
const DATA_DISPLAY_COMPONENT = `  const DataDisplay = ({ data }) => {
    if (data === null || data === undefined) return <span style={{ color: '#999', fontSize: '13px' }}>null</span>;

    if (Array.isArray(data)) {
      if (data.length === 0) return <span style={{ color: '#999', fontSize: '13px' }}>[]</span>;

      const firstItem = data[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        const keys = Object.keys(firstItem);
        return (
          <div style={{ overflowX: 'auto', margin: '8px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#4a5568', color: '#fff' }}>
                  {keys.map(key => (
                    <th key={key} style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #2d3748', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    {keys.map(key => (
                      <td key={key} style={{ padding: '6px 10px' }}>
                        <DataDisplay data={item[key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <ul style={{ margin: '4px 0', paddingLeft: '18px', fontSize: '13px' }}>
            {data.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}><DataDisplay data={item} /></li>
            ))}
          </ul>
        );
      }
    }

    if (typeof data === 'object') {
      return (
        <div style={{ marginLeft: '12px', fontSize: '13px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <strong style={{ color: '#2563eb', fontSize: '12px' }}>{key}:</strong>{' '}
              {Array.isArray(value) || (typeof value === 'object' && value !== null) ? (
                <DataDisplay data={value} />
              ) : (
                <span>{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return <span style={{ fontSize: '13px' }}>{String(data)}</span>;
  };`;

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
      const pathParams = endpoint.parameters.filter(p => p.in === 'path');
      const queryParams = endpoint.parameters.filter(p => p.in === 'query');

      let stateInit = '';
      let stateVars = '';
      pathParams.forEach(param => {
        stateInit += `  const [${param.name}, set${param.name.charAt(0).toUpperCase() + param.name.slice(1)}] = React.useState(${JSON.stringify(param.default)});\n`;
        stateVars += param.name + ', ';
      });
      queryParams.forEach(param => {
        stateInit += `  const [${param.name}, set${param.name.charAt(0).toUpperCase() + param.name.slice(1)}] = React.useState(${JSON.stringify(param.default)});\n`;
        stateVars += param.name + ', ';
      });

      let urlConstruction = `\`${fullUrl}\``;
      pathParams.forEach(param => {
        urlConstruction = urlConstruction.replace(`:${param.name}`, `\${${param.name}}`);
      });

      if (queryParams.length > 0) {
        urlConstruction += ' + "?" + ';
        urlConstruction += queryParams.map(p => `"${p.name}=" + ${p.name}`).join(' + "&" + ');
      }

      const fetchOptions = generateFetchOptions(null, false);

      return `function ${funcName}() {
${stateInit}  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [paramsOpen, setParamsOpen] = React.useState(false);

${DATA_DISPLAY_COMPONENT}

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
  }, [${stateVars.slice(0, -2)}]);

  return (
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>${endpoint.title}</h3>
      </div>
      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', marginBottom: '6px', border: '1px solid #e2e8f0' }}>
        <div
          onClick={() => setParamsOpen(!paramsOpen)}
          style={{
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: 600,
            color: '#4a5568',
            userSelect: 'none'
          }}
        >
          <span>⚙️ Parameters</span>
          <span style={{ transform: paramsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '10px' }}>▶</span>
        </div>
        {paramsOpen && (
          <div style={{ padding: '6px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
${pathParams.map(p => `            <div style={{ marginBottom: '4px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>${p.name}:</label>
              <input
                type="${p.type === 'integer' ? 'number' : 'text'}"
                value={${p.name}}
                onChange={(e) => set${p.name.charAt(0).toUpperCase() + p.name.slice(1)}(${p.type === 'integer' ? 'parseInt(e.target.value)' : 'e.target.value'})}
                style={{ width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
              />
            </div>`).join('\n')}
${queryParams.map(p => `            <div style={{ marginBottom: '4px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>${p.name}:</label>
              <input
                type="${p.type === 'integer' ? 'number' : 'text'}"
                value={${p.name}}
                onChange={(e) => set${p.name.charAt(0).toUpperCase() + p.name.slice(1)}(${p.type === 'integer' ? 'parseInt(e.target.value)' : 'e.target.value'})}
                style={{ width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
              />
            </div>`).join('\n')}
          </div>
        )}
      </div>
      {loading && <p style={{ fontSize: '13px', color: '#718096' }}>Loading...</p>}
      {data && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={data} />
        </div>
      )}
    </div>
  );
}`;
    } else {
      // Simple GET without parameters
      const fetchOptions = generateFetchOptions(null, false);

      return `function ${funcName}() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

${DATA_DISPLAY_COMPONENT}

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
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>${endpoint.title}</h3>
      </div>
      {loading && <p style={{ fontSize: '13px', color: '#718096' }}>Loading...</p>}
      {data && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={data} />
        </div>
      )}
    </div>
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

      return `function ${funcName}() {
  const [formData, setFormData] = React.useState(${initialState});
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

${DATA_DISPLAY_COMPONENT}

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
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>${endpoint.title}</h3>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '6px' }}>
${propNames.map(name => {
  const prop = props[name];
  const inputType = prop.type === 'integer' ? 'number' : prop.type === 'boolean' ? 'checkbox' : 'text';
  const isTextarea = prop.type === 'string' && name.toLowerCase().includes('body');

  if (isTextarea) {
    return `        <div style={{ marginBottom: '4px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>${name}:</label>
          <textarea
            value={formData.${name}}
            onChange={(e) => setFormData({...formData, ${name}: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px', minHeight: '60px', fontFamily: 'inherit' }}
          />
        </div>`;
  } else if (prop.type === 'boolean') {
    return `        <div style={{ marginBottom: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.${name}}
              onChange={(e) => setFormData({...formData, ${name}: e.target.checked})}
              style={{ marginRight: '4px' }}
            />
            ${name}
          </label>
        </div>`;
  } else {
    return `        <div style={{ marginBottom: '4px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }}>${name}:</label>
          <input
            type="${inputType}"
            value={formData.${name}}
            onChange={(e) => setFormData({...formData, ${name}: ${prop.type === 'integer' ? 'parseInt(e.target.value)' : 'e.target.value'}})}
            style={{ display: 'block', width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
          />
        </div>`;
  }
}).join('\n')}
        <button type="submit" disabled={loading} style={{ marginTop: '2px', padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={result} />
        </div>
      )}
    </div>
  );
}`;
    } else {
      // Simple request without body (e.g., DELETE)
      const fetchOptions = generateFetchOptions(endpoint.method, false);

      return `function ${funcName}() {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

${DATA_DISPLAY_COMPONENT}

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
    <div style={{ padding: '6px', maxWidth: '100%' }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>${endpoint.title}</h3>
      </div>
      <button onClick={handleClick} disabled={loading} style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
        {loading ? 'Processing...' : '${endpoint.method}'}
      </button>
      {result && (
        <div style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }}>Response:</div>
          <DataDisplay data={result} />
        </div>
      )}
    </div>
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
