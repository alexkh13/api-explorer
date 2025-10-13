import React, { useState, useCallback, useEffect, useMemo, createContext, useContext } from "react";
import { debounce } from "../utils.js";
import { initialEndpointsData } from "../data/initial-endpoints.js";
import { generateStarterCode } from "../services/code-generator/index.js";

/**
 * Endpoint Context - Manages API endpoint state and code
 * Provides centralized state management for:
 * - Endpoint metadata (title, method, path, etc.)
 * - Generated and user-modified code
 * - Current selected endpoint
 * - Persistence to localStorage
 */
export const EndpointContext = createContext({
  endpoints: [],
  currentEndpointId: '',
  endpointCodes: {},
  modifiedEndpoints: new Set(),
  getEndpointById: () => null,
  getCurrentEndpoint: () => null,
  getEndpointCode: () => '',
  isEndpointModified: () => false,
  updateEndpointCode: () => {},
  resetEndpointCode: () => {},
  selectEndpoint: () => {},
  markEndpointCompleted: () => {},
  loadEndpointsFromSpec: () => {}
});

/**
 * Endpoint Provider Component
 * Manages endpoint state with localStorage persistence and dynamic code generation
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} props.initialEndpoints - Initial endpoints to load if no saved state exists
 * @returns {JSX.Element} Provider component wrapping children
 */
export function EndpointProvider({ children, initialEndpoints }) {
  const [state, setState] = useState(() => {
    const savedState = JSON.parse(
      localStorage.getItem("apiExplorer") || "{}"
    );

    // Use saved endpoints if available, otherwise use initial
    const endpointsToUse = savedState.endpoints || initialEndpoints;

    // Only load saved codes for modified endpoints
    const savedCodes = savedState.endpointCodes || {};
    const savedModified = savedState.modifiedEndpoints || [];

    return {
      currentEndpointId: savedState.currentEndpointId || endpointsToUse[0].id,
      endpoints: endpointsToUse,
      endpointCodes: savedCodes,
      modifiedEndpoints: new Set(savedModified),
      baseUrl: savedState.baseUrl || '',
      bearerToken: savedState.bearerToken || null
    };
  });

  // Debounced save to localStorage
  const saveToLocalStorage = useCallback(
    debounce((newState) => {
      // Convert Set to Array for JSON serialization
      const stateToSave = {
        ...newState,
        modifiedEndpoints: Array.from(newState.modifiedEndpoints)
      };
      localStorage.setItem(
        "apiExplorer",
        JSON.stringify(stateToSave)
      );
    }, 1000),
    []
  );

  // Save state to localStorage
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state, saveToLocalStorage]);

  // Context value with state and methods
  const value = useMemo(() => ({
    ...state,
    getEndpointById: (id) => state.endpoints.find(e => e.id === id),
    getCurrentEndpoint: () => state.endpoints.find(e => e.id === state.currentEndpointId),
    getEndpointCode: (endpointId) => {
      // If endpoint has been modified, return saved code
      if (state.modifiedEndpoints.has(endpointId)) {
        return state.endpointCodes[endpointId] || '';
      }

      // Otherwise, generate code dynamically
      const endpoint = state.endpoints.find(e => e.id === endpointId);
      if (!endpoint) return '';

      // If endpoint is from spec, generate code dynamically
      if (endpoint.isFromSpec && generateStarterCode) {
        return generateStarterCode(endpoint, state.baseUrl, state.bearerToken);
      }

      // Otherwise, use starterCode from endpoint (for demo endpoints)
      return endpoint.starterCode || '';
    },
    isEndpointModified: (endpointId) => state.modifiedEndpoints.has(endpointId),
    updateEndpointCode: (endpointId, code) => {
      setState(prev => {
        const newModified = new Set(prev.modifiedEndpoints);
        newModified.add(endpointId);
        return {
          ...prev,
          endpointCodes: {
            ...prev.endpointCodes,
            [endpointId]: code
          },
          modifiedEndpoints: newModified
        };
      });
    },
    resetEndpointCode: (endpointId) => {
      setState(prev => {
        const newModified = new Set(prev.modifiedEndpoints);
        newModified.delete(endpointId);
        const newCodes = { ...prev.endpointCodes };
        delete newCodes[endpointId];
        return {
          ...prev,
          endpointCodes: newCodes,
          modifiedEndpoints: newModified
        };
      });
    },
    selectEndpoint: (endpointId) => {
      setState(prev => ({
        ...prev,
        currentEndpointId: endpointId
      }));
    },
    markEndpointCompleted: (endpointId) => {
      setState(prev => ({
        ...prev,
        endpoints: prev.endpoints.map(e =>
          e.id === endpointId ? { ...e, completed: true } : e
        )
      }));
    },
    loadEndpointsFromSpec: (endpoints, baseUrl, bearerToken) => {
      // Don't initialize codes - let them be generated dynamically
      setState({
        currentEndpointId: endpoints[0]?.id || '',
        endpoints: endpoints,
        endpointCodes: {}, // Empty - codes will be dynamic until modified
        modifiedEndpoints: new Set(), // Reset modified tracking
        baseUrl: baseUrl || '',
        bearerToken: bearerToken || null
      });
    }
  }), [state]);

  return (
    <EndpointContext.Provider value={value}>
      {children}
    </EndpointContext.Provider>
  );
}

/**
 * Custom hook to access endpoint context
 * Provides access to endpoint state and management functions
 *
 * @returns {Object} Endpoint context value with state and methods
 * @throws {Error} If used outside of EndpointProvider
 *
 * @example
 * const { currentEndpointId, getEndpointCode, updateEndpointCode } = useEndpoints();
 */
export const useEndpoints = () => useContext(EndpointContext);
