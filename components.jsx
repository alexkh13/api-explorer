// UI Components - requires Babel transpilation
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
const { Icons } = window;
const { useTheme, useEndpoints, useAI, useToast } = window.AppContexts;

// Generic Dialog Component
function Dialog({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// API Key Dialog Component
function APIKeyDialog({ isOpen, onClose }) {
  const { providers, provider, setApiConfig } = useAI();
  const [formState, setFormState] = useState({
    provider,
    apiKey: '',
    model: ''
  });
  const [error, setError] = useState('');

  // Reset model when provider changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      model: providers[prev.provider]?.defaultModel || ''
    }));
  }, [formState.provider, providers]);

  const handleProviderChange = (provider) => {
    setFormState(prev => ({ ...prev, provider }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.apiKey) {
      setError('API key is required');
      return;
    }

    // Update context
    setApiConfig(formState);
    onClose();
  };

  const renderModelOptions = () => {
    const providerConfig = providers[formState.provider];
    if (!providerConfig?.models) return null;

    return providerConfig.models.map(model => (
      <option key={model.id} value={model.id}>{model.name}</option>
    ));
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="dialog-header">
        <h2 className="dialog-title">Configure AI Assistant</h2>
        <p className="dialog-description">
          To enable AI-powered code edits, please provide an API key for one of the supported services.
          Your key will be stored securely in your browser's local storage.
        </p>
      </div>

      <form className="dialog-form" onSubmit={handleSubmit}>
        <div className="dialog-form-group">
          <label className="dialog-label">Select AI Provider</label>
          {Object.keys(providers).map(key => (
            <div
              key={key}
              className={`provider-option ${formState.provider === key ? 'selected' : ''}`}
              onClick={() => handleProviderChange(key)}
            >
              <input
                type="radio"
                className="provider-option-input"
                checked={formState.provider === key}
                onChange={() => handleProviderChange(key)}
              />
              <span className="provider-option-label">{providers[key].name}</span>
            </div>
          ))}
        </div>

        <div className="dialog-form-group">
          <label className="dialog-label">API Key</label>
          <input
            type="password"
            className="dialog-input"
            value={formState.apiKey}
            onChange={e => {
              setFormState(prev => ({ ...prev, apiKey: e.target.value }));
              setError('');
            }}
            placeholder={`Enter your ${providers[formState.provider].name} API key`}
          />
          {error && <div style={{ color: '#e53e3e', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>{error}</div>}
        </div>

        <div className="dialog-form-group">
          <label className="dialog-label">Model</label>
          <select
            className="dialog-input"
            value={formState.model}
            onChange={e => setFormState(prev => ({ ...prev, model: e.target.value }))}
          >
            {renderModelOptions()}
          </select>
        </div>

        <div className="dialog-footer">
          <button
            type="button"
            className="secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}

// Load OpenAPI Spec Dialog Component
function LoadSpecDialog({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loadEndpointsFromSpec } = useEndpoints();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch spec: ${response.statusText}`);
      }

      const spec = await response.json();
      const { endpoints, baseUrl } = window.parseOpenAPISpec(spec, bearerToken.trim() || null);

      loadEndpointsFromSpec(endpoints, baseUrl, bearerToken.trim() || null);
      toast.addToast(`Loaded ${endpoints.length} endpoints from spec`, 'success');
      onClose();
      setUrl('');
      setBearerToken('');
    } catch (err) {
      console.error('Error loading spec:', err);
      setError(err.message || 'Failed to load OpenAPI spec');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="dialog-header">
        <h2 className="dialog-title">Load OpenAPI Spec</h2>
        <p className="dialog-description">
          Enter the URL of an OpenAPI v3 JSON specification to load all endpoints.
          Optionally provide a bearer token to include in API requests.
        </p>
      </div>

      <form className="dialog-form" onSubmit={handleSubmit}>
        <div className="dialog-form-group">
          <label className="dialog-label">Spec URL</label>
          <input
            type="url"
            className="dialog-input"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="https://api.example.com/openapi.json"
            disabled={loading}
          />
          {error && <div style={{ color: '#e53e3e', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>{error}</div>}
        </div>

        <div className="dialog-form-group">
          <label className="dialog-label">Bearer Token (optional)</label>
          <input
            type="password"
            className="dialog-input"
            value={bearerToken}
            onChange={e => setBearerToken(e.target.value)}
            placeholder="Enter bearer token for API authentication"
            disabled={loading}
          />
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Will be included as "Authorization: Bearer [token]" in generated code
          </div>
        </div>

        <div className="dialog-footer">
          <button
            type="button"
            className="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Spec'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

// Toast notification component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-notification ${type}`}>
      {message}
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

// Toast provider component
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value = useMemo(() => ({
    addToast,
    removeToast
  }), [addToast, removeToast]);

  return (
    <window.AppContexts.ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </window.AppContexts.ToastContext.Provider>
  );
}

// Process TODO comments in code
function ProcessTodoButton() {
  const { generateCompletions, isConfigured } = useAI();
  const { currentEndpointId, getEndpointCode, updateEndpointCode } = useEndpoints();
  const toast = useToast();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const handleClick = () => {
    const code = getEndpointCode(currentEndpointId);

    // Check if API is configured
    if (!isConfigured) {
      toast.addToast('Please configure your AI API key first', 'error');
      setShowApiKeyDialog(true);
      return;
    }

    // Extract TODO comments from the code
    const todoRegex = /\/\/\s*TODO:(.+?)($|\n)/g;
    const todos = [];
    let match;

    while ((match = todoRegex.exec(code)) !== null) {
      todos.push(match[1].trim());
    }

    if (todos.length === 0) {
      toast.addToast('No TODO comments found in your code!', 'warning');
      return;
    }

    // Create a prompt from the TODO comments
    const prompt = `Please implement the following TODOs in the code:\n${todos.join('\n')}`;

    // Show toast notification
    toast.addToast(`Processing ${todos.length} TODOs...`, 'info');

    // Use the AI to generate completions based on the TODOs
    generateCompletions(prompt, code, (newCode) => {
      updateEndpointCode(currentEndpointId, newCode);
      toast.addToast('TODOs implemented successfully!', 'success');
    });
  };

  return (
    <>
      <button
        className="fab-button"
        onClick={handleClick}
        title="Process TODO comments in code"
      >
        <Icons.AI />
      </button>

      <APIKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
      />
    </>
  );
}

// Load Spec Button
function LoadSpecButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        className="fab-button"
        onClick={() => setShowDialog(true)}
        title="Load OpenAPI Spec"
      >
        <Icons.File />
      </button>

      <LoadSpecDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}

// Header Component
function Header() {
  return (
    <div className="header">
      <div className="header-logo">
        <Icons.Code />
        API<span>Explorer</span>
      </div>
      <div className="header-actions">
        {/* Header actions removed and moved to FABs */}
      </div>
    </div>
  );
}

// Endpoint Item Component
function EndpointItem({ endpoint, isSelected, onSelect, isExpanded, onToggleExpand, isModified, showDetails = false }) {
  // Get method-based color class
  const getMethodClass = (method) => {
    if (!method) return 'method-get';
    return `method-${method.toLowerCase()}`;
  };

  // Get consistent icon for this endpoint - with fallback
  const iconIndex = Icons?.getEndpointIcon ? Icons.getEndpointIcon(endpoint.id) : 0;
  const EndpointIcon = Icons?.shapes?.[iconIndex] || (() => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ));

  return (
    <div className="challenge-item">
      <div
        className={`challenge-header ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(endpoint.id)}
      >
        <div className={`endpoint-icon ${getMethodClass(endpoint.method)}`}>
          <EndpointIcon />
        </div>
        <div className="challenge-title-container">
          <div className="challenge-title">
            {endpoint.title}
            {isModified && (
              <span
                className="modified-indicator"
                title="Code has been modified"
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#3182ce',
                  marginLeft: '8px',
                  verticalAlign: 'middle'
                }}
              />
            )}
          </div>
          {showDetails && (
            <div className="endpoint-details">
              {endpoint.method && (
                <span className={`method-badge ${getMethodClass(endpoint.method)}`}>
                  {endpoint.method}
                </span>
              )}
              <span className="endpoint-path">{endpoint.path || endpoint.url || ''}</span>
            </div>
          )}
          {showDetails && endpoint.description && (
            <div className="endpoint-description-inline">{endpoint.description}</div>
          )}
        </div>
        {!showDetails && (
          <div
            className={`challenge-expand ${isExpanded ? 'open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(endpoint.id);
            }}
          >
            <Icons.ChevronRight />
          </div>
        )}
      </div>
      {!showDetails && (
        <div className={`challenge-content ${isExpanded ? 'open' : ''}`}>
          <div className="challenge-description">{endpoint.description}</div>
        </div>
      )}
    </div>
  );
}

// Sidebar Component
function Sidebar() {
  const { endpoints, currentEndpointId, selectEndpoint, isEndpointModified } = useEndpoints();
  const [expandedId, setExpandedId] = useState(currentEndpointId);

  // Automatically expand the selected endpoint
  useEffect(() => {
    setExpandedId(currentEndpointId);
  }, [currentEndpointId]);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Endpoints</span>
      </div>
      <div className="challenges-list">
        {endpoints.map((endpoint) => (
          <EndpointItem
            key={endpoint.id}
            endpoint={endpoint}
            isSelected={endpoint.id === currentEndpointId}
            onSelect={selectEndpoint}
            isExpanded={expandedId === endpoint.id}
            onToggleExpand={handleToggleExpand}
            isModified={isEndpointModified(endpoint.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Preview Component
function Preview() {
  const { currentEndpointId, getEndpointCode } = useEndpoints();
  const code = getEndpointCode(currentEndpointId);
  const iframeRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastRenderedCode, setLastRenderedCode] = useState("");

  // Initial render on mount
  useEffect(() => {
    renderPreview();
  }, []);

  // Reset lastRenderedCode when endpoint changes
  useEffect(() => {
    setLastRenderedCode("");
    setHasChanges(true);
    renderPreview();
  }, [currentEndpointId]);

  useEffect(() => {
    if (code !== lastRenderedCode) {
      setHasChanges(true);
      renderPreview();
    }
  }, [code, lastRenderedCode]);

  const renderPreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Determine if the code contains React/JSX syntax
    const isReactComponent =
      code.includes("function") &&
      code.includes("return") &&
      code.includes("<");

    // Pre-transpile the code using parent window's Babel
    let transpiledCode = '';
    let renderCode = '';

    try {
      // Transpile user's JSX code to plain JavaScript
      const transformed = window.Babel.transform(code, {
        presets: ['react'],
        filename: 'preview.jsx'
      });
      transpiledCode = transformed.code;

      // Generate the render code based on component type
      if (isReactComponent) {
        // Extract component name and render it
        const match = code.match(/function\s+(\w+)/);
        if (match) {
          const componentName = match[1];
          renderCode = `
            const ComponentName = ${componentName};
            ReactDOM.render(React.createElement(ComponentName), document.getElementById('root'));
          `;
        }
      } else {
        // For non-React endpoints, show function definition
        const match = code.match(/function\s+(\w+)/);
        if (match) {
          const funcName = match[1];
          renderCode = `
            window['${funcName}'] = ${funcName};
            document.getElementById('root').innerHTML = '<h3>Function: ${funcName}</h3>' +
              '<p>Try calling this function in the browser console!</p>' +
              '<div class="success">✓ Function defined successfully</div>';
            console.log("✓ Function ${funcName} is available in the console.");
          `;
        }
      }
    } catch (error) {
      // If transpilation fails, show error in iframe
      transpiledCode = `
        document.getElementById('root').innerHTML = '<div class="error">Transpilation Error: ' + ${JSON.stringify(error.message)} + '</div>';
      `;
      renderCode = '';
    }

    const script = "script";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <${script} type="importmap">
            {
              "imports": {
                "react": "https://ga.jspm.io/npm:react@18.3.1/index.js",
                "react-dom": "https://ga.jspm.io/npm:react-dom@18.3.1/index.js"
              },
              "scopes": {
                "https://ga.jspm.io/": {
                  "scheduler": "https://ga.jspm.io/npm:scheduler@0.23.2/index.js"
                }
              }
            }
          </${script}>
          <${script} async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></${script}>
          <style>
            :root {
              --blue-500: #3182ce;
              --blue-600: #2b6cb0;
              --gray-100: #f7fafc;
              --gray-200: #edf2f7;
              --gray-700: #4a5568;
              --gray-900: #1a202c;
              --red-500: #f56565;
              --green-500: #48bb78;
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 12px;
              line-height: 1.5;
              color: var(--gray-900);
              font-size: 16px;
              margin: 0;
              background-color: #ffffff;
            }

            .dark-mode {
              background-color: var(--gray-900);
              color: var(--gray-100);
            }

            h1, h2, h3, h4, h5 {
              margin-top: 0;
              line-height: 1.2;
            }

            button {
              margin: 0 6px;
              padding: 6px 12px;
              background: var(--blue-500);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-family: inherit;
              font-size: 14px;
              font-weight: 500;
            }

            button:hover {
              background: var(--blue-600);
            }

            pre {
              background: var(--gray-100);
              padding: 16px;
              border-radius: 8px;
              overflow: auto;
              font-size: 14px;
              border: 1px solid var(--gray-200);
            }

            .error {
              color: var(--red-500);
              padding: 12px;
              border-radius: 6px;
              background-color: rgba(245, 101, 101, 0.1);
              margin: 16px 0;
            }

            .success {
              color: var(--green-500);
              padding: 12px;
              border-radius: 6px;
              background-color: rgba(72, 187, 120, 0.1);
              margin: 16px 0;
            }

            @media (prefers-color-scheme: dark) {
              body {
                background-color: var(--gray-900);
                color: var(--gray-100);
              }
              pre {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
              }
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <${script} type="module">
            import React from 'react';
            import ReactDOM from 'react-dom';

            // Shared API Explorer utilities
            window.APIExplorer = {
              // Layout component for consistent UI
              Layout: ({ title, children, loading }) => {
                return React.createElement('div', { style: { padding: '2px', maxWidth: '100%' } },
                  React.createElement('div', {
                    style: { borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }
                  },
                    React.createElement('h3', { style: { margin: 0, fontSize: '16px', fontWeight: 600 } }, title)
                  ),
                  loading && React.createElement('p', { style: { fontSize: '13px', color: '#718096' } }, 'Loading...'),
                  !loading && children
                );
              },

              // Parameters section with collapsible UI
              Params: ({ children }) => {
                const [open, setOpen] = React.useState(false);
                return React.createElement('div', {
                  style: { backgroundColor: '#f8f9fa', borderRadius: '6px', marginBottom: '6px', border: '1px solid #e2e8f0' }
                },
                  React.createElement('div', {
                    onClick: () => setOpen(!open),
                    style: {
                      padding: '4px 6px', cursor: 'pointer', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center',
                      fontSize: '13px', fontWeight: 600, color: '#4a5568', userSelect: 'none'
                    }
                  },
                    React.createElement('span', null, '\u2699\uFE0F Parameters'),
                    React.createElement('span', {
                      style: { transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: '10px' }
                    }, '\u25B6')
                  ),
                  open && React.createElement('div', {
                    style: { padding: '6px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }
                  }, children)
                );
              },

              // Input field component
              Input: ({ label, value, onChange, type = 'text' }) => {
                return React.createElement('div', { style: { marginBottom: '4px' } },
                  React.createElement('label', {
                    style: { display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }
                  }, label + ':'),
                  React.createElement('input', {
                    type, value,
                    onChange: (e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value),
                    style: { width: '100%', padding: '4px 6px', fontSize: '13px', border: '1px solid #cbd5e0', borderRadius: '4px' }
                  })
                );
              },

              // Textarea component
              Textarea: ({ label, value, onChange }) => {
                return React.createElement('div', { style: { marginBottom: '4px' } },
                  React.createElement('label', {
                    style: { display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '2px', color: '#4a5568' }
                  }, label + ':'),
                  React.createElement('textarea', {
                    value, onChange: (e) => onChange(e.target.value),
                    style: {
                      display: 'block', width: '100%', padding: '4px 6px', fontSize: '13px',
                      border: '1px solid #cbd5e0', borderRadius: '4px', minHeight: '60px', fontFamily: 'inherit'
                    }
                  })
                );
              },

              // Data display with automatic formatting
              DataDisplay: ({ data }) => {
                if (data === null || data === undefined) {
                  return React.createElement('span', { style: { color: '#999', fontSize: '13px' } }, 'null');
                }

                if (Array.isArray(data)) {
                  if (data.length === 0) return React.createElement('span', { style: { color: '#999', fontSize: '13px' } }, '[]');

                  const firstItem = data[0];
                  if (typeof firstItem === 'object' && firstItem !== null) {
                    const keys = Object.keys(firstItem);
                    return React.createElement('div', { style: { overflowX: 'auto', margin: '8px 0' } },
                      React.createElement('table', {
                        style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }
                      },
                        React.createElement('thead', null,
                          React.createElement('tr', { style: { backgroundColor: '#4a5568', color: '#fff' } },
                            keys.map(key => React.createElement('th', {
                              key,
                              style: {
                                padding: '6px 10px', textAlign: 'left', fontWeight: 600,
                                borderBottom: '2px solid #2d3748', fontSize: '12px',
                                textTransform: 'uppercase', letterSpacing: '0.5px'
                              }
                            }, key))
                          )
                        ),
                        React.createElement('tbody', null,
                          data.map((item, idx) => React.createElement('tr', {
                            key: idx,
                            style: {
                              borderBottom: '1px solid #e2e8f0',
                              backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'
                            }
                          },
                            keys.map(key => React.createElement('td', {
                              key,
                              style: { padding: '6px 10px' }
                            }, React.createElement(window.APIExplorer.DataDisplay, { data: item[key] })))
                          ))
                        )
                      )
                    );
                  } else {
                    return React.createElement('ul', { style: { margin: '4px 0', paddingLeft: '18px', fontSize: '13px' } },
                      data.map((item, idx) => React.createElement('li', {
                        key: idx, style: { marginBottom: '2px' }
                      }, React.createElement(window.APIExplorer.DataDisplay, { data: item })))
                    );
                  }
                }

                if (typeof data === 'object') {
                  return React.createElement('div', { style: { marginLeft: '12px', fontSize: '13px' } },
                    Object.entries(data).map(([key, value]) => React.createElement('div', {
                      key, style: { marginBottom: '4px' }
                    },
                      React.createElement('strong', { style: { color: '#2563eb', fontSize: '12px' } }, key + ':'),
                      ' ',
                      Array.isArray(value) || (typeof value === 'object' && value !== null)
                        ? React.createElement(window.APIExplorer.DataDisplay, { data: value })
                        : React.createElement('span', null, String(value))
                    ))
                  );
                }

                return React.createElement('span', { style: { fontSize: '13px' } }, String(data));
              },

              // Response display wrapper
              Response: ({ data }) => {
                if (!data) return null;
                return React.createElement('div', null,
                  React.createElement('div', {
                    style: { fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#4a5568' }
                  }, 'Response:'),
                  React.createElement(window.APIExplorer.DataDisplay, { data })
                );
              },

              // Common fetch wrapper with error handling
              useFetch: (url, options) => {
                const [data, setData] = React.useState(null);
                const [loading, setLoading] = React.useState(false);
                const [error, setError] = React.useState(null);

                const execute = React.useCallback(() => {
                  setLoading(true);
                  setError(null);
                  fetch(url, options)
                    .then(response => response.json())
                    .then(result => {
                      setData(result);
                      setLoading(false);
                    })
                    .catch(err => {
                      setError(err.message);
                      setLoading(false);
                    });
                }, [url, JSON.stringify(options)]);

                return { data, loading, error, execute };
              }
            };

            // Pre-transpiled user code
            ${transpiledCode}

            // Render code
            ${renderCode}
          </${script}>
        </body>
      </html>`;

    iframe.srcdoc = html;
    setLastRenderedCode(code);
    setHasChanges(false);
  }, [code]);

  return (
    <div className="preview-container">
      <iframe ref={iframeRef} title="Preview" sandbox="allow-scripts" />
      <button
        className="preview-rerun-button"
        onClick={renderPreview}
        disabled={!hasChanges}
      >
        {hasChanges ? "Re-run" : "Up to date"}
      </button>
    </div>
  );
}

// CodeEditor Component
function CodeEditor({ code, onChange }) {
  const editorRef = useRef(null);
  const cmRef = useRef(null);
  const isInternalChange = useRef(false);
  const callbackRef = useRef({ onChange });
  const { isDarkMode } = useTheme();

  // Keep the callback ref updated
  useEffect(() => {
    callbackRef.current = { onChange };
  }, [onChange]);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || typeof window.CodeMirror === 'undefined') return;

    // Clear any existing content
    editorRef.current.innerHTML = '';

    try {
      cmRef.current = window.CodeMirror(editorRef.current, {
        value: code || '',
        mode: "jsx",
        lineNumbers: true,
        theme: isDarkMode ? "dracula" : "default",
        autoCloseBrackets: true,
        matchBrackets: true,
        tabSize: 2,
        indentWithTabs: false,
        lineWrapping: true
      });

      cmRef.current.on("change", (instance) => {
        if (!isInternalChange.current) {
          callbackRef.current.onChange(instance.getValue());
        }
      });
    } catch (e) {
      console.error('Error initializing CodeMirror:', e);
    }

    return () => {
      if (cmRef.current && typeof cmRef.current.toTextArea === 'function') {
        try {
          cmRef.current.toTextArea();
        } catch (e) {
          console.warn('Error cleaning up CodeMirror:', e);
        }
      }
      cmRef.current = null;
    };
  }, []);

  // Update code when prop changes
  useEffect(() => {
    if (cmRef.current && typeof cmRef.current.getValue === 'function') {
      const currentValue = cmRef.current.getValue();
      if (currentValue !== code) {
        isInternalChange.current = true;
        cmRef.current.setValue(code || '');
        isInternalChange.current = false;
      }
    }
  }, [code]);

  // Update theme when darkMode changes
  useEffect(() => {
    if (cmRef.current) {
      cmRef.current.setOption('theme', isDarkMode ? 'dracula' : 'default');
    }
  }, [isDarkMode]);

  return <div style={{ flex: 1, overflow: 'auto' }} ref={editorRef}></div>;
}

// Action FAB Menu Component
function ActionFABMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentEndpointId, resetEndpointCode } = useEndpoints();
  const toast = useToast();

  const handleReset = () => {
    if (window.confirm("Reset code to default state? This cannot be undone.")) {
      resetEndpointCode(currentEndpointId);
      toast.addToast("Code reset to default state", "success");
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="action-fab-menu">
      {isMenuOpen && (
        <div className="action-fab-items">
          <LoadSpecButton />
          <ProcessTodoButton />
          <button
            className="fab-button fab-reset"
            onClick={handleReset}
            title="Reset to Default"
          >
            <Icons.Reset />
          </button>
        </div>
      )}
      <button
        className="fab-button fab-main"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="Actions"
      >
        {isMenuOpen ? '×' : '☰'}
      </button>
    </div>
  );
}

// Main IDE Component
function IDEPage() {
  const {
    currentEndpointId,
    getEndpointCode,
    updateEndpointCode,
    selectEndpoint
  } = useEndpoints();
  const [showEndpointsList, setShowEndpointsList] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const toast = useToast();

  // Get current code based on selected endpoint
  const currentCode = getEndpointCode(currentEndpointId);

  const handleCodeChange = useCallback(newCode => {
    updateEndpointCode(currentEndpointId, newCode);
  }, [currentEndpointId, updateEndpointCode]);

  const handleEndpointSelect = (id) => {
    selectEndpoint(id);
    setShowEndpointsList(false);
  };

  const toggleView = () => {
    setShowCodeEditor(!showCodeEditor);
  };

  return (
    <>
      <Header />
      <div className="mobile-main-container">
        {showCodeEditor ? (
          <CodeEditor code={currentCode} onChange={handleCodeChange} />
        ) : (
          <Preview />
        )}
      </div>

      {/* Endpoints overlay */}
      {showEndpointsList && (
        <div className="endpoints-overlay" onClick={() => setShowEndpointsList(false)}>
          <div className="endpoints-panel" onClick={e => e.stopPropagation()}>
            <div className="sidebar-header">
              <span>Endpoints</span>
              <button
                className="close-button"
                onClick={() => setShowEndpointsList(false)}
              >
                ×
              </button>
            </div>
            <div className="challenges-list">
              {useEndpoints().endpoints.map((endpoint) => (
                <EndpointItem
                  key={endpoint.id}
                  endpoint={endpoint}
                  isSelected={endpoint.id === currentEndpointId}
                  onSelect={handleEndpointSelect}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  isModified={useEndpoints().isEndpointModified(endpoint.id)}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom-left FAB for endpoints */}
      <button
        className="fab-button fab-endpoints"
        onClick={() => setShowEndpointsList(!showEndpointsList)}
        title="Endpoints"
      >
        <Icons.List />
      </button>

      {/* View toggle FAB (between endpoints and actions) */}
      <button
        className="fab-button fab-toggle"
        onClick={toggleView}
        title={showCodeEditor ? "Show Preview" : "Show Code Editor"}
      >
        {showCodeEditor ? <Icons.Preview /> : <Icons.Edit />}
      </button>

      {/* Bottom-right FAB menu for actions */}
      <ActionFABMenu />
    </>
  );
}

// Export to window for global access
window.AppComponents = {
  Dialog,
  APIKeyDialog,
  LoadSpecDialog,
  Toast,
  ToastProvider,
  ProcessTodoButton,
  LoadSpecButton,
  Header,
  EndpointItem,
  Sidebar,
  Preview,
  CodeEditor,
  ActionFABMenu,
  IDEPage
};
