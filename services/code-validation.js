// Code Validation Service
// Validates AI-generated code for browser compatibility

/**
 * Browser-incompatible code patterns
 * @type {Array<{pattern: RegExp, message: string}>}
 */
const INCOMPATIBLE_PATTERNS = [
  {
    pattern: /import\s+.+\s+from\s+['"](?!react|react-dom)([^/][^'"]*)['"];?/g,
    message: 'Unsupported import from non-CDN source'
  },
  {
    pattern: /require\s*\(/g,
    message: 'require() is not supported in browser environment'
  },
  {
    pattern: /fs\.|path\.|process\.env|__dirname|__filename/g,
    message: 'Node.js APIs are not available in browser'
  },
  {
    pattern: /module\.exports|exports\./g,
    message: 'CommonJS module system not supported'
  }
];

/**
 * Strip code blocks from AI response
 * @param {string} code - Raw AI response
 * @returns {string} Cleaned code without markdown code blocks
 */
export function stripCodeBlocks(code) {
  if (code.includes('```')) {
    const codeBlockMatch = code.match(/```(?:jsx?|tsx?|javascript)?\n([\s\S]+?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1];
    }
  }
  return code;
}

/**
 * Validate code for browser compatibility
 * @param {string} code - Code to validate
 * @returns {{isValid: boolean, message: string|null}} Validation result
 */
export function validateBrowserCompatibility(code) {
  for (const { pattern, message } of INCOMPATIBLE_PATTERNS) {
    if (pattern.test(code)) {
      return { isValid: false, message };
    }
  }
  return { isValid: true, message: null };
}

/**
 * Validate code syntax using Babel
 * @param {string} code - Code to validate
 * @returns {{isValid: boolean, message: string|null}} Validation result
 */
export function validateSyntax(code) {
  try {
    // Only perform this check for complete function/component definitions
    if (code.includes('function') || code.includes('class') || code.includes('=>')) {
      window.Babel.transform(code, { presets: ['react'] });
    }
    return { isValid: true, message: null };
  } catch (error) {
    return { isValid: false, message: error.message };
  }
}

/**
 * Complete validation pipeline for AI-generated code
 * @param {string} code - Raw AI response
 * @returns {{
 *   isValid: boolean,
 *   code: string,
 *   error: string|null
 * }} Validation result with cleaned code
 */
export function validateGeneratedCode(code) {
  // Step 1: Strip code blocks
  const cleanedCode = stripCodeBlocks(code);

  // Step 2: Check browser compatibility
  const compatCheck = validateBrowserCompatibility(cleanedCode);
  if (!compatCheck.isValid) {
    return {
      isValid: false,
      code: cleanedCode,
      error: `${compatCheck.message}. The AI generated code that isn't compatible with the browser environment.`
    };
  }

  // Step 3: Validate syntax
  const syntaxCheck = validateSyntax(cleanedCode);
  if (!syntaxCheck.isValid) {
    return {
      isValid: false,
      code: cleanedCode,
      error: `Syntax error in generated code: ${syntaxCheck.message}.`
    };
  }

  return {
    isValid: true,
    code: cleanedCode,
    error: null
  };
}
