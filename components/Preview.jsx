import React, { useRef, useState, useEffect, useCallback } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";

// Preview Component
export function Preview() {
  const { currentEndpointId, getEndpointCode } = useEndpoints();
  const code = getEndpointCode(currentEndpointId);
  const iframeRef = useRef(null);
  const [lastRenderedCode, setLastRenderedCode] = useState("");
  const [iframeReady, setIframeReady] = useState(false);

  // Listen for iframe ready message
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'ready') {
        console.log('[Preview Component] Iframe ready signal received');
        setIframeReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Set iframe src on mount
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && !iframe.src) {
      iframe.src = '/preview.html';
    }
  }, []);

  // Render preview when iframe is ready and code changes
  useEffect(() => {
    if (iframeReady && code !== lastRenderedCode) {
      renderPreview();
    }
  }, [iframeReady, code, lastRenderedCode]);

  // Reset when endpoint changes
  useEffect(() => {
    setLastRenderedCode("");
    if (iframeReady) {
      renderPreview();
    }
  }, [currentEndpointId, iframeReady]);

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
