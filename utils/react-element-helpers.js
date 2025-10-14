// React.createElement Factory Helpers
// Utilities to reduce verbosity of React.createElement calls in generated code

/**
 * Create a React element factory for a given tag/component
 * @param {string} type - Element type (div, span, etc.)
 * @returns {Function} Factory function that creates elements
 */
function createElement(type) {
  return (props, ...children) => {
    return `React.createElement('${type}', ${props ? JSON.stringify(props) : 'null'}${children.length ? ', ' + children.join(', ') : ''})`;
  };
}

/**
 * Create element code with className shorthand
 * @param {string} type - Element type
 * @param {string} className - CSS classes
 * @param {Array} children - Child elements
 * @returns {string} React.createElement call
 */
export function el(type, className, ...children) {
  const props = className ? `{ className: '${className}' }` : 'null';
  const childrenStr = children.length ? ', ' + children.join(', ') : '';
  return `React.createElement('${type}', ${props}${childrenStr})`;
}

/**
 * Create element with style object
 * @param {string} type - Element type
 * @param {Object} style - Style object
 * @param {Array} children - Child elements
 * @returns {string} React.createElement call
 */
export function elStyle(type, style, ...children) {
  const props = `{ style: ${JSON.stringify(style)} }`;
  const childrenStr = children.length ? ', ' + children.join(', ') : '';
  return `React.createElement('${type}', ${props}${childrenStr})`;
}

/**
 * Create element with arbitrary props
 * @param {string} type - Element type
 * @param {Object} props - Props object
 * @param {Array} children - Child elements
 * @returns {string} React.createElement call
 */
export function elProps(type, props, ...children) {
  const propsStr = props ? JSON.stringify(props) : 'null';
  const childrenStr = children.length ? ', ' + children.join(', ') : '';
  return `React.createElement('${type}', ${propsStr}${childrenStr})`;
}

/**
 * Create a div element (most common)
 * @param {string} className - CSS classes
 * @param {Array} children - Child elements
 * @returns {string} React.createElement call
 */
export function div(className, ...children) {
  return el('div', className, ...children);
}

/**
 * Create a span element
 * @param {string} className - CSS classes
 * @param {string} content - Text content
 * @returns {string} React.createElement call
 */
export function span(className, content) {
  return `React.createElement('span', ${className ? `{ className: '${className}' }` : 'null'}, ${content ? `'${content}'` : 'null'})`;
}

/**
 * Create a button element with onClick handler
 * @param {Object} props - Props including onClick
 * @param {string} label - Button text
 * @returns {string} React.createElement call
 */
export function button(props, label) {
  return `React.createElement('button', ${JSON.stringify(props)}, ${typeof label === 'string' ? `'${label}'` : label})`;
}

/**
 * Build a component element (capitalized name = component)
 * @param {string} componentName - Component name
 * @param {Object} props - Component props
 * @param {Array} children - Child elements
 * @returns {string} React.createElement call
 */
export function component(componentName, props = {}, ...children) {
  const propsStr = Object.keys(props).length > 0 ? JSON.stringify(props) : 'null';
  const childrenStr = children.length ? ', ' + children.join(', ') : '';
  return `React.createElement(${componentName}, ${propsStr}${childrenStr})`;
}

/**
 * Generate a template string that interpolates expressions
 * @param {Array} parts - String parts
 * @param {Array} expressions - Expressions to interpolate
 * @returns {string} Template literal code
 */
export function template(parts, ...expressions) {
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    result += parts[i];
    if (i < expressions.length) {
      result += `\${${expressions[i]}}`;
    }
  }
  return `\`${result}\``;
}

/**
 * Create conditional rendering code (ternary)
 * @param {string} condition - Condition expression
 * @param {string} whenTrue - Element when true
 * @param {string} whenFalse - Element when false (optional)
 * @returns {string} Conditional expression
 */
export function conditional(condition, whenTrue, whenFalse = 'null') {
  return `${condition} ? ${whenTrue} : ${whenFalse}`;
}

/**
 * Create logical AND rendering code
 * @param {string} condition - Condition expression
 * @param {string} element - Element to render when true
 * @returns {string} Logical AND expression
 */
export function when(condition, element) {
  return `${condition} && ${element}`;
}

/**
 * Create a map rendering expression
 * @param {string} arrayExpr - Array expression to map
 * @param {string} itemVar - Item variable name
 * @param {string} indexVar - Index variable name (optional)
 * @param {string} elementCode - Element to render for each item
 * @returns {string} Map expression
 */
export function mapElements(arrayExpr, itemVar, indexVar, elementCode) {
  const params = indexVar ? `(${itemVar}, ${indexVar})` : `${itemVar}`;
  return `${arrayExpr}.map(${params} => ${elementCode})`;
}
