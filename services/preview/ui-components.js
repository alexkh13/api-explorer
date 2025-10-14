// Preview UI Components
// Basic reusable UI component definitions for iframe preview

/**
 * Layout component - provides consistent wrapper with loading state
 * @returns {string} Layout component code
 */
export function getLayoutComponent() {
  return `
      Layout: ({ title, children, loading }) => {
        return React.createElement('div', { className: 'max-w-full' },
          loading && React.createElement('div', { className: 'flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4' },
            React.createElement('div', { className: 'animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full' }),
            React.createElement('span', null, 'Loading...')
          ),
          !loading && children
        );
      },`;
}

/**
 * Params component - collapsible parameter section
 * @returns {string} Params component code
 */
export function getParamsComponent() {
  return `
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
      },`;
}

/**
 * Input component - standard text/number input field
 * @returns {string} Input component code
 */
export function getInputComponent() {
  return `
      Input: ({ label, value, onChange, type = 'text' }) => {
        return React.createElement('div', { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-medium text-gray-700 dark:text-gray-300' }, label + ':'),
          React.createElement('input', {
            type, value,
            onChange: (e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value),
            className: 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow'
          })
        );
      },`;
}

/**
 * Textarea component - multi-line text input
 * @returns {string} Textarea component code
 */
export function getTextareaComponent() {
  return `
      Textarea: ({ label, value, onChange }) => {
        return React.createElement('div', { className: 'space-y-1.5' },
          React.createElement('label', { className: 'block text-xs font-medium text-gray-700 dark:text-gray-300' }, label + ':'),
          React.createElement('textarea', {
            value, onChange: (e) => onChange(e.target.value),
            className: 'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y'
          })
        );
      },`;
}

/**
 * ErrorDisplay component - shows error messages
 * @returns {string} ErrorDisplay component code
 */
export function getErrorDisplayComponent() {
  return `
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
      },`;
}

/**
 * Toolbar component - displays metadata from response
 * @returns {string} Toolbar component code
 */
export function getToolbarComponent() {
  return `
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
      },`;
}
