// Preview Template Generator
// Generates HTML templates for iframe preview with APIExplorer utilities

import {
  getLayoutComponent,
  getParamsComponent,
  getInputComponent,
  getTextareaComponent,
  getErrorDisplayComponent,
  getToolbarComponent
} from './preview/ui-components.js';

import {
  getNestedDataCellComponent,
  getDataDisplayComponent,
  getResponseComponent,
  getPaginatedResponseComponent
} from './preview/data-components.js';

/**
 * Get the APIExplorer utilities code as a string
 * These utilities are injected into the preview iframe for user code to access
 * @returns {string} JavaScript code defining window.APIExplorer object
 */
export function getAPIExplorerUtilities() {
  return `
    // Shared API Explorer utilities
    window.APIExplorer = {${getLayoutComponent()}${getParamsComponent()}${getInputComponent()}${getTextareaComponent()}${getNestedDataCellComponent()}${getDataDisplayComponent()}${getResponseComponent()}${getPaginatedResponseComponent()}${getToolbarComponent()}${getErrorDisplayComponent()}

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
  `.trim();
}

/**
 * Generate complete HTML template for preview iframe
 * @param {string} transpiledCode - Pre-transpiled user code
 * @param {string} renderCode - Code to render the component
 * @returns {string} Complete HTML document as string
 */
export function generatePreviewHTML(transpiledCode, renderCode) {
  const script = "script";
  const apiExplorerUtilities = getAPIExplorerUtilities();

  return `
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

          ${apiExplorerUtilities}

          // Pre-transpiled user code
          ${transpiledCode}

          // Render code
          ${renderCode}
        </${script}>
      </body>
    </html>`.trim();
}
