import React, { useState, useCallback, useMemo, createContext, useContext } from "react";
import { useEndpoints } from "./EndpointContext.jsx";
import { AI_PROVIDERS } from "../config/ai-providers.js";

// AI Provider Context
export const AIContext = createContext({
  provider: 'OPENAI',
  apiKey: '',
  model: '',
  isConfigured: false,
  setApiConfig: () => {},
  generateCompletions: async () => {},
});

export function AIProvider({ children }) {
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

  const { getCurrentEndpoint } = useEndpoints();

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

      // Get context about the current endpoint
      const currentEndpoint = getCurrentEndpoint();
      const endpointContext = currentEndpoint
        ? `Current endpoint: ${currentEndpoint.title} - ${currentEndpoint.description}`
        : "";

      // Enhance the prompt with context about the current endpoint
      const enhancedPrompt = endpointContext
        ? `${endpointContext}\n\n${prompt}`
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
  }, [config.apiKey, config.model, config.provider, getCurrentEndpoint]);

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

export const useAI = () => useContext(AIContext);
