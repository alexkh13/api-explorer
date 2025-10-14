import React, { useRef, useState, useEffect, useCallback } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { generatePreviewHTML } from "../services/preview-template.js";
import { processCodeForPreview } from "../services/transpilation-service.js";

// Preview Component
export function Preview() {
  const { currentEndpointId, getEndpointCode } = useEndpoints();
  const code = getEndpointCode(currentEndpointId);
  const iframeRef = useRef(null);
  const [lastRenderedCode, setLastRenderedCode] = useState("");

  // Initial render on mount
  useEffect(() => {
    renderPreview();
  }, []);

  // Reset lastRenderedCode when endpoint changes
  useEffect(() => {
    setLastRenderedCode("");
    renderPreview();
  }, [currentEndpointId]);

  // Re-render when code changes
  useEffect(() => {
    if (code !== lastRenderedCode) {
      renderPreview();
    }
  }, [code, lastRenderedCode]);

  const renderPreview = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Process code using transpilation service
    const { transpiledCode, renderCode } = processCodeForPreview(code);

    // Generate HTML using the template service
    const html = generatePreviewHTML(transpiledCode, renderCode);

    // Update iframe
    iframe.srcdoc = html;
    setLastRenderedCode(code);
  }, [code]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <iframe ref={iframeRef} title="Preview" sandbox="allow-scripts" className="flex-1 w-full border-none bg-[var(--bg-primary)]" />
    </div>
  );
}
