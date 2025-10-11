// UI Components - requires Babel transpilation
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
const { Icons } = window;
const { useTheme, useEndpoints, useAI, useToast } = window.AppContexts;

// Generic Dialog Component
function Dialog({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-[var(--bg-primary)] rounded-lg w-[90%] max-w-lg p-6 shadow-[var(--shadow-lg)]" onClick={e => e.stopPropagation()}>
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Configure AI Assistant</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          To enable AI-powered code edits, please provide an API key for one of the supported services.
          Your key will be stored securely in your browser's local storage.
        </p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Select AI Provider</label>
          {Object.keys(providers).map(key => (
            <div
              key={key}
              className={`flex items-center gap-3 p-3 border rounded-md mb-3 cursor-pointer transition-all
                ${formState.provider === key
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-muted)]'
                  : 'border-[var(--border-default)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              onClick={() => handleProviderChange(key)}
            >
              <input
                type="radio"
                className="w-[18px] h-[18px]"
                checked={formState.provider === key}
                onChange={() => handleProviderChange(key)}
              />
              <span className="font-medium text-[var(--text-primary)]">{providers[key].name}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">API Key</label>
          <input
            type="password"
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={formState.apiKey}
            onChange={e => {
              setFormState(prev => ({ ...prev, apiKey: e.target.value }));
              setError('');
            }}
            placeholder={`Enter your ${providers[formState.provider].name} API key`}
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Model</label>
          <select
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={formState.model}
            onChange={e => setFormState(prev => ({ ...prev, model: e.target.value }))}
          >
            {renderModelOptions()}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-[var(--bg-muted)] text-[var(--text-primary)] border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--bg-secondary)] shadow-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--accent-primary-hover)] shadow-sm"
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Load OpenAPI Spec</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Enter the URL of an OpenAPI v3 JSON specification to load all endpoints.
          Optionally provide a bearer token to include in API requests.
        </p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Spec URL</label>
          <input
            type="url"
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="https://api.example.com/openapi.json"
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Bearer Token (optional)</label>
          <input
            type="password"
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={bearerToken}
            onChange={e => setBearerToken(e.target.value)}
            placeholder="Enter bearer token for API authentication"
            disabled={loading}
          />
          <div className="text-[var(--text-secondary)] text-xs mt-1">
            Will be included as "Authorization: Bearer [token]" in generated code
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-[var(--bg-muted)] text-[var(--text-primary)] border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--bg-secondary)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--accent-primary-hover)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`${bgColors[type]} text-white px-4 py-3 rounded-md text-sm flex items-center justify-between min-w-[300px] max-w-[400px] shadow-[var(--shadow-lg)] animate-slide-in`}>
      {message}
      <button className="bg-transparent border-none text-white text-lg cursor-pointer ml-2 p-0 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full" onClick={onClose}>×</button>
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
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-[1000]">
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

// Load Spec Button
function LoadSpecButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
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
function Header({ endpoint }) {
  const getMethodClass = (method) => {
    if (!method) return 'text-gray-600 dark:text-gray-400';
    const methodColors = {
      get: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      post: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      put: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      patch: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      delete: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    };
    return methodColors[method.toLowerCase()] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="h-12 flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-default)] flex items-center px-5 shadow-sm relative z-10">
      <div className="flex items-center gap-3 font-semibold text-lg text-[var(--text-primary)]">
        
        
        {endpoint && (
          <>
            <div className="flex items-center gap-2 text-sm font-normal">
              {endpoint.method && (
                <span className={`font-semibold px-2 py-0.5 rounded text-xs uppercase border ${getMethodClass(endpoint.method)}`}>
                  {endpoint.method}
                </span>
              )}
              {endpoint.path && (
                <span className="text-[var(--text-secondary)] font-mono text-xs">{endpoint.path || endpoint.url}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Endpoint Item Component
function EndpointItem({ endpoint, isSelected, onSelect, isExpanded, onToggleExpand, isModified, showDetails = false }) {
  // Get method-based color class
  const getMethodClass = (method) => {
    if (!method) return 'text-[var(--method-get)]';
    const methodColors = {
      get: 'text-[var(--method-get)]',
      post: 'text-[var(--method-post)]',
      put: 'text-[var(--method-put)]',
      patch: 'text-[var(--method-patch)]',
      delete: 'text-[var(--method-delete)]'
    };
    return methodColors[method.toLowerCase()] || 'text-[var(--method-get)]';
  };

  const getMethodBadgeClass = (method) => {
    if (!method) return 'bg-[var(--method-get-bg)] text-[var(--method-get)]';
    const methodBadges = {
      get: 'bg-[var(--method-get-bg)] text-[var(--method-get)]',
      post: 'bg-[var(--method-post-bg)] text-[var(--method-post)]',
      put: 'bg-[var(--method-put-bg)] text-[var(--method-put)]',
      patch: 'bg-[var(--method-patch-bg)] text-[var(--method-patch)]',
      delete: 'bg-[var(--method-delete-bg)] text-[var(--method-delete)]'
    };
    return methodBadges[method.toLowerCase()] || 'bg-[var(--method-get-bg)] text-[var(--method-get)]';
  };

  // Get consistent icon for this endpoint - with fallback
  const iconIndex = Icons?.getEndpointIcon ? Icons.getEndpointIcon(endpoint.id) : 0;
  const EndpointIcon = Icons?.shapes?.[iconIndex] || (() => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ));

  return (
    <div className="border-b border-[var(--border-default)]">
      <div
        className={`p-4 cursor-pointer flex gap-3 items-start transition-colors ${
          isSelected
            ? 'bg-[var(--bg-muted)] border-l-[3px] border-l-[var(--accent-primary)] pl-[calc(1rem-3px)]'
            : 'hover:bg-[var(--bg-accent)]'
        }`}
        onClick={() => onSelect(endpoint.id)}
      >
        <div className={`w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 transition-transform ${getMethodClass(endpoint.method)}`}>
          <EndpointIcon />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-0 overflow-hidden">
          <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
            {endpoint.title}
            {isModified && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"
                title="Code has been modified"
              />
            )}
          </div>
          {showDetails && (
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              {endpoint.method && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide flex-shrink-0 ${getMethodBadgeClass(endpoint.method)}`}>
                  {endpoint.method}
                </span>
              )}
              <span className="text-xs text-[var(--text-muted)] font-mono overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-shrink">{endpoint.path || endpoint.url || ''}</span>
            </div>
          )}
          {showDetails && endpoint.description && (
            <div className="text-xs text-[var(--text-secondary)] mt-1 leading-snug line-clamp-2">{endpoint.description}</div>
          )}
        </div>
        {!showDetails && (
          <div
            className={`text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
        <div className={`transition-all overflow-hidden bg-[var(--bg-primary)] ${
          isExpanded ? 'max-h-[200px] p-4 overflow-y-auto' : 'max-h-0 p-0'
        }`}>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{endpoint.description}</div>
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
    <div className="w-[300px] min-w-[300px] flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-y-auto hidden flex-col">
      <div className="p-4 border-b border-[var(--border-default)] font-semibold text-lg text-[var(--text-primary)] flex items-center">
        <span>Endpoints</span>
      </div>
      <div className="list-none p-0 m-0 flex-1 overflow-y-auto">
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
            document.getElementById('root').innerHTML =
              '<div class="max-w-2xl mx-auto">' +
                '<div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-sm">' +
                  '<div class="flex items-start gap-3">' +
                    '<div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">' +
                      '<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>' +
                    '</div>' +
                    '<div class="flex-1">' +
                      '<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Function: <code class="text-blue-600 dark:text-blue-400">${funcName}</code></h3>' +
                      '<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">This function is now available in the browser console!</p>' +
                      '<div class="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">' +
                        '<p class="text-xs font-mono text-gray-700 dark:text-gray-300 mb-1">Try it in the console:</p>' +
                        '<code class="text-xs font-mono text-green-600 dark:text-green-400">${funcName}()</code>' +
                      '</div>' +
                      '<div class="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">' +
                        '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' +
                        '<span class="font-medium">Function defined successfully</span>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
            console.log("✓ Function ${funcName} is available in the console.");
          `;
        }
      }
    } catch (error) {
      // If transpilation fails, show error in iframe
      transpiledCode = `
        document.getElementById('root').innerHTML =
          '<div class="max-w-2xl mx-auto mt-8">' +
            '<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 shadow-sm">' +
              '<div class="flex items-start gap-3">' +
                '<div class="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">' +
                  '<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' +
                '</div>' +
                '<div class="flex-1">' +
                  '<h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Transpilation Error</h3>' +
                  '<div class="bg-white dark:bg-gray-800 rounded-md p-3 border border-red-200 dark:border-red-700 mt-3">' +
                    '<code class="text-sm text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap">' + ${JSON.stringify(error.message)} + '</code>' +
                  '</div>' +
                  '<p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Please check your code syntax and try again.</p>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
      `;
      renderCode = '';
    }

    const script = "script";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <!-- Tailwind CSS -->
          <${script} src="https://cdn.tailwindcss.com"></${script}>

          <style>
            /* Base element styling for user-generated code */
            button {
              margin: 0 4px;
            }

            h1, h2, h3, h4, h5, h6 {
              margin-bottom: 0.5rem;
              font-weight: 600;
            }

            h1 { font-size: 1.875rem; }
            h2 { font-size: 1.5rem; }
            h3 { font-size: 1.25rem; }
            h4 { font-size: 1.125rem; }

            pre, code {
              font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
            }

            pre {
              background: #f3f4f6;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow: auto;
              font-size: 0.875rem;
            }

            @media (prefers-color-scheme: dark) {
              pre {
                background: rgba(255, 255, 255, 0.05);
              }
            }
          </style>

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
        </head>
        <body class="font-sans p-4 leading-relaxed text-gray-900 dark:text-gray-100 dark:bg-gray-900 bg-white">
          <div id="root"></div>
          <${script} type="module">
            import React from 'react';
            import ReactDOM from 'react-dom';

            // Shared API Explorer utilities
            window.APIExplorer = {
              // Layout component for consistent UI
              Layout: ({ title, children, loading }) => {
                return React.createElement('div', { className: 'max-w-full' },
                  loading && React.createElement('div', { className: 'flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4' },
                    React.createElement('div', { className: 'animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full' }),
                    React.createElement('span', null, 'Loading...')
                  ),
                  !loading && children
                );
              },

              // Parameters section with collapsible UI
              Params: ({ children }) => {
                const [open, setOpen] = React.useState(false);
                return React.createElement('div', { className: 'bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700 overflow-hidden' },
                  React.createElement('div', {
                    onClick: () => setOpen(!open),
                    className: 'px-4 py-3 cursor-pointer flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300 select-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                  },
                    React.createElement('span', { className: 'flex items-center gap-2' },
                      React.createElement('span', null, '\u2699\uFE0F'),
                      React.createElement('span', null, 'Parameters')
                    ),
                    React.createElement('span', {
                      className: 'text-xs transition-transform ' + (open ? 'rotate-90' : '')
                    }, '\u25B6')
                  ),
                  open && React.createElement('div', { className: 'p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3' }, children)
                );
              },

              // Input field component
              Input: ({ label, value, onChange, type = 'text' }) => {
                return React.createElement('div', { className: 'space-y-1.5' },
                  React.createElement('label', { className: 'block text-xs font-medium text-gray-700 dark:text-gray-300' }, label + ':'),
                  React.createElement('input', {
                    type, value,
                    onChange: (e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value),
                    className: 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow'
                  })
                );
              },

              // Textarea component
              Textarea: ({ label, value, onChange }) => {
                return React.createElement('div', { className: 'space-y-1.5' },
                  React.createElement('label', { className: 'block text-xs font-medium text-gray-700 dark:text-gray-300' }, label + ':'),
                  React.createElement('textarea', {
                    value, onChange: (e) => onChange(e.target.value),
                    className: 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y'
                  })
                );
              },

              // Nested data cell component with popover
              NestedDataCell: ({ data }) => {
                const [showPopover, setShowPopover] = React.useState(false);
                const [popoverPosition, setPopoverPosition] = React.useState({ x: 0, y: 0 });
                const buttonRef = React.useRef(null);

                const handleClick = (e) => {
                  e.stopPropagation();
                  if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    setPopoverPosition({ x: rect.left, y: rect.bottom + 5 });
                  }
                  setShowPopover(!showPopover);
                };

                const jsonString = JSON.stringify(data);
                const truncated = jsonString.length > 50 ? jsonString.substring(0, 50) + '...' : jsonString;

                return React.createElement('div', { className: 'relative' },
                  React.createElement('button', {
                    ref: buttonRef,
                    onClick: handleClick,
                    className: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-mono text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer'
                  }, truncated),
                  showPopover && React.createElement('div', {
                    className: 'fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 max-w-lg max-h-96 overflow-auto z-50',
                    style: { left: popoverPosition.x + 'px', top: popoverPosition.y + 'px' },
                    onClick: (e) => e.stopPropagation()
                  },
                    React.createElement('div', { className: 'flex justify-between items-start mb-3' },
                      React.createElement('h4', { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' }, 'Nested Data'),
                      React.createElement('button', {
                        onClick: () => setShowPopover(false),
                        className: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-4'
                      }, '×')
                    ),
                    React.createElement(window.APIExplorer.DataDisplay, { data })
                  ),
                  showPopover && React.createElement('div', {
                    className: 'fixed inset-0 z-40',
                    onClick: () => setShowPopover(false)
                  })
                );
              },

              // Data display with automatic formatting
              DataDisplay: ({ data, inTableCell }) => {
                if (data === null || data === undefined) {
                  return React.createElement('span', { className: 'text-gray-400 text-sm italic' }, 'null');
                }

                if (Array.isArray(data)) {
                  if (data.length === 0) return React.createElement('span', { className: 'text-gray-400 text-sm italic' }, '[]');

                  // If in table cell, show as clickable JSON
                  if (inTableCell) {
                    return React.createElement(window.APIExplorer.NestedDataCell, { data });
                  }

                  const firstItem = data[0];
                  if (typeof firstItem === 'object' && firstItem !== null) {
                    const keys = Object.keys(firstItem);
                    return React.createElement('div', { className: 'overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm' },
                      React.createElement('table', { className: 'min-w-full border-collapse text-sm' },
                        React.createElement('thead', null,
                          React.createElement('tr', { className: 'bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700' },
                            keys.map(key => React.createElement('th', {
                              key,
                              className: 'px-6 py-3 text-left font-semibold text-white text-xs uppercase tracking-wider border-b-2 border-slate-800 dark:border-slate-900 whitespace-nowrap'
                            }, key))
                          )
                        ),
                        React.createElement('tbody', { className: 'divide-y divide-gray-200 dark:divide-gray-700' },
                          data.map((item, idx) => React.createElement('tr', {
                            key: idx,
                            className: 'hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ' + (idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50')
                          },
                            keys.map(key => {
                              const cellData = item[key];
                              const isNested = (Array.isArray(cellData) || (typeof cellData === 'object' && cellData !== null));

                              return React.createElement('td', {
                                key,
                                className: 'px-6 py-3 text-gray-900 dark:text-gray-100 whitespace-nowrap'
                              }, isNested
                                ? React.createElement(window.APIExplorer.NestedDataCell, { data: cellData })
                                : React.createElement(window.APIExplorer.DataDisplay, { data: cellData, inTableCell: true })
                              );
                            })
                          ))
                        )
                      )
                    );
                  } else {
                    return React.createElement('ul', { className: 'my-2 pl-5 space-y-1 text-sm list-disc marker:text-gray-400' },
                      data.map((item, idx) => React.createElement('li', {
                        key: idx, className: 'text-gray-700 dark:text-gray-300'
                      }, React.createElement(window.APIExplorer.DataDisplay, { data: item })))
                    );
                  }
                }

                if (typeof data === 'object') {
                  // If in table cell, show as clickable JSON
                  if (inTableCell) {
                    return React.createElement(window.APIExplorer.NestedDataCell, { data });
                  }

                  return React.createElement('div', { className: 'ml-4 space-y-2 text-sm border-l-2 border-gray-200 dark:border-gray-700 pl-4 my-2' },
                    Object.entries(data).map(([key, value]) => React.createElement('div', {
                      key, className: 'flex flex-col gap-0.5'
                    },
                      React.createElement('strong', { className: 'text-blue-600 dark:text-blue-400 text-xs font-semibold' }, key + ':'),
                      React.createElement('div', { className: 'text-gray-700 dark:text-gray-300' },
                        Array.isArray(value) || (typeof value === 'object' && value !== null)
                          ? React.createElement(window.APIExplorer.DataDisplay, { data: value })
                          : React.createElement('span', null, String(value))
                      )
                    ))
                  );
                }

                return React.createElement('span', { className: 'text-sm text-gray-700 dark:text-gray-300' }, String(data));
              },

              // Response display wrapper
              Response: ({ data }) => {
                if (!data) return null;
                return React.createElement(window.APIExplorer.DataDisplay, { data });
              },

              // Paginated response with infinite scroll support
              PaginatedResponse: ({ data, onLoadMore, loading, hasMore }) => {
                const sentinelRef = React.useRef(null);
                const onLoadMoreRef = React.useRef(onLoadMore);
                const isLoadingMoreRef = React.useRef(false);
                const [isLoadingMore, setIsLoadingMore] = React.useState(false);

                // Always keep the ref up to date
                React.useEffect(() => {
                  onLoadMoreRef.current = onLoadMore;
                }, [onLoadMore]);

                // Sync the loading state with ref
                React.useEffect(() => {
                  isLoadingMoreRef.current = isLoadingMore;
                }, [isLoadingMore]);

                React.useEffect(() => {
                  const sentinel = sentinelRef.current;
                  if (!sentinel || !hasMore || loading) {
                    console.log('[PaginatedResponse] Observer not created:', { hasSentinel: !!sentinel, hasMore, loading });
                    return;
                  }

                  console.log('[PaginatedResponse] Creating IntersectionObserver');

                  const observer = new IntersectionObserver(
                    (entries) => {
                      const entry = entries[0];
                      console.log('[PaginatedResponse] Intersection:', {
                        isIntersecting: entry.isIntersecting,
                        isLoadingMore: isLoadingMoreRef.current
                      });
                      // Use ref to check loading state, not the captured closure value
                      if (entry.isIntersecting && !isLoadingMoreRef.current) {
                        console.log('[PaginatedResponse] Triggering load more');
                        isLoadingMoreRef.current = true;
                        setIsLoadingMore(true);
                        // Use the ref to get the latest callback
                        onLoadMoreRef.current().finally(() => {
                          console.log('[PaginatedResponse] Load more completed');
                          isLoadingMoreRef.current = false;
                          setIsLoadingMore(false);
                        });
                      }
                    },
                    {
                      root: null, // viewport
                      rootMargin: '100px', // trigger 100px before reaching sentinel
                      threshold: 0
                    }
                  );

                  observer.observe(sentinel);
                  return () => {
                    console.log('[PaginatedResponse] Disconnecting observer');
                    observer.disconnect();
                  };
                }, [hasMore, loading]);

                if (!data) return null;

                return React.createElement(React.Fragment, null,
                  React.createElement(window.APIExplorer.DataDisplay, { data }),
                  hasMore && React.createElement('div', {
                    ref: sentinelRef,
                    className: 'h-px w-full',
                    style: { visibility: 'hidden' }
                  }),
                  (loading || isLoadingMore) && React.createElement('div', {
                    className: 'flex items-center justify-center gap-2 py-4 text-sm text-gray-600 dark:text-gray-400'
                  },
                    React.createElement('div', {
                      className: 'animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full'
                    }),
                    React.createElement('span', null, 'Loading more...')
                  )
                );
              },

              // Toolbar for displaying additional response metadata
              Toolbar: ({ data, exclude = [] }) => {
                if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

                const displayKeys = Object.keys(data).filter(key => !exclude.includes(key));
                if (displayKeys.length === 0) return null;

                return React.createElement('div', {
                  className: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4'
                },
                  React.createElement('div', { className: 'flex flex-wrap gap-4 text-sm' },
                    displayKeys.map(key => React.createElement('div', {
                      key,
                      className: 'flex items-center gap-2'
                    },
                      React.createElement('span', {
                        className: 'font-semibold text-blue-700 dark:text-blue-300'
                      }, key + ':'),
                      React.createElement('span', {
                        className: 'text-gray-700 dark:text-gray-300'
                      }, String(data[key]))
                    ))
                  )
                );
              },

              // Error display component
              ErrorDisplay: ({ error }) => {
                if (!error) return null;
                return React.createElement('div', { className: 'mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg' },
                  React.createElement('div', { className: 'flex items-start gap-3' },
                    React.createElement('div', { className: 'flex-shrink-0' },
                      React.createElement('svg', { className: 'w-5 h-5 text-red-600 dark:text-red-400', fill: 'currentColor', viewBox: '0 0 20 20' },
                        React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z', clipRule: 'evenodd' })
                      )
                    ),
                    React.createElement('div', { className: 'flex-1' },
                      React.createElement('h4', { className: 'text-sm font-semibold text-red-900 dark:text-red-100 mb-1' }, 'Error'),
                      React.createElement('p', { className: 'text-sm text-red-700 dark:text-red-300' }, error)
                    )
                  )
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
    <div className="flex-1 flex flex-col overflow-auto">
      <iframe ref={iframeRef} title="Preview" sandbox="allow-scripts" className="flex-1 w-full border-none bg-[var(--bg-primary)]" />
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

  return <div className="flex-1 overflow-auto" ref={editorRef}></div>;
}

// Minimal AI Assistant Component
function MinimalAIAssistant({ isOpen, onClose }) {
  const { generateCompletions, isConfigured, isProcessing } = useAI();
  const { currentEndpointId, getEndpointCode, updateEndpointCode, getCurrentEndpoint } = useEndpoints();
  const toast = useToast();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  // Get current code to determine action type
  const code = getEndpointCode(currentEndpointId);
  const hasTodos = code.includes('TODO:') || code.includes('TODO ');

  // Determine action based on code state
  const action = hasTodos
    ? { id: 'implement', label: 'Implement TODOs', icon: '⚡' }
    : { id: 'plan', label: 'Plan next feature', icon: '📋' };

  const handleActionClick = async () => {
    if (!isConfigured) {
      toast.addToast('Please configure your AI API key first', 'error');
      setShowApiKeyDialog(true);
      return;
    }

    const currentEndpoint = getCurrentEndpoint();

    let optimizedPrompt;

    if (action.id === 'plan') {
      // PLAN mode: Analyze code and add TODOs for the next most valuable feature
      optimizedPrompt = `
Add TODO comments to plan ONE improvement. Return the COMPLETE code with TODOs inserted.

RULES:
1. Copy ALL the existing code exactly as it is
2. Insert TODO comments at locations where changes will be made
3. Pick ONE task: error handling, loading states, OR input validation
4. All TODOs must be for the SAME task
5. Return ONLY the code - no explanations, no markdown

CODE TO MODIFY:
${code}
`.trim();
    } else {
      // IMPLEMENT mode: Implement all the TODOs that were planned
      optimizedPrompt = `
Implement ALL TODO comments found in the code. Return the COMPLETE implemented code.

RULES:
1. Implement EVERY TODO comment
2. Remove TODO comments after implementing
3. Use window.APIExplorer utilities (Layout, Response, ErrorDisplay, etc.)
4. Use .then()/.catch() for promises (NO async/await)
5. Return ONLY the code - no explanations, no markdown

CODE WITH TODOs:
${code}
`.trim();
    }

    toast.addToast(action.id === 'plan' ? 'Planning next feature...' : 'Implementing TODOs...', 'info');

    const success = await generateCompletions(optimizedPrompt, code, (newCode) => {
      updateEndpointCode(currentEndpointId, newCode);
      const successMsg = action.id === 'plan'
        ? 'TODOs added! Click "Implement" to execute the plan.'
        : 'TODOs implemented successfully!';
      toast.addToast(successMsg, 'success');
    });

    if (!success) {
      toast.addToast('Failed to ' + (action.id === 'plan' ? 'plan' : 'implement') + '. Check console for details.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-default)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[99] animate-slide-up">
        <div className="flex items-center justify-center h-14 px-3 gap-2">
          {/* Single action button */}
          <button
            onClick={handleActionClick}
            disabled={isProcessing}
            className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
          >
            {isProcessing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{action.id === 'plan' ? 'Planning...' : 'Implementing...'}</span>
              </>
            ) : (
              <>
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <APIKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
      />
    </>
  );
}

// Action FAB Menu Component
function ActionFABMenu({ showEndpointsList, onToggleEndpointsList, showCodeEditor, onToggleView, onPromptOpen, showPromptPanel }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentEndpointId, resetEndpointCode } = useEndpoints();
  const toast = useToast();

  const handleReset = () => {
    if (window.confirm("Reset code to default state? This cannot be undone.")) {
      resetEndpointCode(currentEndpointId);
      toast.addToast("Code reset to default state", "success");
    }
  };

  const handleToggleEndpoints = () => {
    onToggleEndpointsList();
  };

  const handleToggleView = () => {
    onToggleView();
  };

  const handlePromptOpen = () => {
    onPromptOpen();
  };

  // Adjust bottom position based on AI panel visibility
  const bottomClass = showPromptPanel ? 'bottom-[70px]' : 'bottom-6';

  return (
    <div className={`absolute right-6 z-[100] flex flex-col items-end gap-3 transition-all duration-300 ${bottomClass}`}>
      {isMenuOpen && (
        <div className="flex flex-col items-end gap-3 animate-slide-up">
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handleToggleEndpoints}
            title="Toggle Endpoints List"
          >
            <Icons.List />
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handleToggleView}
            title={showCodeEditor ? "Show Preview" : "Show Code Editor"}
          >
            {showCodeEditor ? <Icons.Preview /> : <Icons.Edit />}
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-300 dark:border-green-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handlePromptOpen}
            title="AI Code Assistant"
          >
            <Icons.AI />
          </button>
          <LoadSpecButton />
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handleReset}
            title="Reset to Default"
          >
            <Icons.Reset />
          </button>
        </div>
      )}
      <button
        className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 shadow-lg flex items-center justify-center cursor-pointer text-2xl font-bold transition-all hover:scale-110 hover:rotate-90 hover:shadow-xl p-0"
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
    selectEndpoint,
    endpoints,
    isEndpointModified,
    getCurrentEndpoint
  } = useEndpoints();
  const [showEndpointsList, setShowEndpointsList] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const toast = useToast();

  // Get current code based on selected endpoint
  const currentCode = getEndpointCode(currentEndpointId);
  const currentEndpoint = getCurrentEndpoint();

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

  const toggleEndpointsList = () => {
    setShowEndpointsList(!showEndpointsList);
  };

  const togglePromptPanel = () => {
    setShowPromptPanel(!showPromptPanel);
  };

  const closePromptPanel = () => {
    setShowPromptPanel(false);
  };

  // Close prompt panel on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPromptPanel) {
        closePromptPanel();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showPromptPanel]);

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <Header endpoint={currentEndpoint} />
      <div className="flex-1 flex bg-[var(--bg-primary)] overflow-auto">
        {showCodeEditor ? (
          <CodeEditor code={currentCode} onChange={handleCodeChange} />
        ) : (
          <Preview />
        )}
      </div>

      {/* Endpoints overlay */}
      {showEndpointsList && (
        <div className="fixed top-12 left-0 right-0 bottom-0 bg-black/50 z-[999] flex items-stretch justify-start" onClick={() => setShowEndpointsList(false)}>
          <div className="bg-[var(--bg-secondary)] max-w-[500px] w-[85vw] flex-1 shadow-[var(--shadow-lg)] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center sticky top-0 bg-[var(--bg-secondary)] z-10 border-b border-[var(--border-default)] p-4">
              <span className="font-semibold text-lg text-[var(--text-primary)]">Endpoints</span>
              <button
                className="bg-transparent border-none text-[var(--text-primary)] text-3xl leading-none cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-accent)]"
                onClick={() => setShowEndpointsList(false)}
              >
                ×
              </button>
            </div>
            <div className="list-none p-0 m-0 flex-1 overflow-y-auto">
              {endpoints.map((endpoint) => (
                <EndpointItem
                  key={endpoint.id}
                  endpoint={endpoint}
                  isSelected={endpoint.id === currentEndpointId}
                  onSelect={handleEndpointSelect}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  isModified={isEndpointModified(endpoint.id)}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Minimal AI Assistant */}
      <MinimalAIAssistant isOpen={showPromptPanel} onClose={closePromptPanel} />

      {/* Bottom-right FAB menu for actions */}
      <ActionFABMenu
        showEndpointsList={showEndpointsList}
        onToggleEndpointsList={toggleEndpointsList}
        showCodeEditor={showCodeEditor}
        onToggleView={toggleView}
        onPromptOpen={togglePromptPanel}
        showPromptPanel={showPromptPanel}
      />
    </div>
  );
}

// Export to window for global access
window.AppComponents = {
  Dialog,
  APIKeyDialog,
  LoadSpecDialog,
  Toast,
  ToastProvider,
  LoadSpecButton,
  MinimalAIAssistant,
  Header,
  EndpointItem,
  Sidebar,
  Preview,
  CodeEditor,
  ActionFABMenu,
  IDEPage
};
