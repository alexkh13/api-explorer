import React, { useRef, useState, useEffect, useCallback } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { findChildEndpoints, resolveParamsFromRow } from "../utils/endpoint-relationships.js";

// Preview Component
export function Preview() {
  const { currentEndpointId, getEndpointCode, endpoints, selectEndpoint, navigateWithParams } = useEndpoints();
  const code = getEndpointCode(currentEndpointId);
  const iframeRef = useRef(null);
  const [lastRenderedCode, setLastRenderedCode] = useState("");
  const [iframeReady, setIframeReady] = useState(false);

  // Handle navigation request from iframe
  const handleNavigateToEndpoint = useCallback((payload) => {
    const { parentPath, rowData } = payload;

    console.log('[Preview] Navigation requested from:', parentPath);
    console.log('[Preview] Row data:', rowData);

    // Find the parent endpoint
    const parentEndpoint = endpoints.find(ep => ep.path === parentPath);
    if (!parentEndpoint) {
      console.warn('[Preview] Parent endpoint not found:', parentPath);
      return;
    }

    console.log('[Preview] Found parent endpoint:', parentEndpoint);

    // Find child endpoints
    const childEndpoints = findChildEndpoints(parentEndpoint, endpoints);
    console.log('[Preview] Found child endpoints:', childEndpoints);

    if (childEndpoints.length === 0) {
      console.log('[Preview] No child endpoints found for:', parentPath);
      console.log('[Preview] Available endpoints:', endpoints.map(e => ({ path: e.path, params: e.parameters })));
      return;
    }

    // Use the first matching child endpoint
    const childEndpoint = childEndpoints[0];
    console.log('[Preview] Navigating to child endpoint:', childEndpoint.path);
    console.log('[Preview] Child param names:', childEndpoint.paramNames);

    // Resolve parameter values from row data
    const paramValues = resolveParamsFromRow(childEndpoint.paramNames, rowData);
    console.log('[Preview] Resolved param values:', paramValues);

    // Navigate to the child endpoint with pre-filled parameters
    if (navigateWithParams) {
      navigateWithParams(childEndpoint.id, paramValues);
    } else {
      // Fallback to simple navigation if navigateWithParams is not available
      selectEndpoint(childEndpoint.id);
    }
  }, [endpoints, selectEndpoint, navigateWithParams]);

  // Listen for iframe messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'ready') {
        console.log('[Preview Component] Iframe ready signal received');
        setIframeReady(true);
      } else if (event.data.type === 'NAVIGATE_TO_ENDPOINT') {
        handleNavigateToEndpoint(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleNavigateToEndpoint]);

  // Render preview callback - must be defined before useEffects that use it
  const renderPreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    console.log('[Preview Component] Sending code to iframe:', code?.substring(0, 100) + '...');

    // Send code to iframe via postMessage
    iframe.contentWindow.postMessage({
      type: 'render',
      code: code
    }, window.location.origin);

    setLastRenderedCode(code);
  }, [code]);

  // Set iframe src on mount
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && !iframe.src) {
      iframe.src = 'preview.html';
    }
  }, []);

  // Render preview when iframe is ready and code changes
  useEffect(() => {
    if (iframeReady && code !== lastRenderedCode) {
      renderPreview();
    }
  }, [iframeReady, code, lastRenderedCode, renderPreview]);

  // Reset when endpoint changes
  useEffect(() => {
    setLastRenderedCode("");
    if (iframeReady) {
      renderPreview();
    }
  }, [currentEndpointId, iframeReady, renderPreview]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <iframe
        ref={iframeRef}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full border-none bg-[var(--bg-primary)]"
      />
    </div>
  );
}
