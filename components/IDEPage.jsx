import React, { useState, useCallback, useEffect } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { Header } from "./Header.jsx";
import { CodeEditor } from "./CodeEditor.jsx";
import { Preview } from "./Preview.jsx";
import { MinimalAIAssistant } from "./MinimalAIAssistant.jsx";
import { ActionFABMenu } from "./ActionFABMenu.jsx";
import { ToastContainer } from "./ToastContainer.jsx";

// Main IDE Component
export function IDEPage() {
  const {
    currentEndpointId,
    getEndpointCode,
    updateEndpointCode,
    getCurrentEndpoint,
    updateVirtualEndpoint
  } = useEndpoints();
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const [showVirtualCode, setShowVirtualCode] = useState(false);

  // Get current code based on selected endpoint
  const currentEndpoint = getCurrentEndpoint();
  const isVirtual = currentEndpoint?.type === 'virtual';

  // Show virtual endpoint code or generated code
  const currentCode = (isVirtual && showVirtualCode)
    ? currentEndpoint.code
    : getEndpointCode(currentEndpointId);

  const handleCodeChange = useCallback(newCode => {
    // If showing virtual code, update the virtual endpoint's code property
    if (isVirtual && showVirtualCode) {
      updateVirtualEndpoint(currentEndpointId, { code: newCode });
    } else {
      // Otherwise update the generated code
      updateEndpointCode(currentEndpointId, newCode);
    }
  }, [currentEndpointId, updateEndpointCode, updateVirtualEndpoint, isVirtual, showVirtualCode]);

  const toggleView = () => {
    setShowCodeEditor(!showCodeEditor);
  };

  const handlePromptOpen = (isOpen) => {
    setShowPromptPanel(isOpen);
  };

  const closePromptPanel = () => {
    setShowPromptPanel(false);
  };

  const toggleVirtualCode = () => {
    setShowVirtualCode(!showVirtualCode);
  };

  // Reset showVirtualCode when changing endpoints
  useEffect(() => {
    setShowVirtualCode(false);
  }, [currentEndpointId]);

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

      {/* Bottom-left notification container - floats like FAB menu */}
      <ToastContainer showPromptPanel={showPromptPanel} />

      {/* Bottom-right FAB menu for actions */}
      <ActionFABMenu
        showCodeEditor={showCodeEditor}
        onToggleView={toggleView}
        onPromptOpen={handlePromptOpen}
        showPromptPanel={showPromptPanel}
        showVirtualCode={showVirtualCode}
        onToggleVirtualCode={toggleVirtualCode}
      />
    </div>
  );
}
