// Preview Data Display Components
// Complex components for rendering API response data

/**
 * NestedDataCell component - clickable cell that shows nested data in popover
 * @returns {string} NestedDataCell component code
 */
export function getNestedDataCellComponent() {
  return `
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
      },`;
}

/**
 * DataDisplay component - recursively renders data with smart formatting
 * @returns {string} DataDisplay component code
 */
export function getDataDisplayComponent() {
  return `
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
                  React.createElement('tr', { className: '' },
                    keys.map(key => React.createElement('th', {
                      key,
                      className: 'px-6 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs uppercase tracking-wider border-b-2 border-slate-800 dark:border-slate-900 whitespace-nowrap'
                    }, key))
                  )
                ),
                React.createElement('tbody', { className: 'divide-y divide-gray-200 dark:divide-gray-700' },
                  data.map((item, idx) => React.createElement('tr', {
                    key: idx,
                    className: 'hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors '
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
      },`;
}

/**
 * Response component - simple wrapper for DataDisplay
 * @returns {string} Response component code
 */
export function getResponseComponent() {
  return `
      Response: ({ data }) => {
        if (!data) return null;
        return React.createElement(window.APIExplorer.DataDisplay, { data });
      },`;
}

/**
 * PaginatedResponse component - handles infinite scroll for paginated data
 * @returns {string} PaginatedResponse component code
 */
export function getPaginatedResponseComponent() {
  return `
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
      },`;
}
