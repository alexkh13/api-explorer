import React, { useState } from "react";
import * as Icons from "../icons/index.jsx";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { VirtualEndpointDialog } from "./VirtualEndpointDialog.jsx";

// Endpoint Item Component
export function EndpointItem({ endpoint, isSelected, onSelect, isExpanded, onToggleExpand, isModified, showDetails = false }) {
  const { deleteVirtualEndpoint } = useEndpoints();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Delete virtual endpoint "${endpoint.name}"?`)) {
      deleteVirtualEndpoint(endpoint.id);
    }
    setShowMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditDialog(true);
    setShowMenu(false);
  };
  // Get method-based color class
  const getMethodClass = (method) => {
    if (!method) return 'text-[var(--method-get)]';
    const methodColors = {
      get: 'text-[var(--method-get)]',
      post: 'text-[var(--method-post)]',
      put: 'text-[var(--method-put)]',
      patch: 'text-[var(--method-patch)]',
      delete: 'text-[var(--method-delete)]'
    };
    return methodColors[method.toLowerCase()] || 'text-[var(--method-get)]';
  };

  const getMethodBadgeClass = (method) => {
    if (!method) return 'bg-[var(--method-get-bg)] text-[var(--method-get)]';
    const methodBadges = {
      get: 'bg-[var(--method-get-bg)] text-[var(--method-get)]',
      post: 'bg-[var(--method-post-bg)] text-[var(--method-post)]',
      put: 'bg-[var(--method-put-bg)] text-[var(--method-put)]',
      patch: 'bg-[var(--method-patch-bg)] text-[var(--method-patch)]',
      delete: 'bg-[var(--method-delete-bg)] text-[var(--method-delete)]'
    };
    return methodBadges[method.toLowerCase()] || 'bg-[var(--method-get-bg)] text-[var(--method-get)]';
  };

  // Get consistent icon for this endpoint - with fallback
  const iconIndex = Icons?.getEndpointIcon ? Icons.getEndpointIcon(endpoint.id) : 0;
  const EndpointIcon = Icons?.shapes?.[iconIndex] || (() => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ));

  return (
    <div className="border-b border-[var(--border-default)]">
      <div
        className={`p-4 cursor-pointer flex gap-3 items-start transition-colors ${
          isSelected
            ? 'bg-[var(--bg-muted)] border-l-[3px] border-l-[var(--accent-primary)] pl-[calc(1rem-3px)]'
            : 'hover:bg-[var(--bg-accent)]'
        }`}
        onClick={() => onSelect(endpoint.id)}
      >
        <div className={`w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 transition-transform ${getMethodClass(endpoint.method)}`}>
          <EndpointIcon />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-0 overflow-hidden">
          <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
            {endpoint.title}
            {isModified && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"
                title="Code has been modified"
              />
            )}
          </div>
          {showDetails && (
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              {endpoint.method && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide flex-shrink-0 ${getMethodBadgeClass(endpoint.method)}`}>
                  {endpoint.method}
                </span>
              )}
              <span className="text-xs text-[var(--text-muted)] font-mono overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-shrink">{endpoint.path || endpoint.url || ''}</span>
            </div>
          )}
          {showDetails && endpoint.description && (
            <div className="text-xs text-[var(--text-secondary)] mt-1 leading-snug line-clamp-2">{endpoint.description}</div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {endpoint.type === 'virtual' && (
            <div className="relative">
              <button
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                title="Actions"
              >
                ⋮
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded shadow-lg z-20 min-w-[120px]">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                    >
                      <Icons.Edit /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-secondary)] text-red-500"
                    >
                      ✕ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {!showDetails && (
            <div
              className={`text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(endpoint.id);
              }}
            >
              <Icons.ChevronRight />
            </div>
          )}
        </div>
      </div>
      {!showDetails && (
        <div className={`transition-all overflow-hidden bg-[var(--bg-primary)] ${
          isExpanded ? 'max-h-[200px] p-4 overflow-y-auto' : 'max-h-0 p-0'
        }`}>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{endpoint.description}</div>
        </div>
      )}

      {/* Edit Dialog for Virtual Endpoints */}
      {endpoint.type === 'virtual' && showEditDialog && (
        <VirtualEndpointDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          editingEndpoint={endpoint}
        />
      )}
    </div>
  );
}
