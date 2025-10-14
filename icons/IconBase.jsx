import React from "react";

/**
 * IconBase Component
 * Base SVG wrapper for stroke-based icons with consistent styling and props.
 * Used for outlined icons like Code, Run, Preview, etc.
 *
 * @param {Object} props - Component props
 * @param {string} [props.size="w-4 h-4"] - Tailwind size classes (e.g., "w-6 h-6", "w-5 h-5")
 * @param {string} [props.className=""] - Additional Tailwind classes to apply
 * @param {string} [props.viewBox="0 0 24 24"] - SVG viewBox attribute
 * @param {string} [props.fill="none"] - SVG fill color (default: none for stroke icons)
 * @param {string} [props.stroke="currentColor"] - SVG stroke color (inherits text color)
 * @param {number} [props.strokeWidth] - SVG stroke width (typically 2)
 * @param {React.ReactNode} props.children - SVG path/shape elements (use <Path> component)
 * @param {Object} [props.rest] - Additional SVG attributes (aria-label, role, etc.)
 * @returns {JSX.Element} SVG element
 *
 * @example
 * // Simple icon with default props
 * <IconBase strokeWidth={2}>
 *   <Path d="M5 13l4 4L19 7" />
 * </IconBase>
 *
 * @example
 * // Custom size and color
 * <IconBase size="w-8 h-8" className="text-red-500" strokeWidth={2}>
 *   <Path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
 * </IconBase>
 */
export function IconBase({
  size = "w-4 h-4",
  className = "",
  viewBox = "0 0 24 24",
  fill = "none",
  stroke = "currentColor",
  strokeWidth,
  children,
  ...rest
}) {
  const classes = `${size} ${className}`.trim();

  return (
    <svg
      className={classes}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...rest}
    >
      {children}
    </svg>
  );
}

/**
 * Icon Component
 * Simplified SVG wrapper for filled/solid icons (shapes array).
 * Used for endpoint variety icons with solid fill.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - SVG elements (circle, rect, polygon, path, etc.)
 * @param {string} [props.className=""] - Additional Tailwind classes to apply
 * @returns {JSX.Element} SVG element with currentColor fill
 *
 * @example
 * <Icon>
 *   <circle cx="12" cy="12" r="10"/>
 * </Icon>
 *
 * @example
 * <Icon className="text-blue-500">
 *   <rect x="3" y="3" width="18" height="18"/>
 * </Icon>
 */
export function Icon({ children, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {children}
    </svg>
  );
}

/**
 * Path Helper Component
 * SVG path element with automatic round line caps and joins.
 * Reduces boilerplate for stroke-based icon paths.
 *
 * @param {Object} props - All standard SVG path props (d, fill, stroke, etc.)
 * @param {string} props.d - SVG path data (required)
 * @returns {JSX.Element} SVG path element with strokeLinecap="round" and strokeLinejoin="round"
 *
 * @example
 * <Path d="M5 13l4 4L19 7" />
 *
 * @example
 * <Path d="M10 20l4-16" stroke="red" strokeWidth={3} />
 */
export function Path(props) {
  return <path strokeLinecap="round" strokeLinejoin="round" {...props} />;
}
