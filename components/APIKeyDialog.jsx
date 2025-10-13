import React, { useState, useEffect } from "react";
import { useAI } from "../contexts/AIContext.jsx";
import { Dialog } from "./Dialog.jsx";

// API Key Dialog Component
export function APIKeyDialog({ isOpen, onClose }) {
  const { providers, provider, setApiConfig } = useAI();
  const [formState, setFormState] = useState({
    provider,
    apiKey: '',
    model: ''
  });
  const [error, setError] = useState('');

  // Reset model when provider changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      model: providers[prev.provider]?.defaultModel || ''
    }));
  }, [formState.provider, providers]);

  const handleProviderChange = (provider) => {
    setFormState(prev => ({ ...prev, provider }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.apiKey) {
      setError('API key is required');
      return;
    }

    // Update context
    setApiConfig(formState);
    onClose();
  };

  const renderModelOptions = () => {
    const providerConfig = providers[formState.provider];
    if (!providerConfig?.models) return null;

    return providerConfig.models.map(model => (
      <option key={model.id} value={model.id}>{model.name}</option>
    ));
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Configure AI Assistant</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          To enable AI-powered code edits, please provide an API key for one of the supported services.
          Your key will be stored securely in your browser's local storage.
        </p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Select AI Provider</label>
          {Object.keys(providers).map(key => (
            <div
              key={key}
              className={`flex items-center gap-3 p-3 border rounded-md mb-3 cursor-pointer transition-all
                ${formState.provider === key
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-muted)]'
                  : 'border-[var(--border-default)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              onClick={() => handleProviderChange(key)}
            >
              <input
                type="radio"
                className="w-[18px] h-[18px]"
                checked={formState.provider === key}
                onChange={() => handleProviderChange(key)}
              />
              <span className="font-medium text-[var(--text-primary)]">{providers[key].name}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">API Key</label>
          <input
            type="password"
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={formState.apiKey}
            onChange={e => {
              setFormState(prev => ({ ...prev, apiKey: e.target.value }));
              setError('');
            }}
            placeholder={`Enter your ${providers[formState.provider].name} API key`}
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">Model</label>
          <select
            className="w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
            value={formState.model}
            onChange={e => setFormState(prev => ({ ...prev, model: e.target.value }))}
          >
            {renderModelOptions()}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-[var(--bg-muted)] text-[var(--text-primary)] border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--bg-secondary)] shadow-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--accent-primary-hover)] shadow-sm"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
