import React, { useEffect } from "react";

// Toast notification component
export function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`${bgColors[type]} text-white px-4 py-3 rounded-md text-sm flex items-center justify-between min-w-[300px] max-w-[400px] shadow-[var(--shadow-lg)] animate-slide-in`}>
      {message}
      <button className="bg-transparent border-none text-white text-lg cursor-pointer ml-2 p-0 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full" onClick={onClose}>×</button>
    </div>
  );
}
