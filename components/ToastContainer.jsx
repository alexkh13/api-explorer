import React from "react";
import { useToast } from "../contexts/ToastContext.jsx";
import { Toast } from "./Toast.jsx";

// Toast container component - renders toasts with dynamic positioning
export function ToastContainer({ showPromptPanel }) {
  const { toasts, removeToast } = useToast();

  // Adjust bottom position based on AI panel visibility (matches FAB menu behavior)
  const bottomClass = showPromptPanel ? 'bottom-[70px]' : 'bottom-6';

  return (
    <div
      className={`absolute left-4 sm:left-6 z-[100] flex flex-col-reverse gap-2 transition-all duration-300 pointer-events-none ${bottomClass}`}
      style={{
        right: '6rem', // Reserve space for FAB menu (4rem width + 2rem spacing)
        maxWidth: 'calc(100vw - 10rem)', // Ensure doesn't overflow on any screen
      }}
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
