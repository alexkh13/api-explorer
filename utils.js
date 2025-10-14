// Plain JS module - no JSX
// This file exports utility functions

/**
 * Debounce function to limit how often a function can be called
 * Delays execution until after wait milliseconds have elapsed since the last call
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before executing
 * @returns {Function} Debounced function
 *
 * @example
 * const saveData = debounce((data) => localStorage.setItem('key', data), 1000);
 * saveData('value1'); // Will not execute
 * saveData('value2'); // Will not execute
 * saveData('value3'); // Will execute after 1000ms with 'value3'
 */
export function debounce(func, wait) {
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
