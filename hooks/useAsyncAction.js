import { useState, useCallback } from "react";

/**
 * useAsyncAction Hook
 * Manages async action state (loading, error, data) with automatic state updates
 *
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {*} options.initialData - Initial data value
 * @returns {Object} Action state and execute function
 *
 * @example
 * const { execute, loading, error, data } = useAsyncAction(
 *   async (params) => await fetchData(params),
 *   { onSuccess: (data) => console.log('Success!', data) }
 * );
 */
export function useAsyncAction(asyncFn, options = {}) {
  const { onSuccess, onError, initialData = null } = options;

  const [state, setState] = useState({
    loading: false,
    error: null,
    data: initialData
  });

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn(...args);
      setState({ loading: false, error: null, data: result });

      if (onSuccess) {
        onSuccess(result);
      }

      return { success: true, data: result };
    } catch (error) {
      setState({ loading: false, error: error.message || 'An error occurred', data: initialData });

      if (onError) {
        onError(error);
      }

      return { success: false, error };
    }
  }, [asyncFn, onSuccess, onError, initialData]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: initialData });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.loading,
    isError: !!state.error,
    isSuccess: !state.loading && !state.error && state.data !== initialData
  };
}

/**
 * useAsyncState Hook
 * Simpler version for managing async state with status flags
 *
 * @param {*} initialValue - Initial state value
 * @returns {Object} State with loading/error flags and setState
 *
 * @example
 * const { value, setValue, loading, setLoading, error, setError } = useAsyncState(null);
 */
export function useAsyncState(initialValue = null) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setLoading(false);
    setError(null);
  }, [initialValue]);

  return {
    value,
    setValue,
    loading,
    setLoading,
    error,
    setError,
    reset,
    isLoading: loading,
    isError: !!error
  };
}
