import React from "react";

/**
 * DialogHeader Component
 * Standardized header for dialog modals with title and description
 *
 * @param {Object} props
 * @param {string} props.title - Dialog title
 * @param {string|React.ReactNode} props.description - Dialog description text
 * @returns {JSX.Element}
 */
export function DialogHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
        {title}
      </h2>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
