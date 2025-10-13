import React, { useRef, useState, useEffect, useCallback } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { generatePreviewHTML } from "../services/preview-template.js";

// Preview Component
export function Preview() {
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

    // Generate HTML using the template service
    const html = generatePreviewHTML(transpiledCode, renderCode);

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
