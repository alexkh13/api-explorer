import React, { useState } from "react";
import { useAI } from "../contexts/AIContext.jsx";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { APIKeyDialog } from "./APIKeyDialog.jsx";
import { Send } from "../icons/index.jsx";

// Minimal AI Assistant Component
export function MinimalAIAssistant({ isOpen, onClose }) {
  const { generateCompletions, isConfigured, isProcessing, status } = useAI();
  const { currentEndpointId, getEndpointCode, updateEndpointCode } = useEndpoints();
  const toast = useToast();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim() || isProcessing) return;

    if (!isConfigured) {
      toast.addToast('Please configure your AI API key first', 'error');
      setShowApiKeyDialog(true);
      return;
    }

    const code = getEndpointCode(currentEndpointId);
    const userPrompt = prompt.trim();
    setPrompt(""); // Clear input immediately

    // Build the optimized prompt
    const optimizedPrompt = `
${userPrompt}

Return the COMPLETE modified code.

RULES:
1. Implement the requested change
2. Use window.APIExplorer utilities (Layout, Response, ErrorDisplay, etc.)
3. Use .then()/.catch() for promises (NO async/await)
4. Return ONLY the code - no explanations, no markdown

CURRENT CODE:
${code}
`.trim();

    toast.addToast('Processing your request...', 'info');

    const success = await generateCompletions(optimizedPrompt, code, (newCode) => {
      updateEndpointCode(currentEndpointId, newCode);
      toast.addToast('Code updated successfully!', 'success');
    });

    if (!success) {
      // Show the actual error message from the AI context status
      const errorMessage = status || 'Failed to process request. Check console for details.';
      toast.addToast(errorMessage, 'error');
      console.error('[MinimalAIAssistant] Request failed with status:', status);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-[var(--bg-primary)] border-t border-[var(--border-default)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10">
        <form onSubmit={handleSubmit} className="flex items-center h-14 px-6 gap-2">
          {/* Input field */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="describe what you want to change..."
            disabled={isProcessing}
            className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] font-mono text-sm placeholder:text-[var(--text-muted)] disabled:opacity-50"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="flex-shrink-0 p-2 bg-transparent border-none text-[var(--accent-primary)] cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
            aria-label="Send"
          >
            {isProcessing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <div className="rotate-90">
                <Send />
              </div>
            )}
          </button>
        </form>
      </div>

      <APIKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
      />
    </>
  );
}
