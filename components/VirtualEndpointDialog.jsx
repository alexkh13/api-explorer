import React, { useState, useEffect } from "react";
import { Dialog } from "./Dialog.jsx";
import { Code, Check, Send } from "../icons/index.jsx";
import { useEndpoints, useToast } from "../contexts/index.jsx";
import { getTemplateList, getTemplate, validateVirtualEndpointCode } from "../services/virtual-endpoints/index.js";
import { VirtualEndpointExecutor } from "../services/virtual-endpoints/executor.js";

export function VirtualEndpointDialog({ isOpen, onClose, editingEndpoint = null }) {
  const { createVirtualEndpoint, updateVirtualEndpoint, endpoints } = useEndpoints();
  const { showToast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  // UI state
  const [activeTab, setActiveTab] = useState('code'); // code | test
  const [testInput, setTestInput] = useState('{}');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [validation, setValidation] = useState({ valid: true, errors: [], warnings: [] });

  // Load editing endpoint data
  useEffect(() => {
    if (editingEndpoint) {
      setName(editingEndpoint.name || '');
      setPath(editingEndpoint.path || '');
      setMethod(editingEndpoint.method || 'GET');
      setDescription(editingEndpoint.description || '');
      setCode(editingEndpoint.code || '');
    } else {
      // Reset form for new endpoint
      const template = getTemplate('blank');
      setName('');
      setPath('/virtual/endpoint');
      setMethod('GET');
      setDescription('');
      setCode(template.code);
    }
  }, [editingEndpoint, isOpen]);

  // Validate code on change
  useEffect(() => {
    if (code) {
      const result = validateVirtualEndpointCode(code);
      setValidation(result);
    }
  }, [code]);

  const handleTemplateChange = (templateKey) => {
    setSelectedTemplate(templateKey);
    const template = getTemplate(templateKey);
    setCode(template.code);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Parse test input
      const input = JSON.parse(testInput);

      // Create temporary virtual endpoint
      const tempEndpoint = {
        id: 'temp-test',
        name: name || 'Test',
        code,
        config: { timeout: 10000 }
      };

      // Get real endpoints (exclude virtual ones for testing)
      const realEndpoints = endpoints.filter(e => e.type !== 'virtual');

      // Execute
      const executor = new VirtualEndpointExecutor(tempEndpoint, realEndpoints);
      const result = await executor.execute(input);

      setTestResult(result);

      if (result.success) {
        showToast('Test executed successfully', 'success');
      } else {
        showToast('Test failed: ' + result.error, 'error');
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message
      });
      showToast('Test failed: ' + error.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    if (!code.trim()) {
      showToast('Code is required', 'error');
      return;
    }

    if (!validation.valid) {
      showToast('Code has errors. Please fix them before saving.', 'error');
      return;
    }

    // Create or update virtual endpoint
    const data = {
      name: name.trim(),
      path: path.trim() || '/virtual/endpoint',
      method,
      description: description.trim(),
      code: code.trim(),
      config: { timeout: 10000 }
    };

    if (editingEndpoint) {
      updateVirtualEndpoint(editingEndpoint.id, data);
      showToast('Virtual endpoint updated', 'success');
    } else {
      createVirtualEndpoint(data);
      showToast('Virtual endpoint created', 'success');
    }

    onClose();
  };

  const templates = getTemplateList();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-[80vh] max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {editingEndpoint ? 'Edit Virtual Endpoint' : 'Create Virtual Endpoint'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Basic Info */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enhanced User Profile"
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Path
              </label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/virtual/endpoint"
                className="w-full px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this endpoint do?"
              className="w-full px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[var(--border-color)] mb-3">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'code'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'test'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Test
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'code' && (
            <div className="h-full flex flex-col">
              {/* Template Selector */}
              <div className="mb-2">
                <label className="block text-sm text-[var(--text-secondary)] mb-1">
                  Load Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500 text-sm"
                >
                  {templates.map((template) => (
                    <option key={template.key} value={template.key}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Editor */}
              <div className="flex-1 overflow-auto">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="async function virtualEndpoint(context) { ... }"
                  className="w-full h-full min-h-[300px] px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Validation Messages */}
              {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                <div className="mt-2 space-y-1">
                  {validation.errors.map((error, i) => (
                    <div key={`error-${i}`} className="text-xs text-red-500">
                      ✗ {error}
                    </div>
                  ))}
                  {validation.warnings.map((warning, i) => (
                    <div key={`warning-${i}`} className="text-xs text-yellow-500">
                      ⚠ {warning}
                    </div>
                  ))}
                </div>
              )}

              {validation.valid && code && (
                <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
                  <Check />
                  Code is valid
                </div>
              )}
            </div>
          )}

          {activeTab === 'test' && (
            <div className="h-full flex flex-col gap-3">
              {/* Test Input */}
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">
                  Test Input (JSON)
                </label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder='{"params": {"id": "123"}, "query": {}, "body": {}}'
                  className="w-full h-24 px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
                  spellCheck={false}
                />
              </div>

              <button
                onClick={handleTest}
                disabled={testing || !validation.valid}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send />
                {testing ? 'Testing...' : 'Execute Test'}
              </button>

              {/* Test Result */}
              {testResult && (
                <div className="flex-1 overflow-auto">
                  <div className="text-sm text-[var(--text-secondary)] mb-1">
                    Result
                  </div>
                  <div className="px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded border border-[var(--border-color)] font-mono text-xs overflow-auto max-h-[200px]">
                    <pre>{JSON.stringify(testResult, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!validation.valid || !name.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingEndpoint ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
