// Preview Template Generator
// Generates HTML templates for iframe preview with runtime JSX transpilation

/**
 * Generate complete HTML template for preview iframe
 * User code is transpiled at runtime by Babel Standalone
 * @param {string} userCode - Raw JSX code from user (not transpiled)
 * @returns {string} Complete HTML document as string
 */
export function generatePreviewHTML(userCode) {
  const script = "script";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base href="/">

        <!-- Tailwind CSS -->
        <${script} src="https://cdn.tailwindcss.com"></${script}>

        <style>
          /* Base element styling for user-generated code */
          html, body {
            background-color: #0a0a0a;
          }

          @media (prefers-color-scheme: light) {
            html, body {
              background-color: #ffffff;
            }
          }

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
              background: rgba(255, 255, 255, 0.03);
            }
          }

          /* Hide scrollbar for table containers */
          .table-scroll-container {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }

          .table-scroll-container::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        </style>

        <!-- Babel Standalone for runtime JSX transpilation -->
        <${script} src="https://unpkg.com/@babel/standalone/babel.min.js"></${script}>

        <!-- Import maps for React and module resolution -->
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
      <body class="font-sans p-4 leading-relaxed text-gray-900 dark:text-gray-100">
        <div id="root"></div>

        <!-- User code - transpiled automatically by Babel -->
        <${script} type="text/babel" data-type="module">
${userCode}
        </${script}>
      </body>
    </html>`.trim();
}
