import React, { useState, useCallback, useMemo, createContext, useContext } from "react";
import { useEndpoints } from "./EndpointContext.jsx";
import { AI_PROVIDERS } from "../config/ai-providers.js";
import { getLocalStorageString, setLocalStorageString } from "../utils/storage.js";
import { validateGeneratedCode } from "../services/code-validation.js";

/**
 * AI Context - Manages AI provider configuration and code generation
 * Handles interaction with AI APIs (OpenAI, Anthropic) for code assistance
 * Includes validation for browser-compatible code and syntax checking
 */
export const AIContext = createContext({
  provider: 'OPENAI',
  apiKey: '',
  model: '',
  isConfigured: false,
  setApiConfig: () => {},
  generateCompletions: async () => {},
});

/**
 * AI Provider Component
 * Manages AI configuration and provides code generation capabilities
 * Validates generated code for browser compatibility and syntax errors
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component wrapping children
 */
export function AIProvider({ children }) {
  const [config, setConfig] = useState(() => {
    const provider = getLocalStorageString('ai_provider', 'OPENAI');
    const apiKey = getLocalStorageString(AI_PROVIDERS[provider]?.apiKeyName || '');
    const model = getLocalStorageString(`${provider}_MODEL`, AI_PROVIDERS[provider]?.defaultModel);

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
    // Store in localStorage using utility functions
    setLocalStorageString('ai_provider', newConfig.provider);
    setLocalStorageString(AI_PROVIDERS[newConfig.provider].apiKeyName, newConfig.apiKey);
    setLocalStorageString(`${newConfig.provider}_MODEL`, newConfig.model);

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

      // Validate generated code
      const validation = validateGeneratedCode(result);

      if (!validation.isValid) {
        setConfig(prev => ({
          ...prev,
          status: `Error: ${validation.error} Try a different prompt.`
        }));
        return false;
      }

      // Update the code through callback
      onSuccess(validation.code);

      setConfig(prev => ({
        ...prev,
        status: 'Code updated successfully'
      }));

      return true;
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

/**
 * Custom hook to access AI context
 * Provides access to AI configuration and code generation functions
 *
 * @returns {Object} AI context value with configuration and methods
 * @throws {Error} If used outside of AIProvider
 *
 * @example
 * const { generateCompletions, isConfigured, setApiConfig } = useAI();
 */
export const useAI = () => useContext(AIContext);
