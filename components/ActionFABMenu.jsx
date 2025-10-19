import React, { useState } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import * as Icons from "../icons/index.jsx";
import { LoadSpecButton } from "./LoadSpecButton.jsx";

// Action FAB Menu Component
export function ActionFABMenu({ showCodeEditor, onToggleView, onPromptOpen, showPromptPanel }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentEndpointId, resetEndpointCode } = useEndpoints();
  const toast = useToast();

  const handleReset = () => {
    if (window.confirm("Reset code to default state? This cannot be undone.")) {
      resetEndpointCode(currentEndpointId);
      toast.addToast("Code reset to default state", "success");
    }
  };

  const handleToggleView = () => {
    onToggleView();
  };

  const handleToggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    // Sync AI assistant with menu state
    onPromptOpen(newMenuState);
  };

  // Adjust bottom position based on AI panel visibility
  const bottomClass = showPromptPanel ? 'bottom-[70px]' : 'bottom-6';

  return (
    <div className={`absolute right-6 z-[100] flex flex-col items-end gap-2 transition-all duration-300 ${bottomClass}`}>
      {isMenuOpen && (
        <div className="flex flex-col items-end gap-2 animate-slide-up">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-cyan-400 dark:text-cyan-300 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            style={{ background: 'rgba(6, 182, 212, 0.15)' }}
            onClick={handleToggleView}
            title={showCodeEditor ? "Show Preview" : "Show Code Editor"}
          >
            {showCodeEditor ? <Icons.Preview /> : <Icons.Code />}
          </button>
          <LoadSpecButton />
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-purple-400 dark:text-purple-300 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            style={{ background: 'rgba(168, 85, 247, 0.15)' }}
            onClick={handleReset}
            title="Reset to Default"
          >
            <Icons.Reset />
          </button>
        </div>
      )}
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-xl font-bold transition-all hover:scale-110 hover:rotate-90 hover:shadow-xl p-0 text-emerald-400 dark:text-emerald-300 shadow-lg"
        style={{ background: 'rgba(16, 185, 129, 0.15)' }}
        onClick={handleToggleMenu}
        title="Actions"
      >
        {isMenuOpen ? '×' : '☰'}
      </button>
    </div>
  );
}
