// Transpilation Service
// Handles JSX-to-JS transpilation and error handling for preview rendering

/**
 * Check if code contains React/JSX syntax
 * @param {string} code - Source code to check
 * @returns {boolean} True if appears to be a React component
 */
export function isReactComponent(code) {
  return code.includes('function') && code.includes('return') && code.includes('<');
}

/**
 * Extract component name from function definition
 * @param {string} code - Source code
 * @returns {string|null} Component/function name or null if not found
 */
export function extractFunctionName(code) {
  const match = code.match(/function\s+(\w+)/);
  return match ? match[1] : null;
}

/**
 * Transpile JSX code to plain JavaScript using Babel
 * @param {string} code - JSX code to transpile
 * @returns {{ success: boolean, code?: string, error?: Error }} Transpilation result
 */
export function transpileCode(code) {
  try {
    const transformed = window.Babel.transform(code, {
      presets: ['react'],
      filename: 'preview.jsx'
    });
    return { success: true, code: transformed.code };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Generate render code for React component
 * @param {string} componentName - Name of the component to render
 * @returns {string} Render code for React component
 */
export function generateReactRenderCode(componentName) {
  return `
    const ComponentName = ${componentName};
    ReactDOM.render(React.createElement(ComponentName), document.getElementById('root'));
  `;
}

/**
 * Generate display code for non-React function
 * @param {string} funcName - Name of the function
 * @returns {string} Code to display function information
 */
export function generateFunctionDisplayCode(funcName) {
  return `
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

/**
 * Generate error display code for transpilation failures
 * @param {Error} error - Error object from transpilation
 * @returns {string} Code to display error in preview
 */
export function generateErrorDisplayCode(error) {
  return `
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
}

/**
 * Process code for preview rendering
 * @param {string} code - Source code to process
 * @returns {{ transpiledCode: string, renderCode: string }} Processed code ready for iframe
 */
export function processCodeForPreview(code) {
  const isReact = isReactComponent(code);

  // Transpile the code
  const transpileResult = transpileCode(code);

  if (!transpileResult.success) {
    // Return error display code
    return {
      transpiledCode: generateErrorDisplayCode(transpileResult.error),
      renderCode: ''
    };
  }

  // Extract function name
  const funcName = extractFunctionName(code);

  if (!funcName) {
    // No function found
    return {
      transpiledCode: transpileResult.code,
      renderCode: ''
    };
  }

  // Generate appropriate render code based on whether it's a React component
  const renderCode = isReact
    ? generateReactRenderCode(funcName)
    : generateFunctionDisplayCode(funcName);

  return {
    transpiledCode: transpileResult.code,
    renderCode
  };
}
