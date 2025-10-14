# Services

Business logic and service layer modules.

## Directory Structure

```
services/
├── code-generator/          # Code generation for API endpoints
│   ├── index.js            # Main generator entry point
│   ├── get-generator.js    # GET request code generation
│   ├── mutation-generator.js # POST/PUT/PATCH/DELETE generation
│   └── pagination-generator.js # Paginated GET with infinite scroll
├── preview/                 # Preview iframe component builders
│   ├── index.js            # Preview components exports
│   ├── ui-components.js    # Basic UI components (Layout, Input, etc.)
│   └── data-components.js  # Data display components (DataDisplay, etc.)
├── preview-template.js      # HTML template generation for iframe
├── transpilation-service.js # JSX transpilation and error handling
└── openapi-parser.js        # OpenAPI v3 specification parser
```

## Code Generator

**Location**: `services/code-generator/`

Generates React component code for API endpoints based on OpenAPI specifications.

### Architecture

1. **Main Entry** (`index.js`): Routes to appropriate generator based on HTTP method
2. **GET Generator**: Handles simple, parameterized, and paginated GET requests
3. **Mutation Generator**: Handles POST/PUT/PATCH/DELETE with or without body
4. **Pagination Generator**: Special handling for infinite scroll pagination

### Usage

```js
import { generateStarterCode } from './services/code-generator/index.js';

const code = generateStarterCode(endpoint, baseUrl, bearerToken);
```

---

## Preview System

**Location**: `services/preview/` and `services/preview-template.js`

Generates iframe preview environments with APIExplorer utilities.

### Components

#### UI Components (`ui-components.js`)
- **Layout**: Wrapper with loading state
- **Params**: Collapsible parameter section
- **Input/Textarea**: Form inputs
- **ErrorDisplay**: Error message display
- **Toolbar**: Metadata display from response

#### Data Components (`data-components.js`)
- **DataDisplay**: Recursive data renderer with smart formatting
- **NestedDataCell**: Clickable cell with popover for nested data
- **Response**: Simple DataDisplay wrapper
- **PaginatedResponse**: Infinite scroll support

### Preview Template (`preview-template.js`)

Generates complete HTML documents for iframe preview with:
- React/ReactDOM imports via CDN
- APIExplorer utilities injected as window global
- Tailwind CSS for styling
- Pre-transpiled user code

---

## Transpilation Service

**Location**: `services/transpilation-service.js`

Handles JSX-to-JS transpilation and preview rendering logic.

### Key Functions

- `processCodeForPreview()` - Main entry point, processes code for iframe
- `transpileCode()` - Babel transpilation with error handling
- `isReactComponent()` - Detect if code is a React component
- `extractFunctionName()` - Extract function name from code
- `generateReactRenderCode()` - Generate React render logic
- `generateFunctionDisplayCode()` - Generate non-React function display
- `generateErrorDisplayCode()` - Generate error UI

### Usage

```js
import { processCodeForPreview } from './services/transpilation-service.js';

const { transpiledCode, renderCode } = processCodeForPreview(userCode);
```

---

## OpenAPI Parser

**Location**: `services/openapi-parser.js`

Parses OpenAPI v3 specifications into internal endpoint format.

### Features

- Extracts endpoints from paths
- Parses parameters (path, query, header)
- Handles request bodies with schemas
- Generates bearer token auth headers
- Creates unique endpoint IDs

### Usage

```js
import { parseOpenAPISpec } from './services/openapi-parser.js';

const endpoints = parseOpenAPISpec(spec, bearerToken);
```

---

## Best Practices

1. **Service Isolation**: Services should not directly depend on React components
2. **Pure Functions**: Prefer pure functions that return values over side effects
3. **Error Handling**: Always handle and return errors gracefully
4. **Documentation**: Export functions should have JSDoc comments
5. **Testability**: Design services to be easily testable in isolation
