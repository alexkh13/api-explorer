// Plain JS module - no JSX, no imports
// This file exports utility functions

window.AppUtils = {
  // Debounce utility
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};
