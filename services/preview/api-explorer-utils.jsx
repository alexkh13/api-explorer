// API Explorer Utilities
// Shared utility components for preview iframe
// This file is transpiled by the service worker when imported

import React, { useState, useEffect, useRef } from 'react';

/**
 * Layout component - provides consistent wrapper with loading state
 */
export function Layout({ title, children, loading }) {
  return (
    <div className="max-w-full">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          <span>Loading...</span>
        </div>
      )}
      {!loading && children}
    </div>
  );
}

/**
 * Params component - collapsible parameter section
 */
export function Params({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className="px-4 py-3 cursor-pointer flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300 select-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>⚙️</span>
          <span>Parameters</span>
        </span>
        <span className={'text-xs transition-transform ' + (open ? 'rotate-90' : '')}>▶</span>
      </div>
      {open && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Input component - standard text/number input field
 */
export function Input({ label, value, onChange, type = 'text' }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}:
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />
    </div>
  );
}

/**
 * Textarea component - multi-line text input
 */
export function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}:
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y"
      />
    </div>
  );
}

/**
 * ErrorDisplay component - shows error messages
 */
export function ErrorDisplay({ error }) {
  if (!error) return null;
  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">Error</h4>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Toolbar component - displays metadata from response
 */
export function Toolbar({ data, exclude = [] }) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const displayKeys = Object.keys(data).filter(key => !exclude.includes(key));
  if (displayKeys.length === 0) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
      <div className="flex flex-wrap gap-4 text-sm">
        {displayKeys.map(key => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-semibold text-blue-700 dark:text-blue-300">{key}:</span>
            <span className="text-gray-700 dark:text-gray-300">{String(data[key])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * NestedDataCell component - renders nested object/array data
 */
export function NestedDataCell({ value }) {
  const [expanded, setExpanded] = useState(false);

  if (value === null || value === undefined) {
    return <span className="text-gray-400 dark:text-gray-600 italic">null</span>;
  }

  if (typeof value === 'object') {
    return (
      <div className="inline-flex items-start gap-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 transition-colors"
        >
          {expanded ? '−' : '+'}
        </button>
        {expanded && (
          <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-auto max-w-xs">
            {JSON.stringify(value, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

/**
 * DataDisplay component - renders array/object data in a table
 */
export function DataDisplay({ data }) {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400 italic">No data available</p>;
    }

    const keys = data.length > 0 && typeof data[0] === 'object' ? Object.keys(data[0]) : [];

    if (keys.length === 0) {
      return (
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <NestedDataCell value={item} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {keys.map(key => (
                <th key={key} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                {keys.map(key => (
                  <td key={key} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    <NestedDataCell value={row[key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-1/3">Key</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{key}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                  <NestedDataCell value={value} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>;
}

/**
 * Response component - standard response display with data
 */
export function Response({ data }) {
  if (!data) return null;
  return (
    <div className="mt-2">
      <DataDisplay data={data} />
    </div>
  );
}

/**
 * PaginatedResponse component - response with infinite scroll
 */
export function PaginatedResponse({ items, loading, hasMore, onLoadMore }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className="mt-2">
      <div ref={scrollRef} className="max-h-[600px] overflow-y-auto">
        <DataDisplay data={items} />
        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            No more items to load
          </p>
        )}
      </div>
    </div>
  );
}
