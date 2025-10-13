import React, { useState, useCallback, useEffect } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { Header } from "./Header.jsx";
import { EndpointItem } from "./EndpointItem.jsx";
import { CodeEditor } from "./CodeEditor.jsx";
import { Preview } from "./Preview.jsx";
import { MinimalAIAssistant } from "./MinimalAIAssistant.jsx";
import { ActionFABMenu } from "./ActionFABMenu.jsx";

// Main IDE Component
export function IDEPage() {
  const {
    currentEndpointId,
    getEndpointCode,
    updateEndpointCode,
    selectEndpoint,
    endpoints,
    isEndpointModified,
    getCurrentEndpoint
  } = useEndpoints();
  const [showEndpointsList, setShowEndpointsList] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(false);

  // Get current code based on selected endpoint
  const currentCode = getEndpointCode(currentEndpointId);
  const currentEndpoint = getCurrentEndpoint();

  const handleCodeChange = useCallback(newCode => {
    updateEndpointCode(currentEndpointId, newCode);
  }, [currentEndpointId, updateEndpointCode]);

  const handleEndpointSelect = (id) => {
    selectEndpoint(id);
    setShowEndpointsList(false);
  };

  const toggleView = () => {
    setShowCodeEditor(!showCodeEditor);
  };

  const toggleEndpointsList = () => {
    setShowEndpointsList(!showEndpointsList);
  };

  const togglePromptPanel = () => {
    setShowPromptPanel(!showPromptPanel);
  };

  const closePromptPanel = () => {
    setShowPromptPanel(false);
  };

  // Close prompt panel on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPromptPanel) {
        closePromptPanel();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showPromptPanel]);

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <Header endpoint={currentEndpoint} />
      <div className="flex-1 flex bg-[var(--bg-primary)] overflow-auto">
        {showCodeEditor ? (
          <CodeEditor code={currentCode} onChange={handleCodeChange} />
        ) : (
          <Preview />
        )}
      </div>

      {/* Endpoints overlay */}
      {showEndpointsList && (
        <div className="fixed top-12 left-0 right-0 bottom-0 bg-black/50 z-[999] flex items-stretch justify-start" onClick={() => setShowEndpointsList(false)}>
          <div className="bg-[var(--bg-secondary)] max-w-[500px] w-[85vw] flex-1 shadow-[var(--shadow-lg)] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center sticky top-0 bg-[var(--bg-secondary)] z-10 border-b border-[var(--border-default)] p-4">
              <span className="font-semibold text-lg text-[var(--text-primary)]">Endpoints</span>
              <button
                className="bg-transparent border-none text-[var(--text-primary)] text-3xl leading-none cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-accent)]"
                onClick={() => setShowEndpointsList(false)}
              >
                ×
              </button>
            </div>
            <div className="list-none p-0 m-0 flex-1 overflow-y-auto">
              {endpoints.map((endpoint) => (
                <EndpointItem
                  key={endpoint.id}
                  endpoint={endpoint}
                  isSelected={endpoint.id === currentEndpointId}
                  onSelect={handleEndpointSelect}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  isModified={isEndpointModified(endpoint.id)}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Minimal AI Assistant */}
      <MinimalAIAssistant isOpen={showPromptPanel} onClose={closePromptPanel} />

      {/* Bottom-right FAB menu for actions */}
      <ActionFABMenu
        showEndpointsList={showEndpointsList}
        onToggleEndpointsList={toggleEndpointsList}
        showCodeEditor={showCodeEditor}
        onToggleView={toggleView}
        onPromptOpen={togglePromptPanel}
        showPromptPanel={showPromptPanel}
      />
    </div>
  );
}
