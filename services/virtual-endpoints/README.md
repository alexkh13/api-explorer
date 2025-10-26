# Virtual Endpoints

Transform and combine API endpoints using pure JavaScript - no build step required.

## What Are Virtual Endpoints?

Virtual endpoints are **user-defined API transformations** that run entirely in the browser. Think of them as:

- **API middleware** - Transform requests/responses on the fly
- **Data combiners** - Merge multiple endpoints into one unified response
- **Business logic layer** - Add computed fields, statistics, filtering
- **API fork** - Create your own version of any API without owning it

All powered by **pure JavaScript** with a rich utility library.

---

## Quick Start

### 1. Create a Virtual Endpoint

Click the "New" button in the sidebar:

```javascript
async function virtualEndpoint(context) {
  const { input, get, utils } = context;

  // Call existing endpoint
  const users = await get('get-users', {});

  // Transform response
  return users.map(user =>
    utils.pick(user, ['id', 'name', 'email'])
  );
}
```

### 2. Use the Context API

Full access to:
- **Input data**: `context.input` (params, query, body, headers)
- **Endpoint calls**: `get()`, `post()`, `parallel()`, `fetch()`
- **40+ utilities**: `pick()`, `sortBy()`, `groupBy()`, `sum()`, etc.
- **Metadata**: `context.meta` (available endpoints, timestamps)

### 3. Test & Deploy

- **Test tab**: Execute with sample input
- **Live preview**: See generated React component
- **Persistent**: Saved to localStorage automatically

---

## Architecture

### Core Components

```
services/virtual-endpoints/
├── executor.js           # VirtualEndpointExecutor - runs user code
├── code-generator.js     # Generates React components for preview
├── templates.js          # 13+ pre-built patterns
├── index.js              # Public API & validators
└── CONTEXT_API_REFERENCE.md  # Full context documentation

utils/
└── transformation-helpers.js  # 40+ utility functions

contexts/
└── EndpointContext.jsx   # State management (create/update/delete)

components/
├── VirtualEndpointDialog.jsx  # Create/edit UI
├── Sidebar.jsx           # Filter & navigation
└── EndpointItem.jsx      # Edit/delete menu
```

### Data Flow

```
User writes JS function
        ↓
Dialog validates syntax
        ↓
Save to EndpointContext
        ↓
Persist to localStorage
        ↓
Generate React code
        ↓
Render in preview iframe
        ↓
Execute on button click
        ↓
Display results
```

### Execution Flow

```javascript
VirtualEndpointExecutor.execute(input)
├── Build context object
│   ├── input: { params, query, body, headers }
│   ├── get/post/put/delete/parallel/fetch
│   ├── utils: { pick, sortBy, groupBy, ... }
│   └── meta: { endpointId, name, endpoints }
├── Run user function with context
│   └── executeWithTimeout(10s)
├── Return result
    ├── success: true/false
    ├── data: transformed output
    └── error: error message if failed
```

---

## Key Features

### ✅ Pure JavaScript Functions

No complex interfaces - just write JavaScript:

```javascript
async function virtualEndpoint(context) {
  // Access input
  const userId = context.input.params.id;

  // Call endpoints
  const user = await context.get('get-user', { params: { id: userId } });

  // Transform data
  return { ...user, fullName: `${user.firstName} ${user.lastName}` };
}
```

### ✅ Rich Context API

Everything you need:
- **40+ utilities** for data manipulation
- **Call any loaded endpoint** by ID
- **Parallel execution** for speed
- **External API calls** via fetch
- **Metadata access** for introspection

### ✅ 13+ Templates

Pre-built patterns:
- Transform Single Endpoint
- Combine Multiple Endpoints
- Pagination Wrapper
- Data Enrichment
- Filter & Sort
- Aggregate Statistics
- Error Handling
- And more...

### ✅ Live Validation

- Syntax checking as you type
- Error messages in red
- Success indicators
- Template selector

### ✅ Test Before Deploy

- Test tab with input editor
- Execute with sample data
- See results immediately
- Debug with console logs

### ✅ Seamless Integration

- Works with OpenAPI loaded endpoints
- Persists to localStorage
- Filter by Real/Virtual in sidebar
- Edit/delete with context menu
- Preview like any endpoint

---

## Use Cases

### 1. Data Transformation

**Problem**: API returns too many fields, want only id, name, email

**Solution**:
```javascript
async function virtualEndpoint(context) {
  const users = await context.get('get-users', {});
  return users.map(u => context.utils.pick(u, ['id', 'name', 'email']));
}
```

### 2. Combine Endpoints

**Problem**: Need user + their posts in one call

**Solution**:
```javascript
async function virtualEndpoint(context) {
  const [user, posts] = await context.parallel(
    { endpointId: 'get-user', options: { params: { id: '1' } } },
    { endpointId: 'get-posts', options: { query: { userId: '1' } } }
  );
  return { ...user, posts };
}
```

### 3. Add Statistics

**Problem**: Want total revenue, average order value from orders API

**Solution**:
```javascript
async function virtualEndpoint(context) {
  const orders = await context.get('get-orders', {});
  return {
    total: context.utils.sum(orders, 'total'),
    avg: context.utils.avg(orders, 'total'),
    count: orders.length
  };
}
```

### 4. Enrich with External Data

**Problem**: Want to add weather data to user profile

**Solution**:
```javascript
async function virtualEndpoint(context) {
  const user = await context.get('get-user', { params: { id: '1' } });
  const weather = await context.fetch(
    `https://api.weather.com/current?city=${user.city}`
  );
  return { ...user, weather };
}
```

### 5. Field Renaming

**Problem**: API uses snake_case, want camelCase

**Solution**:
```javascript
async function virtualEndpoint(context) {
  const data = await context.get('legacy-api', {});
  return context.utils.renameKeys(data, {
    user_name: 'userName',
    created_at: 'createdAt'
  });
}
```

---

## API Reference

### Context Object

```javascript
context = {
  // Input from request
  input: { params, query, body, headers },

  // Endpoint calling methods
  get: async (endpointId, options) => {},
  post: async (endpointId, options) => {},
  put: async (endpointId, options) => {},
  delete: async (endpointId, options) => {},
  parallel: async (...calls) => {},
  fetch: async (url, options) => {},

  // Utility functions
  utils: {
    // Object: pick, omit, merge, mapKeys, mapValues, renameKeys, get, set
    // Array: groupBy, sortBy, uniqBy, flatten, chunk, partition
    // String: camelCase, snakeCase, kebabCase, capitalize, slugify
    // Date: formatDate, parseDate, addDays, diffDays, isToday, isAfter
    // Math: sum, avg, min, max, round
    // Validation: isEmail, isUrl, isEmpty, isNumeric
  },

  // Metadata
  meta: { endpointId, name, timestamp, endpoints }
}
```

See [CONTEXT_API_REFERENCE.md](./CONTEXT_API_REFERENCE.md) for full details.

---

## Implementation Details

### Code Generation

Virtual endpoints are **compiled to React components**:

1. User writes function: `async function virtualEndpoint(context) { ... }`
2. Code generator wraps it with:
   - React state hooks
   - Input field components
   - Context builder with utilities
   - Endpoint calling logic
   - Error handling
3. Resulting component rendered in preview iframe
4. User clicks "Execute" → function runs → results displayed

### Execution Engine

`VirtualEndpointExecutor` class:
- Builds context with all utilities
- Wraps user code in try/catch
- Enforces 10s timeout
- Calls real endpoints by ID
- Returns `{ success, data, error }`

### Storage

- Virtual endpoints stored in `endpoints` array
- Each has `type: 'virtual'`
- Persisted to localStorage via `EndpointContext`
- Survives page refresh
- Can be edited/deleted anytime

### Security

- No `eval()` used - Function constructor only
- No access to DOM/localStorage from user code
- Timeout prevents infinite loops
- CORS still applies to external fetch calls
- Sandbox via iframe (future enhancement)

---

## Limitations

### Current Limitations

1. **10 second timeout** - Long operations will fail
2. **Browser only** - No Node.js APIs (fs, path, process)
3. **No dynamic imports** - All code must be inline
4. **CORS applies** - External APIs must allow browser access
5. **No streaming** - Responses must fit in memory

### Future Enhancements

- [ ] Monaco editor with autocomplete
- [ ] TypeScript support
- [ ] Response caching with TTL
- [ ] Rate limiting
- [ ] Import/export virtual endpoints as JSON
- [ ] Visual flow builder (drag & drop)
- [ ] Debugging tools & breakpoints
- [ ] Performance metrics & profiling
- [ ] Webhook support
- [ ] Scheduled execution
- [ ] Mock mode (return fake data)

---

## Troubleshooting

### "Endpoint not found" error

**Cause**: Using wrong endpoint ID
**Fix**: Check `context.meta.endpoints` for available IDs

### Execution timeout

**Cause**: Code taking >10s
**Fix**: Optimize logic, use parallel calls, reduce data size

### Syntax error

**Cause**: Invalid JavaScript
**Fix**: Check red validation errors, use templates

### CORS error on external fetch

**Cause**: API doesn't allow browser requests
**Fix**: Use server-side proxy or API with CORS enabled

### Utilities not working

**Cause**: Typo in utility name
**Fix**: Check `context.utils` keys, see CONTEXT_API_REFERENCE.md

---

## Examples

See `templates.js` for 13 complete examples including:

- **transformSingle**: Filter fields from response
- **combineTwo**: Merge two endpoints
- **sequentialCalls**: Use first result in second call
- **filterTransform**: Filter and sort arrays
- **pagination**: Add pagination metadata
- **renameFields**: Convert naming conventions
- **aggregateStats**: Calculate statistics
- **externalApi**: Enrich with external data
- **conditionalLogic**: Different logic based on input
- **errorHandling**: Graceful fallbacks
- **combineMultiple**: 3+ endpoints in parallel
- **dataEnrichment**: Add computed fields

---

## Contributing

To extend virtual endpoints:

1. **Add utilities**: Edit `utils/transformation-helpers.js`
2. **Add templates**: Edit `services/virtual-endpoints/templates.js`
3. **Enhance UI**: Edit `components/VirtualEndpointDialog.jsx`
4. **Improve validation**: Edit `services/virtual-endpoints/index.js`

All changes automatically available to users - no build step!

---

## Testing

See [VIRTUAL_ENDPOINTS_TESTING.md](../../VIRTUAL_ENDPOINTS_TESTING.md) for:
- Complete testing guide
- Test scenarios
- Success indicators
- Known issues

---

## Philosophy

Virtual endpoints embody the principle of **maximum flexibility with minimal constraints**:

- ✅ Pure JavaScript - no DSL, no config files, no abstractions
- ✅ Direct code execution - Function constructor, not eval
- ✅ Browser-native - leverage Web APIs, no server required
- ✅ Composable - combine, nest, chain however you want
- ✅ Inspectable - see generated code, debug with console
- ✅ Fail-safe - timeout protection, error boundaries

**Bottom line**: If you can write JavaScript, you can create virtual endpoints.

---

## License

Same as parent project.
