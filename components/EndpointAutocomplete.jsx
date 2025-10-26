import React, { useEffect, useRef, useMemo, useState } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { VirtualEndpointDialog } from "./VirtualEndpointDialog.jsx";
import { Code } from "../icons/index.jsx";

// Helper function to check if an endpoint requires parameters
function hasRequiredParameters(endpoint) {
  // Only path parameters are truly required (query params usually have defaults)
  const hasPathParams = endpoint.parameters?.some(param => param.in === 'path');

  return hasPathParams;
}

// EndpointAutocomplete Component - Collapsible endpoint selector
export function EndpointAutocomplete({ isOpen, onClose, toggleButtonRef }) {
  const { endpoints, currentEndpointId, selectEndpoint } = useEndpoints();
  const containerRef = useRef(null);
  const [showVirtualDialog, setShowVirtualDialog] = useState(false);

  // Filter out endpoints that require parameters
  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(ep => !hasRequiredParameters(ep));
  }, [endpoints]);

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

  const handleEndpointClick = (endpointId) => {
    selectEndpoint(endpointId);
    onClose();
  };

  const handleNewVirtualEndpoint = (e) => {
    e.stopPropagation();
    setShowVirtualDialog(true);
    // Don't close the autocomplete - keep it open while dialog is shown
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks on the toggle button
      if (toggleButtonRef.current && toggleButtonRef.current.contains(event.target)) {
        return;
      }

      // Ignore clicks on dialogs (check for dialog backdrop or dialog container)
      const isDialogClick = event.target.closest('[role="dialog"], .fixed.inset-0');
      if (isDialogClick) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen && !showVirtualDialog) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, showVirtualDialog, onClose, toggleButtonRef]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="endpoint-autocomplete"
      >
        {/* Scrollable list */}
        <div className="endpoint-autocomplete-list">
          {filteredEndpoints.map((endpoint) => {
            const isActive = endpoint.id === currentEndpointId;
            return (
              <div
                key={endpoint.id}
                onClick={() => handleEndpointClick(endpoint.id)}
                className={`endpoint-autocomplete-item ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2 text-sm">
                  {endpoint.method && (
                    <span className={`font-semibold px-2 py-0.5 rounded text-xs uppercase border ${getMethodClass(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  )}
                  <span className="text-[var(--text-secondary)] font-mono text-xs">
                    {endpoint.path || endpoint.url}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky button at bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-default)] p-2">
          <button
            onClick={handleNewVirtualEndpoint}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Code />
            <span>New Virtual Endpoint</span>
          </button>
        </div>
      </div>

      {/* Virtual Endpoint Dialog */}
      <VirtualEndpointDialog
        isOpen={showVirtualDialog}
        onClose={() => {
          setShowVirtualDialog(false);
          onClose(); // Close autocomplete when dialog closes
        }}
      />
    </>
  );
}
