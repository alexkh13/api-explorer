import React from "react";

// Header Component
export function Header({ endpoint }) {
  const getMethodClass = (method) => {
    if (!method) return 'text-gray-600 dark:text-gray-400';
    const methodColors = {
      get: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      post: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      put: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      patch: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      delete: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    };
    return methodColors[method.toLowerCase()] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="h-12 flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-default)] flex items-center px-5 shadow-sm relative z-10">
      <div className="flex items-center gap-3 font-semibold text-lg text-[var(--text-primary)]">


        {endpoint && (
          <>
            <div className="flex items-center gap-2 text-sm font-normal">
              {endpoint.method && (
                <span className={`font-semibold px-2 py-0.5 rounded text-xs uppercase border ${getMethodClass(endpoint.method)}`}>
                  {endpoint.method}
                </span>
              )}
              {endpoint.path && (
                <span className="text-[var(--text-secondary)] font-mono text-xs">{endpoint.path || endpoint.url}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
