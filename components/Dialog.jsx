import React from "react";

// Generic Dialog Component
export function Dialog({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-[var(--bg-primary)] rounded-lg w-[90%] max-w-lg p-6 shadow-[var(--shadow-lg)]" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
