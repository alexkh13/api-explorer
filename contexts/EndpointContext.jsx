import React, { useCallback, useMemo, createContext, useContext, useEffect } from "react";
import { initialEndpointsData } from "../data/initial-endpoints.js";
import { generateStarterCode } from "../services/code-generator/index.js";
import { useLocalStorageState } from "../hooks/index.js";
import { createVirtualEndpoint } from "../services/virtual-endpoints/index.js";
import { generateVirtualEndpointCode } from "../services/virtual-endpoints/code-generator.js";
import { initializeFetchInterceptor, updateVirtualEndpoints } from "../services/virtual-endpoints/index.js";

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
  paramOverrides: {},
  getEndpointById: () => null,
  getCurrentEndpoint: () => null,
  getEndpointCode: () => '',
  isEndpointModified: () => false,
  updateEndpointCode: () => {},
  resetEndpointCode: () => {},
  selectEndpoint: () => {},
  navigateWithParams: () => {},
  markEndpointCompleted: () => {},
  loadEndpointsFromSpec: () => {},
  // Virtual endpoint methods
  createVirtualEndpoint: () => {},
  updateVirtualEndpoint: () => {},
  deleteVirtualEndpoint: () => {},
  getVirtualEndpoints: () => [],
  getRealEndpoints: () => []
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
  // Version to track schema changes - increment when initial endpoints structure changes
  const STORAGE_VERSION = 5;

  // Use localStorage sync hook with custom serialization for Set
  const [state, setState] = useLocalStorageState(
    "apiExplorer",
    () => ({
      version: STORAGE_VERSION,
      currentEndpointId: initialEndpoints[0].id,
      endpoints: initialEndpoints,
      endpointCodes: {},
      modifiedEndpoints: new Set(),
      paramOverrides: {},
      baseUrl: '',
      bearerToken: null
    }),
    {
      serialize: (state) => ({
        ...state,
        modifiedEndpoints: Array.from(state.modifiedEndpoints)
      }),
      deserialize: (savedState) => {
        // If version mismatch, reset to initial endpoints
        if (!savedState.version || savedState.version < STORAGE_VERSION) {
          console.log('[EndpointContext] Version mismatch, resetting endpoints to initial data');
          return {
            version: STORAGE_VERSION,
            currentEndpointId: initialEndpoints[0].id,
            endpoints: initialEndpoints,
            endpointCodes: {},
            modifiedEndpoints: new Set(),
            paramOverrides: {},
            baseUrl: '',
            bearerToken: null
          };
        }

        return {
          ...savedState,
          version: STORAGE_VERSION,
          modifiedEndpoints: new Set(savedState.modifiedEndpoints || []),
          endpoints: savedState.endpoints || initialEndpoints,
          paramOverrides: savedState.paramOverrides || {}
        };
      }
    }
  );

  // Initialize from browser history on mount and listen for back/forward navigation
  useEffect(() => {
    // Initialize from history.state on first load
    if (window.history.state) {
      const { endpointId, paramOverrides } = window.history.state;
      if (endpointId) {
        setState(prev => ({
          ...prev,
          currentEndpointId: endpointId,
          paramOverrides: {
            ...prev.paramOverrides,
            [endpointId]: paramOverrides || {}
          }
        }));
      }
    } else {
      // Initialize history with current state
      const historyState = {
        endpointId: state.currentEndpointId,
        paramOverrides: state.paramOverrides[state.currentEndpointId] || {}
      };
      window.history.replaceState(historyState, '', window.location.pathname);
    }

    // Listen for popstate events (back/forward navigation)
    const handlePopState = (event) => {
      if (event.state) {
        const { endpointId, paramOverrides } = event.state;
        if (endpointId) {
          setState(prev => ({
            ...prev,
            currentEndpointId: endpointId,
            paramOverrides: {
              ...prev.paramOverrides,
              [endpointId]: paramOverrides || {}
            }
          }));
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Only run on mount

  // Initialize and update fetch interceptor for virtual endpoints
  useEffect(() => {
    const virtualEndpoints = state.endpoints.filter(e => e.type === 'virtual');
    const realEndpoints = state.endpoints.filter(e => e.type !== 'virtual');

    // Initialize on first mount
    initializeFetchInterceptor(virtualEndpoints, realEndpoints);

    // Update when endpoints change
    updateVirtualEndpoints(virtualEndpoints, realEndpoints);
  }, [state.endpoints]);

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
      let endpoint = state.endpoints.find(e => e.id === endpointId);
      if (!endpoint) return '';

      // Handle virtual endpoints
      if (endpoint.type === 'virtual') {
        const realEndpoints = state.endpoints.filter(e => e.type !== 'virtual');
        return generateVirtualEndpointCode(endpoint, realEndpoints);
      }

      // Apply parameter overrides if they exist
      if (state.paramOverrides[endpointId]) {
        endpoint = {
          ...endpoint,
          parameters: endpoint.parameters?.map(param => {
            const override = state.paramOverrides[endpointId][param.name];
            return override !== undefined ? { ...param, default: override } : param;
          })
        };
      }

      // If endpoint has custom code, always use starterCode (don't regenerate)
      if (endpoint.isCustomCode) {
        return endpoint.starterCode || '';
      }

      // If endpoint is from spec, generate code dynamically
      if (endpoint.isFromSpec && generateStarterCode) {
        return generateStarterCode(endpoint, state.baseUrl, state.bearerToken);
      }

      // Otherwise, use starterCode from endpoint (for demo endpoints)
      // For demo endpoints, regenerate with overrides
      if (state.paramOverrides[endpointId] && generateStarterCode) {
        return generateStarterCode(endpoint, state.baseUrl, state.bearerToken);
      }

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
      setState(prev => {
        const newState = {
          ...prev,
          currentEndpointId: endpointId
        };

        // Push state to browser history
        const historyState = {
          endpointId: endpointId,
          paramOverrides: prev.paramOverrides[endpointId] || {}
        };
        window.history.pushState(historyState, '', window.location.pathname);

        return newState;
      });
    },
    navigateWithParams: (endpointId, paramValues) => {
      setState(prev => {
        const newState = {
          ...prev,
          currentEndpointId: endpointId,
          paramOverrides: {
            ...prev.paramOverrides,
            [endpointId]: paramValues
          }
        };

        // Push state to browser history
        const historyState = {
          endpointId: endpointId,
          paramOverrides: paramValues
        };
        window.history.pushState(historyState, '', window.location.pathname);

        return newState;
      });
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
        version: STORAGE_VERSION,
        currentEndpointId: endpoints[0]?.id || '',
        endpoints: endpoints,
        endpointCodes: {}, // Empty - codes will be dynamic until modified
        modifiedEndpoints: new Set(), // Reset modified tracking
        paramOverrides: {}, // Reset parameter overrides
        baseUrl: baseUrl || '',
        bearerToken: bearerToken || null
      });
    },
    // Virtual endpoint methods
    createVirtualEndpoint: (data) => {
      const virtualEndpoint = createVirtualEndpoint(data);
      setState(prev => ({
        ...prev,
        endpoints: [...prev.endpoints, virtualEndpoint],
        currentEndpointId: virtualEndpoint.id
      }));
      return virtualEndpoint;
    },
    updateVirtualEndpoint: (id, updates) => {
      setState(prev => ({
        ...prev,
        endpoints: prev.endpoints.map(e =>
          e.id === id && e.type === 'virtual'
            ? { ...e, ...updates, updatedAt: new Date().toISOString() }
            : e
        )
      }));
    },
    deleteVirtualEndpoint: (id) => {
      setState(prev => {
        const newModified = new Set(prev.modifiedEndpoints);
        newModified.delete(id);
        const newCodes = { ...prev.endpointCodes };
        delete newCodes[id];

        return {
          ...prev,
          endpoints: prev.endpoints.filter(e => e.id !== id),
          endpointCodes: newCodes,
          modifiedEndpoints: newModified,
          currentEndpointId: prev.currentEndpointId === id
            ? prev.endpoints[0]?.id || ''
            : prev.currentEndpointId
        };
      });
    },
    getVirtualEndpoints: () => state.endpoints.filter(e => e.type === 'virtual'),
    getRealEndpoints: () => state.endpoints.filter(e => e.type !== 'virtual')
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
