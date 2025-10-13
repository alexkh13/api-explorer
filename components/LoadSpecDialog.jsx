import React, { useState } from "react";
import { useEndpoints } from "../contexts/EndpointContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { Dialog } from "./Dialog.jsx";

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
      const { endpoints, baseUrl } = window.parseOpenAPISpec(spec, bearerToken.trim() || null);

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
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Load OpenAPI Spec</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Enter the URL of an OpenAPI v3 JSON specification to load all endpoints.
          Optionally provide a bearer token to include in API requests.
        </p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Spec URL</label>
          <input
            type="url"
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="https://api.example.com/openapi.json"
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Bearer Token (optional)</label>
          <input
            type="password"
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={bearerToken}
            onChange={e => setBearerToken(e.target.value)}
            placeholder="Enter bearer token for API authentication"
            disabled={loading}
          />
          <div className="text-[var(--text-secondary)] text-xs mt-1">
            Will be included as "Authorization: Bearer [token]" in generated code
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-[var(--bg-muted)] text-[var(--text-primary)] border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--bg-secondary)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--accent-primary-hover)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Spec'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
