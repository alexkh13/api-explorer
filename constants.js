// Plain JS module - no JSX
// This file exports constants and configuration data

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

export const AI_PROVIDERS = {
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
};

// Parse OpenAPI v3 spec and convert to endpoints
// Returns an object with endpoints (metadata only) and baseUrl for dynamic code generation
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

// Import shared utilities from APIExplorer global
const IMPORTS = `const { Layout, Params, Input, Textarea, Response } = window.APIExplorer;`;

// Generate starter code for an endpoint dynamically
export function generateStarterCode(endpoint, baseUrl, bearerToken = null) {
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

      // Check if pagination pattern is present (skip/limit, offset/limit, _start/_limit, etc.)
      const skipNames = ['skip', 'offset', '_start', 'start'];
      const limitNames = ['limit', '_limit', 'count', 'per_page', 'pageSize'];

      const skipParam = queryParams.find(p => skipNames.includes(p.name));
      const limitParam = queryParams.find(p => limitNames.includes(p.name));
      const isPaginated = skipParam && limitParam;

      if (isPaginated) {
        // Generate paginated version with infinite scroll
        const nonPaginationParams = allParams.filter(p => p.name !== skipParam.name && p.name !== limitParam.name);

        const stateInit = nonPaginationParams.map(p =>
          `  const [${p.name}, set${p.name.charAt(0).toUpperCase() + p.name.slice(1)}] = React.useState(${JSON.stringify(p.default)});`
        ).join('\n');

        const nonPaginationStateVars = nonPaginationParams.map(p => p.name).join(', ');

        let urlBase = `\`${fullUrl}\``;
        pathParams.forEach(param => {
          urlBase = urlBase.replace(`:${param.name}`, `\${${param.name}}`);
        });

        const nonPaginationQueryParams = queryParams.filter(p => p.name !== skipParam.name && p.name !== limitParam.name);

        const fetchOptions = generateFetchOptions(null, false);

        const paramInputs = nonPaginationParams.length > 0
          ? nonPaginationParams.map(p =>
              `        <Input label="${p.name}" value={${p.name}} onChange={set${p.name.charAt(0).toUpperCase() + p.name.slice(1)}} type="${p.type === 'integer' ? 'number' : 'text'}" />`
            ).join('\n')
          : '';

        const hasParamsSection = paramInputs.length > 0;

        const skipVarName = skipParam.name.replace(/^_/, '');
        const limitVarName = limitParam.name.replace(/^_/, '');
        const skipRefName = skipVarName + 'Ref';

        // Build query params array including both non-pagination and pagination params
        const allQueryParamsForUrl = [
          ...nonPaginationQueryParams.map(p => `"${p.name}=" + ${p.name}`),
          `"${skipParam.name}=" + current${skipVarName.charAt(0).toUpperCase() + skipVarName.slice(1)}`,
          `"${limitParam.name}=" + ${limitVarName}`
        ];
        const queryParamsConstruction = '"?" + ' + allQueryParamsForUrl.join(' + "&" + ');

        return `function ${funcName}() {
  const { Layout, Params, Input, PaginatedResponse, Toolbar, Response, ErrorDisplay } = window.APIExplorer;
${stateInit}
  const [allResults, setAllResults] = React.useState([]);
  const [responseData, setResponseData] = React.useState(null);
  const ${skipRefName} = React.useRef(${JSON.stringify(skipParam.default)});
  const [${limitVarName}] = React.useState(${JSON.stringify(limitParam.default)});
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchPage = React.useCallback((current${skipVarName.charAt(0).toUpperCase() + skipVarName.slice(1)}) => {
    const queryParams = ${queryParamsConstruction};
    const url = ${urlBase} + queryParams;

    console.log('Fetching:', url);

    return fetch(url${fetchOptions})
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Response:', result);
        // Handle both array responses and object responses with 'results' key
        const newData = Array.isArray(result) ? result : (result.results || []);
        const isLastPage = newData.length < ${limitVarName};

        setAllResults(prev => [...prev, ...newData]);
        setResponseData(result);
        ${skipRefName}.current = Number(current${skipVarName.charAt(0).toUpperCase() + skipVarName.slice(1)}) + Number(${limitVarName});
        setHasMore(!isLastPage);
        setError(null);

        return result;
      });
  }, [${nonPaginationStateVars ? nonPaginationStateVars + ', ' : ''}${limitVarName}]);

  React.useEffect(() => {
    setLoading(true);
    setAllResults([]);
    ${skipRefName}.current = ${JSON.stringify(skipParam.default)};
    setHasMore(true);
    setError(null);
    fetchPage(${JSON.stringify(skipParam.default)})
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [${nonPaginationStateVars ? nonPaginationStateVars + ', ' : ''}fetchPage]);

  const handleLoadMore = React.useCallback(() => {
    return fetchPage(${skipRefName}.current).catch(err => {
      console.error('Load more error:', err);
      setError(err.message);
    });
  }, [fetchPage]);

  // Check if response is an object with keys other than 'results'
  const hasToolbarData = responseData && typeof responseData === 'object' &&
    !Array.isArray(responseData) && Object.keys(responseData).some(key => key !== 'results');

  return (
    <Layout title="${endpoint.title}" loading={loading}>
${hasParamsSection ? `      <Params>
${paramInputs}
      </Params>` : ''}
      <ErrorDisplay error={error} />
      {hasToolbarData && <Toolbar data={responseData} exclude={['results']} />}
      {!error && <PaginatedResponse
        data={allResults}
        onLoadMore={handleLoadMore}
        loading={loading}
        hasMore={hasMore}
      />}
    </Layout>
  );
}`;
      } else {
        // Regular non-paginated version
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
      }
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

// Generate initialEndpointsData by dynamically creating starterCode for each endpoint
// This ensures consistency between initial endpoints and spec-loaded endpoints
export const initialEndpointsData = initialEndpointsMetadata.map(endpoint => ({
  ...endpoint,
  starterCode: generateStarterCode(endpoint, JSONPLACEHOLDER_BASE_URL)
}));
