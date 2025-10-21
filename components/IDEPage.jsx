import React, { useState, useCallback, useEffect } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { Header } from "./Header.jsx";
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
    getCurrentEndpoint
  } = useEndpoints();
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(false);

  // Get current code based on selected endpoint
  const currentCode = getEndpointCode(currentEndpointId);
  const currentEndpoint = getCurrentEndpoint();

  const handleCodeChange = useCallback(newCode => {
    updateEndpointCode(currentEndpointId, newCode);
  }, [currentEndpointId, updateEndpointCode]);

  const toggleView = () => {
    setShowCodeEditor(!showCodeEditor);
  };

  const handlePromptOpen = (isOpen) => {
    setShowPromptPanel(isOpen);
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

      {/* Minimal AI Assistant - Part of page layout */}
      <MinimalAIAssistant isOpen={showPromptPanel} onClose={closePromptPanel} />

      {/* Bottom-right FAB menu for actions */}
      <ActionFABMenu
        showCodeEditor={showCodeEditor}
        onToggleView={toggleView}
        onPromptOpen={handlePromptOpen}
        showPromptPanel={showPromptPanel}
      />
    </div>
  );
}
