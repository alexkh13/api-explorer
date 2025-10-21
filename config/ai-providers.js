// AI Provider Configuration
// Exported configuration for different AI providers (OpenAI, Anthropic, etc.)

import { getSystemPrompt } from './ai-prompts.js';

/**
 * AI Provider Configuration Object
 * Contains configuration for all supported AI providers
 *
 * @typedef {Object} AIProvider
 * @property {string} name - Display name of the provider
 * @property {string} endpoint - API endpoint URL
 * @property {string} apiKeyName - localStorage key for API key
 * @property {string} defaultModel - Default model ID
 * @property {Array<{id: string, name: string}>} models - Available models
 * @property {Function} formatRequest - Format request payload (prompt, code, model) => requestBody
 * @property {Function} customHeaders - Generate custom headers (apiKey) => headers
 * @property {Function} extractResponse - Extract text from API response (data) => string
 */

/**
 * Supported AI providers with their configurations
 * @type {Object.<string, AIProvider>}
 */
export const AI_PROVIDERS = {
    OPENROUTER: {
      name: 'OpenRouter',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      apiKeyName: 'OPENROUTER_API_KEY',
      defaultModel: 'anthropic/claude-3.5-haiku',
      models: [
        { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'openai/gpt-4o', name: 'GPT-4o' },
        { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)' },
        { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)' }
      ],
      formatRequest: (prompt, code, model) => ({
        model: model || 'anthropic/claude-3.5-haiku',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt('OPENAI')
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
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://alexkh13.github.io',
        'X-Title': 'API Explorer'
      }),
      extractResponse: (data) => data.choices[0].message.content
    },
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
            content: getSystemPrompt('OPENAI')
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
        system: getSystemPrompt('ANTHROPIC'),
        messages: [
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
