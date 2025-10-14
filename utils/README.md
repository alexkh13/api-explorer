# Utilities

Shared utility functions and helpers used across the application.

## Modules

### `code-generation-helpers.js`
**Purpose**: Reusable patterns for code generation across all endpoint generators.

**Key Functions**:
- `generateStateDeclarations()` - Create useState declarations
- `generateParamInputs()` - Generate parameter input fields
- `buildFetchChain()` - Build standard fetch-then-catch chains
- `buildStandardState()` - Standard component state (data, loading)
- `buildUrlConstruction()` - URL construction with path/query params
- `buildFunctionWrapper()` - Complete function wrapper
- `generateFormField()` - Form field based on property type

**Usage**: Import specific helpers in code generator files.

---

### `code-templates.js`
**Purpose**: Shared templates and constants for code generation.

**Key Exports**:
- `IMPORTS` - Standard import statement for APIExplorer utilities
- `generateFetchOptions()` - Generate fetch options with auth
- `capitalize()` - String capitalization utility
- `detectPaginationPattern()` - Detect pagination parameters
- `generateFunctionName()` - Safe function name from method/path

---

### `react-element-helpers.js`
**Purpose**: Factory functions for building React.createElement calls.

**Key Functions**:
- `el()` - Create element with className
- `div()`, `span()`, `button()` - Common element shortcuts
- `component()` - Create component element
- `conditional()` - Ternary rendering
- `when()` - Logical AND rendering
- `mapElements()` - Array mapping

**Usage**: Primarily for code generation where React.createElement strings are needed.

---

### `storage.js`
**Purpose**: localStorage abstraction with JSON serialization.

**Key Functions**:
- `getLocalStorage(key, defaultValue)` - Get parsed JSON
- `setLocalStorage(key, value)` - Store serialized JSON
- `getLocalStorageString(key, defaultValue)` - Get string value
- `setLocalStorageString(key, value)` - Store string value

**Usage**: Use in contexts and components that need persistent state.

---

### `http-methods.js`
**Purpose**: HTTP method definitions and utilities.

**Exports**:
- `HTTP_METHODS` - Standard HTTP method constants
- Method classification helpers

---

### `utils.js`
**Purpose**: General-purpose utility functions.

**Key Functions**:
- `debounce()` - Debounce function execution
- Other misc utilities

---

## Best Practices

1. **Import only what you need**: Use named imports to keep bundle size small
2. **Prefer helpers over duplication**: If writing similar code twice, extract to helper
3. **Document new utilities**: Add JSDoc comments for all exported functions
4. **Keep utilities pure**: Avoid side effects when possible
5. **Test in isolation**: Utilities should be testable independently
