// Context providers - requires Babel transpilation
import React, { useState, useCallback, useEffect, useMemo, createContext, useContext } from "react";
const { debounce } = window.AppUtils;
const { initialChallengesData, AI_PROVIDERS } = window.AppConstants;

// Theme Context
const ThemeContext = createContext({
  isDarkMode: false,
});

function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

// Challenge Context
const ChallengeContext = createContext({
  challenges: [],
  currentChallengeId: '',
  challengeCodes: {},
  getChallengeById: () => null,
  getCurrentChallenge: () => null,
  updateChallengeCode: () => {},
  selectChallenge: () => {},
  markChallengeCompleted: () => {}
});

function ChallengeProvider({ children, initialChallenges }) {
  const [state, setState] = useState(() => {
    const savedState = JSON.parse(
      localStorage.getItem("codeEditor") || "{}"
    );

    // Initialize with starter code for challenges without saved code
    const initial = {};
    initialChallenges.forEach((challenge) => {
      initial[challenge.id] =
        (savedState.challengeCodes && savedState.challengeCodes[challenge.id]) ||
        challenge.starterCode;
    });

    return {
      currentChallengeId: savedState.currentChallengeId || initialChallenges[0].id,
      challenges: savedState.challenges || initialChallenges,
      challengeCodes: initial
    };
  });

  // Debounced save to localStorage
  const saveToLocalStorage = useCallback(
    debounce((newState) => {
      localStorage.setItem(
        "codeEditor",
        JSON.stringify(newState)
      );
    }, 1000),
    []
  );

  // Save state to localStorage
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state, saveToLocalStorage]);

  // Context value with state and methods
  const value = useMemo(() => ({
    ...state,
    getChallengeById: (id) => state.challenges.find(c => c.id === id),
    getCurrentChallenge: () => state.challenges.find(c => c.id === state.currentChallengeId),
    updateChallengeCode: (challengeId, code) => {
      setState(prev => ({
        ...prev,
        challengeCodes: {
          ...prev.challengeCodes,
          [challengeId]: code
        }
      }));
    },
    selectChallenge: (challengeId) => {
      setState(prev => ({
        ...prev,
        currentChallengeId: challengeId
      }));
    },
    markChallengeCompleted: (challengeId) => {
      setState(prev => ({
        ...prev,
        challenges: prev.challenges.map(c =>
          c.id === challengeId ? { ...c, completed: true } : c
        )
      }));
    }
  }), [state]);

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
}

const useChallenges = () => useContext(ChallengeContext);

// AI Provider Context
const AIContext = createContext({
  provider: 'OPENAI',
  apiKey: '',
  model: '',
  isConfigured: false,
  setApiConfig: () => {},
  generateCompletions: async () => {},
});

function AIProvider({ children }) {
  const [config, setConfig] = useState(() => {
    const provider = localStorage.getItem('ai_provider') || 'OPENAI';
    const apiKey = localStorage.getItem(AI_PROVIDERS[provider]?.apiKeyName || '');
    const model = localStorage.getItem(`${provider}_MODEL`) || AI_PROVIDERS[provider]?.defaultModel;

    return {
      provider,
      apiKey,
      model,
      isProcessing: false,
      status: ''
    };
  });

  const { getCurrentChallenge } = useChallenges();

  const setApiConfig = useCallback((newConfig) => {
    // Store in localStorage
    localStorage.setItem('ai_provider', newConfig.provider);
    localStorage.setItem(AI_PROVIDERS[newConfig.provider].apiKeyName, newConfig.apiKey);
    localStorage.setItem(`${newConfig.provider}_MODEL`, newConfig.model);

    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);

  const generateCompletions = useCallback(async (prompt, code, onSuccess) => {
    if (!prompt.trim()) {
      setConfig(prev => ({ ...prev, status: 'Please enter a prompt' }));
      return false;
    }

    if (!config.apiKey) {
      return false;
    }

    setConfig(prev => ({
      ...prev,
      isProcessing: true,
      status: 'Processing your request...'
    }));

    try {
      const provider = AI_PROVIDERS[config.provider];

      // Get context about the current challenge
      const currentChallenge = getCurrentChallenge();
      const challengeContext = currentChallenge
        ? `Current challenge: ${currentChallenge.title} - ${currentChallenge.description}`
        : "";

      // Enhance the prompt with context about the current challenge
      const enhancedPrompt = challengeContext
        ? `${challengeContext}\n\n${prompt}`
        : prompt;

      const headers = {
        'Content-Type': 'application/json',
        ...(provider.customHeaders ? provider.customHeaders(config.apiKey) : {})
      };

      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(provider.formatRequest(enhancedPrompt, code, config.model))
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI service');
      }

      const data = await response.json();
      const result = provider.extractResponse(data);

      // Strip code blocks and unnecessary formatting from result
      let codeResult = result;
      if (result.includes('```')) {
        const codeBlockMatch = result.match(/```(?:jsx?|tsx?|javascript)?\n([\s\S]+?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          codeResult = codeBlockMatch[1];
        }
      }

      // Check for browser-incompatible patterns
      const incompatiblePatterns = [
        { pattern: /import\s+.+\s+from\s+['"](?!react|react-dom)([^/][^'"]*)['"];?/g, message: 'Unsupported import from non-CDN source' },
        { pattern: /require\s*\(/g, message: 'require() is not supported in browser environment' },
        { pattern: /fs\.|path\.|process\.env|__dirname|__filename/g, message: 'Node.js APIs are not available in browser' },
        { pattern: /module\.exports|exports\./g, message: 'CommonJS module system not supported' }
      ];

      let isValidCode = true;
      let validationMessage = '';

      for (const { pattern, message } of incompatiblePatterns) {
        if (pattern.test(codeResult)) {
          isValidCode = false;
          validationMessage = message;
          break;
        }
      }

      if (!isValidCode) {
        setConfig(prev => ({
          ...prev,
          status: `Error: ${validationMessage}. The AI generated code that isn't compatible with the browser environment. Try a different prompt.`
        }));

        return false;
      } else {
        // Try to parse the code with Babel to ensure it's valid
        try {
          // Only perform this check for complete function/component definitions
          if (codeResult.includes('function') || codeResult.includes('class') || codeResult.includes('=>')) {
            window.Babel.transform(codeResult, { presets: ['react'] });
          }

          // Update the code through callback
          onSuccess(codeResult);

          setConfig(prev => ({
            ...prev,
            status: 'Code updated successfully'
          }));

          return true;
        } catch (syntaxError) {
          setConfig(prev => ({
            ...prev,
            status: `Syntax error in generated code: ${syntaxError.message}. Try a different prompt.`
          }));

          return false;
        }
      }
    } catch (error) {
      console.error('Error generating completions:', error);

      setConfig(prev => ({
        ...prev,
        status: `Error: ${error.message}`
      }));

      return false;
    } finally {
      setConfig(prev => ({
        ...prev,
        isProcessing: false
      }));
    }
  }, [config.apiKey, config.model, config.provider, getCurrentChallenge]);

  const value = useMemo(() => ({
    ...config,
    isConfigured: !!config.apiKey,
    setApiConfig,
    generateCompletions,
    providers: AI_PROVIDERS
  }), [config, setApiConfig, generateCompletions]);

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

const useAI = () => useContext(AIContext);

// Toast Context
const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {}
});

const useToast = () => useContext(ToastContext);

// Export to window for global access
window.AppContexts = {
  ThemeContext,
  ThemeProvider,
  useTheme,
  ChallengeContext,
  ChallengeProvider,
  useChallenges,
  AIContext,
  AIProvider,
  useAI,
  ToastContext,
  useToast
};
