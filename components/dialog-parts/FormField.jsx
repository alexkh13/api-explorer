import React from "react";

/**
 * FormField Component
 * Standardized form field with label, input, error message, and optional help text
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.type - Input type (text, password, email, url, etc.)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message to display
 * @param {string} props.helpText - Optional help text below input
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.as - Element type: 'input', 'select', 'textarea' (default: 'input')
 * @param {React.ReactNode} props.children - For select options or custom content
 * @returns {JSX.Element}
 */
export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helpText,
  disabled = false,
  required = false,
  as = 'input',
  children
}) {
  const inputClassName = "w-full p-3 border border-[var(--border-default)] rounded-md font-[var(--font-sans)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed";

  const InputElement = as === 'select' ? 'select' : as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-sm text-[var(--text-primary)]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <InputElement
        type={as === 'input' ? type : undefined}
        className={inputClassName}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      >
        {children}
      </InputElement>
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
      {helpText && !error && (
        <div className="text-[var(--text-secondary)] text-xs mt-1">{helpText}</div>
      )}
    </div>
  );
}
