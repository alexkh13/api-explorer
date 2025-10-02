# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based React coding challenge application that runs entirely in the browser with **no build step**. It uses Babel Standalone for JSX transpilation at runtime.

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
constants.js        - Plain JS: challenge data, AI_PROVIDERS config, runTests utility
utils.js            - Plain JS: utility functions (debounce)
icons.jsx           - JSX module: SVG icon components, attaches to window.Icons
contexts.jsx        - JSX module: React contexts (Theme, Challenge, AI, Toast), attaches to window.AppContexts
components.jsx      - JSX module: All UI components, attaches to window.AppComponents
app.jsx             - JSX module: Main App component, waits for dependencies, renders to DOM
```

### Data Flow

1. **State Management**: React Context API with multiple providers:
   - `ThemeProvider` - Dark/light mode based on system preference
   - `ChallengeProvider` - Challenge state, code storage, localStorage persistence
   - `AIProvider` - AI configuration, API calls for code generation
   - `ToastProvider` - Toast notifications

2. **Code Persistence**: All challenge code and state saved to `localStorage` with debounced writes

3. **Live Preview**: Uses `<iframe>` with `srcdoc` to sandbox and execute user code safely

### AI Integration

The app supports multiple AI providers (OpenAI, Anthropic) for code generation:
- Configuration stored in `constants.js` under `AI_PROVIDERS`
- Each provider has custom request format, headers, and response extraction
- Browser compatibility validation prevents Node.js-specific code

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

**When adding new JSX files:**
- Add to `index.html` as `<script type="text/babel" data-type="module" src="./yourfile.jsx"></script>`
- Place **before** `app.jsx` in loading order
- Export to `window` namespace

**When modifying contexts:**
- All contexts are in `contexts.jsx`
- Custom hooks (useTheme, useChallenges, useAI, useToast) exported via `window.AppContexts`

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

### CodeMirror Integration

CodeMirror 5 is used for the code editor:
- Loaded via CDN in `index.html`
- Initialized in `CodeEditor` component with JSX mode
- Theme switches between default/dracula based on system dark mode

## Testing Challenges

The test runner is in `constants.js` as `window.runTests()`:
- Extracts function name from starter code
- Executes user code with `new Function()`
- Runs test cases and compares output
- Returns success/failure with details
