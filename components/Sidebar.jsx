import React, { useState, useEffect } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { EndpointItem } from "./EndpointItem.jsx";

// Sidebar Component
export function Sidebar() {
  const { endpoints, currentEndpointId, selectEndpoint, isEndpointModified } = useEndpoints();
  const [expandedId, setExpandedId] = useState(currentEndpointId);

  // Automatically expand the selected endpoint
  useEffect(() => {
    setExpandedId(currentEndpointId);
  }, [currentEndpointId]);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-[300px] min-w-[300px] flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-y-auto hidden flex-col">
      <div className="p-4 border-b border-[var(--border-default)] font-semibold text-lg text-[var(--text-primary)] flex items-center">
        <span>Endpoints</span>
      </div>
      <div className="list-none p-0 m-0 flex-1 overflow-y-auto">
        {endpoints.map((endpoint) => (
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
      </div>
    </div>
  );
}
