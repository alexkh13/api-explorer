// UI Components - requires Babel transpilation
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
const { Icons } = window;
const { useTheme, useChallenges, useAI, useToast } = window.AppContexts;

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
  const { currentChallengeId, challengeCodes, updateChallengeCode } = useChallenges();
  const toast = useToast();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const handleClick = () => {
    const code = challengeCodes[currentChallengeId];

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
      updateChallengeCode(currentChallengeId, newCode);
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

// Header Component
function Header() {
  return (
    <div className="header">
      <div className="header-logo">
        <Icons.Code />
        React<span>Coder</span>
      </div>
      <div className="header-actions">
        {/* Header actions removed and moved to FABs */}
      </div>
    </div>
  );
}

// Challenge Item Component
function ChallengeItem({ challenge, isSelected, onSelect, isExpanded, onToggleExpand }) {
  return (
    <div className="challenge-item">
      <div
        className={`challenge-header ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(challenge.id)}
      >
        <input
          type="checkbox"
          className="challenge-checkbox"
          checked={challenge.completed}
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
        <div className="challenge-title">{challenge.title}</div>
        <div
          className={`challenge-expand ${isExpanded ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(challenge.id);
          }}
        >
          <Icons.ChevronRight />
        </div>
      </div>
      <div className={`challenge-content ${isExpanded ? 'open' : ''}`}>
        <div className="challenge-description">{challenge.description}</div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar() {
  const { challenges, currentChallengeId, selectChallenge } = useChallenges();
  const [expandedId, setExpandedId] = useState(currentChallengeId);

  // Automatically expand the selected challenge
  useEffect(() => {
    setExpandedId(currentChallengeId);
  }, [currentChallengeId]);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Challenges</span>
      </div>
      <div className="challenges-list">
        {challenges.map((challenge) => (
          <ChallengeItem
            key={challenge.id}
            challenge={challenge}
            isSelected={challenge.id === currentChallengeId}
            onSelect={selectChallenge}
            isExpanded={expandedId === challenge.id}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    </div>
  );
}

// Preview Component
function Preview() {
  const { currentChallengeId, challengeCodes } = useChallenges();
  const code = challengeCodes[currentChallengeId] || '';
  const iframeRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastRenderedCode, setLastRenderedCode] = useState(code);
  const isDrawerOpen = useRef(false);

  // Get drawer open state from parent component
  useEffect(() => {
    const drawer = document.querySelector('.preview-drawer');
    if (drawer) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            isDrawerOpen.current = drawer.classList.contains('open');
            // If drawer just opened and there are changes, render preview
            if (isDrawerOpen.current && hasChanges) {
              renderPreview();
            }
          }
        });
      });

      observer.observe(drawer, { attributes: true });
      isDrawerOpen.current = drawer.classList.contains('open');

      return () => observer.disconnect();
    }
  }, [hasChanges]);

  // Reset lastRenderedCode when challenge changes
  useEffect(() => {
    setLastRenderedCode("");
    setHasChanges(true);

    // Only render immediately if drawer is open
    if (isDrawerOpen.current) {
      renderPreview();
    }
  }, [currentChallengeId]);

  useEffect(() => {
    if (code !== lastRenderedCode) {
      setHasChanges(true);

      // Only auto-update if drawer is open
      if (isDrawerOpen.current) {
        renderPreview();
      }
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

    const script = "script";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
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
          <${script} src="https://unpkg.com/@babel/standalone/babel.min.js"></${script}>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 24px;
              line-height: 1.5;
              color: var(--gray-900);
              font-size: 16px;
              margin: 0;
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
          <${script} type="text/babel" data-presets="react" data-type="module">
            import React from 'react';
            import ReactDOM from 'react-dom';

            ${code}
            ${
              isReactComponent
                ? `
              // Extract the component name from the code
              const match = ${JSON.stringify(
                code
              )}.match(/function\\s+(\\w+)/);
              if (match) {
                const ComponentName = eval(match[1]);
                ReactDOM.render(React.createElement(ComponentName), document.getElementById('root'));
              }
            `
                : `
              // For non-React challenges, show the function result
              const match = ${JSON.stringify(
                code
              )}.match(/function\\s+(\\w+)/);
              if (match) {
                const funcName = match[1];
                const func = eval('(' + ${JSON.stringify(code)} + ')');
                document.getElementById('root').innerHTML = '<h3>Function: ' + funcName + '</h3>' +
                  '<p>Try calling this function in the browser console!</p>' +
                  '<div class="success">✓ Function defined successfully</div>';
                window[funcName] = func;
                console.log("✓ Function " + funcName + " is available in the console.");
              }
            `
            }
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
    if (!editorRef.current) return;

    cmRef.current = CodeMirror(editorRef.current, {
      value: code,
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

    return () => {
      if (cmRef.current) {
        cmRef.current.toTextArea();
      }
    };
  }, []);

  // Update code when prop changes
  useEffect(() => {
    if (cmRef.current && cmRef.current.getValue() !== code) {
      isInternalChange.current = true;
      cmRef.current.setValue(code);
      isInternalChange.current = false;
    }
  }, [code]);

  // Update theme when darkMode changes
  useEffect(() => {
    if (cmRef.current) {
      cmRef.current.setOption('theme', isDarkMode ? 'dracula' : 'default');
    }
  }, [isDarkMode]);

  return <div style={{ flex: 1 }} ref={editorRef}></div>;
}

// Main IDE Component
function IDEPage() {
  const {
    currentChallengeId,
    challengeCodes,
    updateChallengeCode,
    markChallengeCompleted,
    challenges
  } = useChallenges();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { isConfigured } = useAI();
  const toast = useToast();

  // Get current code based on selected challenge
  const currentCode = challengeCodes[currentChallengeId];

  const handleCodeChange = useCallback(newCode => {
    updateChallengeCode(currentChallengeId, newCode);
  }, [currentChallengeId, updateChallengeCode]);

  const handleSubmit = async () => {
    const result = await window.runTests(currentChallengeId, currentCode);

    if (result.success) {
      markChallengeCompleted(currentChallengeId);
      alert("All tests passed! Challenge completed.");
    } else {
      alert("Some tests failed. Check your code and try again.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="editor-container">
            <CodeEditor code={currentCode} onChange={handleCodeChange} />
          </div>
        </div>
      </div>

      {/* Fixed positioned elements outside the normal flow */}
      <div className="sidebar-right">
        <div className="fab-container">
          {/* Preview and Run buttons moved to the top */}
          <button
            className="fab-button fab-preview"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            title={isPreviewOpen ? "Hide Preview" : "Show Preview"}
          >
            {isPreviewOpen ? <Icons.HidePreview /> : <Icons.Preview />}
          </button>
          <button
            className="fab-button fab-run"
            onClick={handleSubmit}
            title="Run Tests"
          >
            <Icons.Run />
          </button>

          <ProcessTodoButton />

          <button
            className="fab-button fab-reset"
            onClick={() => {
              const challenge = challenges.find(c => c.id === currentChallengeId);
              if (challenge && window.confirm("Reset code to default state? This cannot be undone.")) {
                updateChallengeCode(currentChallengeId, challenge.starterCode);
                toast.addToast("Code reset to default state", "success");
              }
            }}
            title="Reset to Default"
          >
            <Icons.Reset />
          </button>
        </div>
      </div>

      <div
        className={`preview-drawer ${isPreviewOpen ? "open" : ""}`}
      >
        <Preview />
      </div>
    </div>
  );
}

// Export to window for global access
window.AppComponents = {
  Dialog,
  APIKeyDialog,
  Toast,
  ToastProvider,
  ProcessTodoButton,
  Header,
  ChallengeItem,
  Sidebar,
  Preview,
  CodeEditor,
  IDEPage
};
