import React, { createContext, useContext } from "react";

// Toast Context
export const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {}
});

export const useToast = () => useContext(ToastContext);
