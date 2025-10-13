import React, { useState } from "react";
import { useAI } from "../contexts/AIContext.jsx";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { APIKeyDialog } from "./APIKeyDialog.jsx";

// Minimal AI Assistant Component
export function MinimalAIAssistant({ isOpen, onClose }) {
  const { generateCompletions, isConfigured, isProcessing } = useAI();
  const { currentEndpointId, getEndpointCode, updateEndpointCode, getCurrentEndpoint } = useEndpoints();
  const toast = useToast();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  // Get current code to determine action type
  const code = getEndpointCode(currentEndpointId);
  const hasTodos = code.includes('TODO:') || code.includes('TODO ');

  // Determine action based on code state
  const action = hasTodos
    ? { id: 'implement', label: 'Implement TODOs', icon: '⚡' }
    : { id: 'plan', label: 'Plan next feature', icon: '📋' };

  const handleActionClick = async () => {
    if (!isConfigured) {
      toast.addToast('Please configure your AI API key first', 'error');
      setShowApiKeyDialog(true);
      return;
    }

    const currentEndpoint = getCurrentEndpoint();

    let optimizedPrompt;

    if (action.id === 'plan') {
      // PLAN mode: Analyze code and add TODOs for the next most valuable feature
      optimizedPrompt = `
Add TODO comments to plan ONE improvement. Return the COMPLETE code with TODOs inserted.

RULES:
1. Copy ALL the existing code exactly as it is
2. Insert TODO comments at locations where changes will be made
3. Pick ONE task: error handling, loading states, OR input validation
4. All TODOs must be for the SAME task
5. Return ONLY the code - no explanations, no markdown

CODE TO MODIFY:
${code}
`.trim();
    } else {
      // IMPLEMENT mode: Implement all the TODOs that were planned
      optimizedPrompt = `
Implement ALL TODO comments found in the code. Return the COMPLETE implemented code.

RULES:
1. Implement EVERY TODO comment
2. Remove TODO comments after implementing
3. Use window.APIExplorer utilities (Layout, Response, ErrorDisplay, etc.)
4. Use .then()/.catch() for promises (NO async/await)
5. Return ONLY the code - no explanations, no markdown

CODE WITH TODOs:
${code}
`.trim();
    }

    toast.addToast(action.id === 'plan' ? 'Planning next feature...' : 'Implementing TODOs...', 'info');

    const success = await generateCompletions(optimizedPrompt, code, (newCode) => {
      updateEndpointCode(currentEndpointId, newCode);
      const successMsg = action.id === 'plan'
        ? 'TODOs added! Click "Implement" to execute the plan.'
        : 'TODOs implemented successfully!';
      toast.addToast(successMsg, 'success');
    });

    if (!success) {
      toast.addToast('Failed to ' + (action.id === 'plan' ? 'plan' : 'implement') + '. Check console for details.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-default)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[99] animate-slide-up">
        <div className="flex items-center justify-center h-14 px-3 gap-2">
          {/* Single action button */}
          <button
            onClick={handleActionClick}
            disabled={isProcessing}
            className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
          >
            {isProcessing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{action.id === 'plan' ? 'Planning...' : 'Implementing...'}</span>
              </>
            ) : (
              <>
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <APIKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
      />
    </>
  );
}
