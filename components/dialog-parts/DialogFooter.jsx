import React from "react";

/**
 * DialogFooter Component
 * Standardized footer for dialog modals with Cancel and Submit buttons
 *
 * @param {Object} props
 * @param {Function} props.onCancel - Cancel button handler
 * @param {Function} props.onSubmit - Submit button handler (optional if in form)
 * @param {string} props.submitLabel - Submit button text (default: "Save")
 * @param {string} props.cancelLabel - Cancel button text (default: "Cancel")
 * @param {boolean} props.loading - Loading state disables buttons
 * @param {boolean} props.disabled - Disabled state for submit button
 * @param {string} props.submitType - Button type (default: "submit")
 * @returns {JSX.Element}
 */
export function DialogFooter({
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
  submitType = 'submit'
}) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        className="px-4 py-2 bg-[var(--bg-muted)] text-[var(--text-primary)] border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--bg-secondary)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelLabel}
      </button>
      <button
        type={submitType}
        className="px-4 py-2 bg-[var(--accent-primary)] text-white border-none rounded-md cursor-pointer font-medium text-sm transition-all hover:bg-[var(--accent-primary-hover)] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSubmit}
        disabled={loading || disabled}
      >
        {loading ? 'Loading...' : submitLabel}
      </button>
    </div>
  );
}
