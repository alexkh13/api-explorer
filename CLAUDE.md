# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based **API Explorer** application that runs entirely in the browser with **no build step**. It uses Babel Standalone for JSX transpilation at runtime. The app allows users to explore API endpoints, load OpenAPI v3 specifications, and generate interactive React components for testing API calls.

## Architecture

### No-Build Browser Setup

This application uses a unique architecture designed to work without any build tools:

- **Babel Standalone**: JSX files are transpiled at runtime in the browser
- **Import Maps**: React and ReactDOM are loaded via CDN using ES module import maps
- **Global Window Object**: Components and utilities attach to `window` to share between modules
- **ESM Imports**: All JSX files use ES module imports for React

### Critical Loading Pattern

**IMPORTANT**: The file loading order in `index.html` is critical and must be maintained:

1. **Plain JS files** (`utils.js`, `constants.js`) - Load first, no Babel needed
2. **JSX files** (`icons.jsx`, `contexts.jsx`, `components.jsx`) - Load with `type="text/babel" data-type="module"`
3. **Main app** (`app.jsx`) - Loads last, waits for all dependencies

### Nested Import Limitation

**Critical caveat**: Due to Babel Standalone limitations:
- Files imported inside already imported files can **only be plain JS**, not JSX
- Relative JSX imports will **not work** because Babel won't automatically transpile them
- Solution: All JSX files must be loaded as `<script>` tags in `index.html` with proper Babel attributes
- Components communicate via `window` object, not direct imports

### File Structure and Responsibilities

```
index.html          - Main HTML, loads all scripts in correct order
styles.css          - All CSS styles with CSS variables for theming
constants.js        - Plain JS: endpoint data, OpenAPI parser, AI_PROVIDERS config
utils.js            - Plain JS: utility functions (debounce)
icons.jsx           - JSX module: SVG icon components, attaches to window.Icons
contexts.jsx        - JSX module: React contexts (Theme, Endpoint, AI, Toast), attaches to window.AppContexts
components.jsx      - JSX module: All UI components, attaches to window.AppComponents
app.jsx             - JSX module: Main App component, waits for dependencies, renders to DOM
```

### Data Flow

1. **State Management**: React Context API with multiple providers:
   - `ThemeProvider` - Dark/light mode based on system preference
   - `EndpointProvider` - Endpoint state, code storage, localStorage persistence
   - `AIProvider` - AI configuration, API calls for code generation
   - `ToastProvider` - Toast notifications

2. **Code Persistence**: All endpoint code and state saved to `localStorage` with debounced writes (key: `apiExplorer`)

3. **Live Preview**: Uses `<iframe>` with `srcdoc` to sandbox and execute user code safely
   - **Performance Optimization**: User JSX code is pre-transpiled in the parent window using Babel before injection into iframe
   - iframe receives **plain JavaScript** (not JSX), eliminating the need to load Babel Standalone (~3MB) in every iframe
   - This provides instant preview loading while maintaining the JSX editing experience for users
   - Users write JSX in CodeMirror → Parent window transpiles → iframe executes pre-transpiled JS

### AI Integration

The app supports multiple AI providers (OpenAI, Anthropic) for code generation:
- Configuration stored in `constants.js` under `AI_PROVIDERS`
- Each provider has custom request format, headers, and response extraction
- Browser compatibility validation prevents Node.js-specific code

### OpenAPI Spec Loading

The app can load OpenAPI v3 specifications from remote URLs:
- **Parser**: `window.parseOpenAPISpec(spec, bearerToken)` in `constants.js`
- **Code Generation**: `generateStarterCode(endpoint, baseUrl, bearerToken)` creates React components for each endpoint
- **Bearer Token Support**: Optional authentication token included as `Authorization: Bearer [token]` header in generated code
- **Automatic UI Generation**:
  - GET requests: Interactive UI with parameter inputs and live data display
  - POST/PUT/PATCH: Forms based on request body schema with submit buttons
  - DELETE: Simple button to trigger the request
- All generated code uses React hooks (useState, useEffect) and Promise chains (no async functions at component level)

## Development

### Running the Application

Simply open `index.html` in a web browser. No build step, no dev server required (though a local server is recommended for proper module loading).

Using Python:
```bash
python3 -m http.server 8000
```

Using Node:
```bash
npx serve
```

Then open `http://localhost:8000`

### Making Changes

**When modifying JSX files:**
- Always include `import React from "react"` at the top
- Export components/utilities to `window` object for cross-file access
- Never try to import JSX from another JSX file - use `window` instead
- **IMPORTANT**: Never use `async function` for React components - they return Promises which React cannot render
- Use regular `function` with React hooks (useState, useEffect) and Promise chains (.then/.catch)

**When adding new JSX files:**
- Add to `index.html` as `<script type="text/babel" data-type="module" src="./yourfile.jsx"></script>`
- Place **before** `app.jsx` in loading order
- Export to `window` namespace

**When modifying contexts:**
- All contexts are in `contexts.jsx`
- Custom hooks (useTheme, useEndpoints, useAI, useToast) exported via `window.AppContexts`

**When adding new components:**
- Add to `components.jsx`
- Export via `window.AppComponents`

### Key Constraints

This is a **pure browser environment**:
- No Node.js APIs (`fs`, `path`, `process.env`, etc.)
- No npm packages except those via CDN/import maps
- No build tools, no bundlers, no transpilation except Babel Standalone
- No server-side code or file system operations
- All imports must resolve via import maps or be available on window
- **No async functions for React components** - use regular functions with hooks and Promise chains

### CodeMirror Integration

CodeMirror 5 is used for the code editor:
- Loaded via CDN in `index.html`
- Initialized in `CodeEditor` component with JSX mode
- Theme switches between default/dracula based on system dark mode

### Preview Performance Architecture

**Critical optimization**: The iframe preview system uses a two-stage transpilation approach:

1. **Main App (Parent Window)**:
   - Loads Babel Standalone once at startup
   - User writes JSX in CodeMirror editor
   - When rendering preview, parent window transpiles JSX → JavaScript using `window.Babel.transform()`

2. **Preview iframe**:
   - Does NOT load Babel Standalone (saves ~3MB + initialization time)
   - Only loads React runtime via import maps (cached after first load)
   - Receives pre-transpiled plain JavaScript
   - Executes immediately without transpilation overhead

**Why this matters**:
- Original approach: iframe loaded 3MB Babel + initialized + transpiled on every preview render = slow
- Optimized approach: Parent transpiles once, iframe executes pre-compiled code = fast
- User experience unchanged: still writes JSX, gets instant feedback
- Simulates a "Vite dev server" experience entirely in the browser

**Implementation**: See `Preview` component in `components.jsx`, specifically the `renderPreview()` function at lines 545-735

## Endpoint Management

### Default Endpoints

Three sample endpoints are provided in `constants.js` under `initialEndpointsData`:
1. GET /users - Fetch list of users from JSONPlaceholder API
2. GET /posts/:id - Fetch specific post with parameter input
3. POST /posts - Create new post with form inputs

### Loading OpenAPI Specs

Users can load endpoints from an OpenAPI v3 JSON specification:
1. Click the "Load Spec" button (FAB with code icon)
2. Enter the URL of the OpenAPI spec
3. Optionally provide a bearer token for authentication
4. The app parses the spec and generates interactive React components for each endpoint

### Code Generation

The `generateStarterCode()` function in `constants.js` automatically creates:
- State management with React hooks
- Fetch calls with proper headers (including bearer token if provided)
- Loading states and error handling
- Input forms for parameters and request bodies
- Response display with JSON formatting
