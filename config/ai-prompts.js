// AI System Prompts Configuration
// Shared system prompts for AI code generation

/**
 * Get the base system prompt for AI code assistance
 * This prompt is shared across all AI providers to ensure consistency
 *
 * @returns {string} Base system prompt with environment constraints and available components
 */
export function getBaseSystemPrompt() {
  return `You are a helpful AI assistant that helps write and improve code for a browser-based React application.

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
- APIKeyDialog: Dialog for API configuration`;
}

/**
 * Get provider-specific instruction suffix
 * Some providers need additional instructions about response format
 *
 * @param {string} provider - Provider name ('OPENAI' or 'ANTHROPIC')
 * @returns {string} Provider-specific instruction suffix
 */
export function getProviderSuffix(provider) {
  if (provider === 'OPENAI') {
    return '\n\nRespond with only the code changes requested. No explanations, just the code.';
  }
  return ''; // Anthropic handles this in the user message
}

/**
 * Build complete system prompt for a provider
 * Combines base prompt with provider-specific suffix
 *
 * @param {string} provider - Provider name ('OPENAI' or 'ANTHROPIC')
 * @returns {string} Complete system prompt
 */
export function getSystemPrompt(provider) {
  return getBaseSystemPrompt() + getProviderSuffix(provider);
}
