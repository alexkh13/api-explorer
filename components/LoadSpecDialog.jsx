import React, { useState } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { Dialog } from "./Dialog.jsx";
import { DialogHeader, DialogFooter, FormField } from "./dialog-parts/index.jsx";
import { parseOpenAPISpec } from "../services/openapi-parser.js";

// Load OpenAPI Spec Dialog Component
export function LoadSpecDialog({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loadEndpointsFromSpec } = useEndpoints();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch spec: ${response.statusText}`);
      }

      const spec = await response.json();
      const { endpoints, baseUrl } = parseOpenAPISpec(spec, bearerToken.trim() || null);

      loadEndpointsFromSpec(endpoints, baseUrl, bearerToken.trim() || null);
      toast.addToast(`Loaded ${endpoints.length} endpoints from spec`, 'success');
      onClose();
      setUrl('');
      setBearerToken('');
    } catch (err) {
      console.error('Error loading spec:', err);
      setError(err.message || 'Failed to load OpenAPI spec');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader
        title="Load OpenAPI Spec"
        description="Enter the URL of an OpenAPI v3 JSON specification to load all endpoints. Optionally provide a bearer token to include in API requests."
      />

      <form className="mt-6" onSubmit={handleSubmit}>
        <FormField
          label="Spec URL"
          type="url"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
            setError('');
          }}
          placeholder="https://api.example.com/openapi.json"
          error={error}
          disabled={loading}
          required
        />

        <FormField
          label="Bearer Token (optional)"
          type="password"
          value={bearerToken}
          onChange={e => setBearerToken(e.target.value)}
          placeholder="Enter bearer token for API authentication"
          helpText='Will be included as "Authorization: Bearer [token]" in generated code'
          disabled={loading}
        />

        <DialogFooter
          onCancel={onClose}
          submitLabel="Load Spec"
          loading={loading}
        />
      </form>
    </Dialog>
  );
}
