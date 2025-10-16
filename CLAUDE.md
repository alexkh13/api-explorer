# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based **API Explorer** application that runs entirely in the browser with **no build step**. It uses Babel Standalone for JSX transpilation at runtime. The app allows users to explore API endpoints, load OpenAPI v3 specifications, and generate interactive React components for testing API calls.

## Architecture

### No-Build Browser Setup

This application uses a unique architecture designed to work without any build tools:

- **Service Worker**: Intercepts .jsx file requests and transpiles them on-the-fly using Babel Standalone
- **Import Maps**: React and ReactDOM are loaded via CDN using ES module import maps
- **ES6 Modules**: All files use standard ES6 import/export syntax
- **No Window Globals**: Components and utilities communicate via ES6 imports (no `window` object usage except for external libraries like Babel)

### Module Loading Pattern

The application uses a **service worker** to enable JSX transpilation for ES6 modules:

1. **Service Worker Registration**: `sw.js` intercepts all `.jsx` file requests
2. **On-the-Fly Transpilation**: Service worker uses Babel Standalone to transpile JSX → JS
3. **ES6 Module Graph**: All modules load via standard `import` statements
4. **Entry Point**: `app.jsx` is loaded dynamically after service worker is ready

**Benefits**:
- Standard ES6 module imports work seamlessly
- No need for `window` global pollution
- Proper dependency graph and tree-shaking ready
- JSX files can import other JSX files naturally

### File Structure and Responsibilities

```
index.html                      - Main HTML, registers service worker, loads app.jsx entry point
preview.html                    - Preview iframe HTML, receives code via postMessage
theme.css                       - All CSS styles with CSS variables for theming
sw.js                           - Service worker for JSX transpilation
app.jsx                         - Main App component entry point, renders to DOM

components/                     - React UI components (modular structure)
  ├── index.jsx                 - Component exports
  ├── Dialog.jsx                - Modal dialog component
  ├── Header.jsx                - App header with actions
  ├── Sidebar.jsx               - Endpoint list sidebar
  ├── Preview.jsx               - Code preview iframe container
  └── ...                       - Other UI components

contexts/                       - React Context providers (modular structure)
  ├── index.jsx                 - Context exports
  ├── ThemeContext.jsx          - Dark/light mode context
  ├── EndpointContext.jsx       - Endpoint state management
  ├── AIContext.jsx             - AI provider configuration
  └── ToastContext.jsx          - Toast notifications

services/                       - Business logic and service layer
  ├── README.md                 - Service architecture documentation
  ├── code-generator/           - API endpoint code generation
  │   ├── index.js              - Main generator entry
  │   ├── get-generator.js      - GET request code generation
  │   ├── mutation-generator.js - POST/PUT/PATCH/DELETE generation
  │   └── pagination-generator.js - Paginated GET with infinite scroll
  ├── preview/                  - Preview iframe utilities
  │   ├── api-explorer-utils.jsx - Shared utility components (Layout, Response, Input, etc.)
  │   ├── ui-components.js      - UI component code generators (legacy)
  │   └── data-components.js    - Data component code generators (legacy)
  ├── preview-template.js       - HTML template generation for iframe with runtime transpilation
  └── openapi-parser.js         - OpenAPI v3 specification parser

utils/                          - Shared utility functions
  ├── README.md                 - Utilities documentation
  ├── code-generation-helpers.js - Reusable code generation patterns
  ├── code-templates.js         - Code generation templates and constants
  ├── react-element-helpers.js  - React.createElement factory functions
  ├── storage.js                - localStorage abstraction layer
  ├── http-methods.js           - HTTP method definitions
  └── utils.js                  - General utilities (debounce, etc.)

data/                           - Static data and configuration
  ├── initial-endpoints.js      - Demo endpoint definitions

config/                         - App configuration
  ├── ai-providers.js           - AI provider configurations
  └── ai-prompts.js             - AI system prompts

icons/                          - SVG icon components
  └── index.jsx                 - Icon exports
```

### Data Flow

1. **State Management**: React Context API with multiple providers:
   - `ThemeProvider` - Dark/light mode based on system preference
   - `EndpointProvider` - Endpoint state, code storage, localStorage persistence
   - `AIProvider` - AI configuration, API calls for code generation
   - `ToastProvider` - Toast notifications

2. **Code Persistence**: All endpoint code and state saved to `localStorage` with debounced writes (key: `apiExplorer`)

3. **Live Preview**: Uses `<iframe>` loading `/preview.html` to sandbox and execute user code safely
   - **Runtime Transpilation**: Babel Standalone transpiles JSX directly in the iframe using `type="text/babel"` script tags
   - **ES6 Module Support**: Generated code uses standard ES6 imports for utilities and React
   - **Service Worker Integration**: All `.jsx` imports in iframe are transpiled by the service worker
   - **PostMessage Communication**: Parent sends code to iframe via postMessage for security and proper origin handling
   - **Same-Origin Access**: iframe loads actual HTML file (not srcdoc) so service worker can intercept module requests
   - Users write JSX in CodeMirror → Raw JSX sent via postMessage → Babel transpiles → Service worker handles imports

### AI Integration

The app supports multiple AI providers (OpenAI, Anthropic) for code generation:
- Configuration stored in `constants.js` under `AI_PROVIDERS`
- Each provider has custom request format, headers, and response extraction
- Browser compatibility validation prevents Node.js-specific code

### OpenAPI Spec Loading

The app can load OpenAPI v3 specifications from remote URLs:
- **Parser**: `parseOpenAPISpec(spec, bearerToken)` exported from `constants.js`
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
- Use standard ES6 `export` statements (named or default)
- Import from other modules using standard ES6 `import` syntax
- **IMPORTANT**: Never use `async function` for React components - they return Promises which React cannot render
- Use regular `function` with React hooks (useState, useEffect) and Promise chains (.then/.catch)

**When adding new modules:**
- Create the file with appropriate extension (`.js` for plain JS, `.jsx` for JSX)
- Export using standard ES6 syntax: `export function foo() {}` or `export const bar = ...`
- Import where needed: `import { foo, bar } from "./module.js"`
- Service worker will automatically transpile `.jsx` files

**When modifying contexts:**
- All contexts are in `contexts.js`
- Import contexts and hooks: `import { useTheme, useEndpoints, useAI, useToast } from "./contexts.js"`

**When adding new components:**
- Add to `components.js` or create a new component file in `components/` directory
- Export using ES6 syntax
- Import where needed: `import { ComponentName } from "./components.js"`

### Key Constraints

This is a **pure browser environment**:
- No Node.js APIs (`fs`, `path`, `process.env`, etc.)
- No npm packages except those via CDN/import maps
- No build tools, no bundlers, no pre-transpilation (service worker handles JSX at runtime)
- No server-side code or file system operations
- All imports must resolve via import maps or be relative paths to local modules
- **No async functions for React components** - use regular functions with hooks and Promise chains
- External libraries (Babel) are accessed via `window.Babel`, but app code uses ES6 modules

### CodeMirror Integration

CodeMirror 5 is used for the code editor:
- Loaded via CDN in `index.html`
- Initialized in `CodeEditor` component with JSX mode
- Theme switches between default/dracula based on system dark mode

### Preview Runtime Architecture

**ES6 Module System with Runtime Transpilation**:

The iframe preview system leverages Babel Standalone with ES6 imports for a true module-based development experience:

1. **Preview iframe**:
   - Loads Babel Standalone (~3MB, but cached across page loads)
   - Uses `<script type="text/babel" data-type="module">` for automatic JSX transpilation
   - Supports standard ES6 `import` statements in user code
   - Imports resolve via service worker (`.jsx` files) or import maps (React, ReactDOM)

2. **Generated Code Structure**:
   ```jsx
   import React, { useState, useEffect } from 'react';
   import ReactDOM from 'react-dom';
   import { Layout, Response, Input } from '/services/preview/api-explorer-utils.jsx';

   function MyComponent() {
     return <Layout><Response data={data} /></Layout>;
   }

   ReactDOM.render(<MyComponent />, document.getElementById('root'));
   ```

3. **Module Resolution**:
   - React/ReactDOM: Loaded from CDN via import maps
   - `api-explorer-utils.jsx`: Loaded from `/services/preview/api-explorer-utils.jsx`
   - Service worker intercepts `.jsx` requests and transpiles them on-the-fly
   - iframe has `sandbox="allow-scripts allow-same-origin"` to access parent origin resources

**Benefits**:
- True ES6 module support in generated code
- Standard import/export syntax everywhere
- Service worker handles all `.jsx` transpilation consistently
- Easy to extend with new utility modules
- Simulates modern development workflow entirely in browser

**Implementation**:
- `preview.html` - Static HTML file loaded by iframe with Babel + import maps
- `Preview` component (`components/Preview.jsx`) - Sends raw JSX to iframe via postMessage
- `api-explorer-utils.jsx` - Exportable utility components for generated code
- Service worker (`sw.js`) - Transpiles all `.jsx` imports in iframe

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

The code generation system (`services/code-generator/`) automatically creates:
- State management with React hooks
- Fetch calls with proper headers (including bearer token if provided)
- Loading states and error handling
- Input forms for parameters and request bodies
- Response display with JSON formatting
- Special handling for paginated endpoints with infinite scroll

**Architecture**:
- Modular generators for different HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Shared utilities in `utils/code-generation-helpers.js` for DRY code
- Template constants in `utils/code-templates.js`
- Main entry: `generateStarterCode()` from `services/code-generator/index.js`
