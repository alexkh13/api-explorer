// Preview Template Generator
// Generates HTML templates for iframe preview with APIExplorer utilities

/**
 * Get the APIExplorer utilities code as a string
 * These utilities are injected into the preview iframe for user code to access
 * @returns {string} JavaScript code defining window.APIExplorer object
 */
export function getAPIExplorerUtilities() {
  return `
    // Shared API Explorer utilities
    window.APIExplorer = {
      // Layout component for consistent UI
      Layout: ({ title, children, loading }) => {
        return React.createElement('div', { className: 'max-w-full' },
          loading && React.createElement('div', { className: 'flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4' },
            React.createElement('div', { className: 'animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full' }),
            React.createElement('span', null, 'Loading...')
          ),
          !loading && children
        );
      },

      // Parameters section with collapsible UI
      Params: ({ children }) => {
        const [open, setOpen] = React.useState(false);
        return React.createElement('div', { className: 'bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700 overflow-hidden' },
          React.createElement('div', {
            onClick: () => setOpen(!open),
            className: 'px-4 py-3 cursor-pointer flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300 select-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
          },
            React.createElement('span', { className: 'flex items-center gap-2' },
              React.createElement('span', null, '\u2699\uFE0F'),
              React.createElement('span', null, 'Parameters')
            ),
            React.createElement('span', {
              className: 'text-xs transition-transform ' + (open ? 'rotate-90' : '')
            }, '\u25B6')
          ),
          open && React.createElement('div', { className: 'p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3' }, children)
        );
      },

      // Input field component
      Input: ({ label, value, onChange, type = 'text' }) => {
        return React.createElement('div', { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-medium text-gray-700 dark:text-gray-300' }, label + ':'),
          React.createElement('input', {
            type, value,
            onChange: (e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value),
            className: 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow'
          })
        );
      },

      // Textarea component
      Textarea: ({ label, value, onChange }) => {
        return React.createElement('div', { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-medium text-gray-700 dark:text-gray-300' }, label + ':'),
          React.createElement('textarea', {
            value, onChange: (e) => onChange(e.target.value),
            className: 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y'
          })
        );
      },

      // Nested data cell component with popover
      NestedDataCell: ({ data }) => {
        const [showPopover, setShowPopover] = React.useState(false);
        const [popoverPosition, setPopoverPosition] = React.useState({ x: 0, y: 0 });
        const buttonRef = React.useRef(null);

        const handleClick = (e) => {
          e.stopPropagation();
          if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPopoverPosition({ x: rect.left, y: rect.bottom + 5 });
          }
          setShowPopover(!showPopover);
        };

        const jsonString = JSON.stringify(data);
        const truncated = jsonString.length > 50 ? jsonString.substring(0, 50) + '...' : jsonString;

        return React.createElement('div', { className: 'relative' },
          React.createElement('button', {
            ref: buttonRef,
            onClick: handleClick,
            className: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-mono text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer'
          }, truncated),
          showPopover && React.createElement('div', {
            className: 'fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 max-w-lg max-h-96 overflow-auto z-50',
            style: { left: popoverPosition.x + 'px', top: popoverPosition.y + 'px' },
            onClick: (e) => e.stopPropagation()
          },
            React.createElement('div', { className: 'flex justify-between items-start mb-3' },
              React.createElement('h4', { className: 'text-sm font-semibold text-gray-900 dark:text-gray-100' }, 'Nested Data'),
              React.createElement('button', {
                onClick: () => setShowPopover(false),
                className: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-4'
              }, '×')
            ),
            React.createElement(window.APIExplorer.DataDisplay, { data })
          ),
          showPopover && React.createElement('div', {
            className: 'fixed inset-0 z-40',
            onClick: () => setShowPopover(false)
          })
        );
      },

      // Data display with automatic formatting
      DataDisplay: ({ data, inTableCell }) => {
        if (data === null || data === undefined) {
          return React.createElement('span', { className: 'text-gray-400 text-sm italic' }, 'null');
        }

        if (Array.isArray(data)) {
          if (data.length === 0) return React.createElement('span', { className: 'text-gray-400 text-sm italic' }, '[]');

          // If in table cell, show as clickable JSON
          if (inTableCell) {
            return React.createElement(window.APIExplorer.NestedDataCell, { data });
          }

          const firstItem = data[0];
          if (typeof firstItem === 'object' && firstItem !== null) {
            const keys = Object.keys(firstItem);
            return React.createElement('div', { className: 'overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm' },
              React.createElement('table', { className: 'min-w-full border-collapse text-sm' },
                React.createElement('thead', null,
                  React.createElement('tr', { className: 'bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700' },
                    keys.map(key => React.createElement('th', {
                      key,
                      className: 'px-6 py-3 text-left font-semibold text-white text-xs uppercase tracking-wider border-b-2 border-slate-800 dark:border-slate-900 whitespace-nowrap'
                    }, key))
                  )
                ),
                React.createElement('tbody', { className: 'divide-y divide-gray-200 dark:divide-gray-700' },
                  data.map((item, idx) => React.createElement('tr', {
                    key: idx,
                    className: 'hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ' + (idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50')
                  },
                    keys.map(key => {
                      const cellData = item[key];
                      const isNested = (Array.isArray(cellData) || (typeof cellData === 'object' && cellData !== null));

                      return React.createElement('td', {
                        key,
                        className: 'px-6 py-3 text-gray-900 dark:text-gray-100 whitespace-nowrap'
                      }, isNested
                        ? React.createElement(window.APIExplorer.NestedDataCell, { data: cellData })
                        : React.createElement(window.APIExplorer.DataDisplay, { data: cellData, inTableCell: true })
                      );
                    })
                  ))
                )
              )
            );
          } else {
            return React.createElement('ul', { className: 'my-2 pl-5 space-y-1 text-sm list-disc marker:text-gray-400' },
              data.map((item, idx) => React.createElement('li', {
                key: idx, className: 'text-gray-700 dark:text-gray-300'
              }, React.createElement(window.APIExplorer.DataDisplay, { data: item })))
            );
          }
        }

        if (typeof data === 'object') {
          // If in table cell, show as clickable JSON
          if (inTableCell) {
            return React.createElement(window.APIExplorer.NestedDataCell, { data });
          }

          return React.createElement('div', { className: 'ml-4 space-y-2 text-sm border-l-2 border-gray-200 dark:border-gray-700 pl-4 my-2' },
            Object.entries(data).map(([key, value]) => React.createElement('div', {
              key, className: 'flex flex-col gap-0.5'
            },
              React.createElement('strong', { className: 'text-blue-600 dark:text-blue-400 text-xs font-semibold' }, key + ':'),
              React.createElement('div', { className: 'text-gray-700 dark:text-gray-300' },
                Array.isArray(value) || (typeof value === 'object' && value !== null)
                  ? React.createElement(window.APIExplorer.DataDisplay, { data: value })
                  : React.createElement('span', null, String(value))
              )
            ))
          );
        }

        return React.createElement('span', { className: 'text-sm text-gray-700 dark:text-gray-300' }, String(data));
      },

      // Response display wrapper
      Response: ({ data }) => {
        if (!data) return null;
        return React.createElement(window.APIExplorer.DataDisplay, { data });
      },

      // Paginated response with infinite scroll support
      PaginatedResponse: ({ data, onLoadMore, loading, hasMore }) => {
        const sentinelRef = React.useRef(null);
        const onLoadMoreRef = React.useRef(onLoadMore);
        const isLoadingMoreRef = React.useRef(false);
        const [isLoadingMore, setIsLoadingMore] = React.useState(false);

        // Always keep the ref up to date
        React.useEffect(() => {
          onLoadMoreRef.current = onLoadMore;
        }, [onLoadMore]);

        // Sync the loading state with ref
        React.useEffect(() => {
          isLoadingMoreRef.current = isLoadingMore;
        }, [isLoadingMore]);

        React.useEffect(() => {
          const sentinel = sentinelRef.current;
          if (!sentinel || !hasMore || loading) {
            console.log('[PaginatedResponse] Observer not created:', { hasSentinel: !!sentinel, hasMore, loading });
            return;
          }

          console.log('[PaginatedResponse] Creating IntersectionObserver');

          const observer = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              console.log('[PaginatedResponse] Intersection:', {
                isIntersecting: entry.isIntersecting,
                isLoadingMore: isLoadingMoreRef.current
              });
              // Use ref to check loading state, not the captured closure value
              if (entry.isIntersecting && !isLoadingMoreRef.current) {
                console.log('[PaginatedResponse] Triggering load more');
                isLoadingMoreRef.current = true;
                setIsLoadingMore(true);
                // Use the ref to get the latest callback
                onLoadMoreRef.current().finally(() => {
                  console.log('[PaginatedResponse] Load more completed');
                  isLoadingMoreRef.current = false;
                  setIsLoadingMore(false);
                });
              }
            },
            {
              root: null, // viewport
              rootMargin: '100px', // trigger 100px before reaching sentinel
              threshold: 0
            }
          );

          observer.observe(sentinel);
          return () => {
            console.log('[PaginatedResponse] Disconnecting observer');
            observer.disconnect();
          };
        }, [hasMore, loading]);

        if (!data) return null;

        return React.createElement(React.Fragment, null,
          React.createElement(window.APIExplorer.DataDisplay, { data }),
          hasMore && React.createElement('div', {
            ref: sentinelRef,
            className: 'h-px w-full',
            style: { visibility: 'hidden' }
          }),
          (loading || isLoadingMore) && React.createElement('div', {
            className: 'flex items-center justify-center gap-2 py-4 text-sm text-gray-600 dark:text-gray-400'
          },
            React.createElement('div', {
              className: 'animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full'
            }),
            React.createElement('span', null, 'Loading more...')
          )
        );
      },

      // Toolbar for displaying additional response metadata
      Toolbar: ({ data, exclude = [] }) => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

        const displayKeys = Object.keys(data).filter(key => !exclude.includes(key));
        if (displayKeys.length === 0) return null;

        return React.createElement('div', {
          className: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4'
        },
          React.createElement('div', { className: 'flex flex-wrap gap-4 text-sm' },
            displayKeys.map(key => React.createElement('div', {
              key,
              className: 'flex items-center gap-2'
            },
              React.createElement('span', {
                className: 'font-semibold text-blue-700 dark:text-blue-300'
              }, key + ':'),
              React.createElement('span', {
                className: 'text-gray-700 dark:text-gray-300'
              }, String(data[key]))
            ))
          )
        );
      },

      // Error display component
      ErrorDisplay: ({ error }) => {
        if (!error) return null;
        return React.createElement('div', { className: 'mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg' },
          React.createElement('div', { className: 'flex items-start gap-3' },
            React.createElement('div', { className: 'flex-shrink-0' },
              React.createElement('svg', { className: 'w-5 h-5 text-red-600 dark:text-red-400', fill: 'currentColor', viewBox: '0 0 20 20' },
                React.createElement('path', { fillRule: 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z', clipRule: 'evenodd' })
              )
            ),
            React.createElement('div', { className: 'flex-1' },
              React.createElement('h4', { className: 'text-sm font-semibold text-red-900 dark:text-red-100 mb-1' }, 'Error'),
              React.createElement('p', { className: 'text-sm text-red-700 dark:text-red-300' }, error)
            )
          )
        );
      },

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
