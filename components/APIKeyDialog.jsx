import React, { useState, useEffect } from "react";
import { useAI } from "../contexts/AIContext.jsx";
import { Dialog } from "./Dialog.jsx";
import { DialogHeader, DialogFooter, FormField } from "./dialog-parts/index.jsx";

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

    setApiConfig(formState);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader
        title="Configure AI Assistant"
        description="To enable AI-powered code edits, please provide an API key for one of the supported services. Your key will be stored securely in your browser's local storage."
      />

      <form className="mt-6" onSubmit={handleSubmit}>
        {/* Provider Selection - Custom radio group */}
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

        <FormField
          label="API Key"
          type="password"
          value={formState.apiKey}
          onChange={e => {
            setFormState(prev => ({ ...prev, apiKey: e.target.value }));
            setError('');
          }}
          placeholder={`Enter your ${providers[formState.provider].name} API key`}
          error={error}
          required
        />

        <FormField
          label="Model"
          as="select"
          value={formState.model}
          onChange={e => setFormState(prev => ({ ...prev, model: e.target.value }))}
        >
          {providers[formState.provider]?.models?.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </FormField>

        <DialogFooter onCancel={onClose} submitLabel="Save" />
      </form>
    </Dialog>
  );
}
