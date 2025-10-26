import React, { useState, useEffect } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { EndpointItem } from "./EndpointItem.jsx";
import { Code } from "../icons/index.jsx";
import { VirtualEndpointDialog } from "./VirtualEndpointDialog.jsx";

// Sidebar Component
export function Sidebar() {
  const { endpoints, currentEndpointId, selectEndpoint, isEndpointModified, getVirtualEndpoints, getRealEndpoints } = useEndpoints();
  const [expandedId, setExpandedId] = useState(currentEndpointId);
  const [filter, setFilter] = useState('all'); // all | real | virtual
  const [showVirtualDialog, setShowVirtualDialog] = useState(false);

  // Automatically expand the selected endpoint
  useEffect(() => {
    setExpandedId(currentEndpointId);
  }, [currentEndpointId]);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter endpoints based on selected filter
  const filteredEndpoints = filter === 'all'
    ? endpoints
    : filter === 'virtual'
    ? getVirtualEndpoints()
    : getRealEndpoints();

  const virtualCount = getVirtualEndpoints().length;
  const realCount = getRealEndpoints().length;

  return (
    <>
      <div className="w-[300px] min-w-[300px] flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-y-auto hidden flex-col">
        <div className="p-4 border-b border-[var(--border-default)]">
          <div className="font-semibold text-lg text-[var(--text-primary)] flex items-center justify-between mb-3">
            <span>Endpoints</span>
            <button
              onClick={() => setShowVirtualDialog(true)}
              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
              title="Create Virtual Endpoint"
            >
              <Code />
              <span>New</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${
                filter === 'all'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({endpoints.length})
            </button>
            <button
              onClick={() => setFilter('real')}
              className={`px-3 py-1 rounded ${
                filter === 'real'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Real ({realCount})
            </button>
            <button
              onClick={() => setFilter('virtual')}
              className={`px-3 py-1 rounded ${
                filter === 'virtual'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Virtual ({virtualCount})
            </button>
          </div>
        </div>

        <div className="list-none p-0 m-0 flex-1 overflow-y-auto">
          {filteredEndpoints.map((endpoint) => (
            <EndpointItem
              key={endpoint.id}
              endpoint={endpoint}
              isSelected={endpoint.id === currentEndpointId}
              onSelect={selectEndpoint}
              isExpanded={expandedId === endpoint.id}
              onToggleExpand={handleToggleExpand}
              isModified={isEndpointModified(endpoint.id)}
            />
          ))}

          {filteredEndpoints.length === 0 && (
            <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
              {filter === 'virtual' ? (
                <>
                  <p className="mb-2">No virtual endpoints yet</p>
                  <button
                    onClick={() => setShowVirtualDialog(true)}
                    className="text-blue-500 hover:underline text-xs"
                  >
                    Create your first virtual endpoint
                  </button>
                </>
              ) : (
                'No endpoints found'
              )}
            </div>
          )}
        </div>
      </div>

      {/* Virtual Endpoint Dialog */}
      <VirtualEndpointDialog
        isOpen={showVirtualDialog}
        onClose={() => setShowVirtualDialog(false)}
      />
    </>
  );
}
