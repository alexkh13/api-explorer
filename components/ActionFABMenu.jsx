import React, { useState } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import * as Icons from "../icons/index.jsx";
import { LoadSpecButton } from "./LoadSpecButton.jsx";

// Action FAB Menu Component
export function ActionFABMenu({ showEndpointsList, onToggleEndpointsList, showCodeEditor, onToggleView, onPromptOpen, showPromptPanel }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentEndpointId, resetEndpointCode } = useEndpoints();
  const toast = useToast();

  const handleReset = () => {
    if (window.confirm("Reset code to default state? This cannot be undone.")) {
      resetEndpointCode(currentEndpointId);
      toast.addToast("Code reset to default state", "success");
    }
  };

  const handleToggleEndpoints = () => {
    onToggleEndpointsList();
  };

  const handleToggleView = () => {
    onToggleView();
  };

  const handlePromptOpen = () => {
    onPromptOpen();
  };

  // Adjust bottom position based on AI panel visibility
  const bottomClass = showPromptPanel ? 'bottom-[70px]' : 'bottom-6';

  return (
    <div className={`absolute right-6 z-[100] flex flex-col items-end gap-3 transition-all duration-300 ${bottomClass}`}>
      {isMenuOpen && (
        <div className="flex flex-col items-end gap-3 animate-slide-up">
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handleToggleEndpoints}
            title="Toggle Endpoints List"
          >
            <Icons.List />
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handleToggleView}
            title={showCodeEditor ? "Show Preview" : "Show Code Editor"}
          >
            {showCodeEditor ? <Icons.Preview /> : <Icons.Edit />}
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-300 dark:border-green-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handlePromptOpen}
            title="AI Code Assistant"
          >
            <Icons.AI />
          </button>
          <LoadSpecButton />
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
            onClick={handleReset}
            title="Reset to Default"
          >
            <Icons.Reset />
          </button>
        </div>
      )}
      <button
        className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 shadow-lg flex items-center justify-center cursor-pointer text-2xl font-bold transition-all hover:scale-110 hover:rotate-90 hover:shadow-xl p-0"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="Actions"
      >
        {isMenuOpen ? '×' : '☰'}
      </button>
    </div>
  );
}
