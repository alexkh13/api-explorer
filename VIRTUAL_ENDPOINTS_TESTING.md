# Virtual Endpoints - Testing Guide

## Overview

Virtual Endpoints is a powerful new feature that allows users to create custom "virtual" API endpoints that can:
- Transform responses from existing endpoints
- Combine multiple endpoints into one
- Add computed fields and statistics
- Filter and reshape data
- Call external APIs
- Implement custom business logic using JavaScript

## What Was Built

### Core Infrastructure

1. **Transformation Utilities** (`utils/transformation-helpers.js`)
   - 40+ utility functions for data manipulation
   - Object utilities: pick, omit, merge, mapKeys, mapValues, renameKeys, get, set
   - Array utilities: groupBy, sortBy, uniqBy, flatten, chunk
   - String utilities: camelCase, snakeCase, capitalize, slugify
   - Date utilities: formatDate, addDays, diffDays
   - Math utilities: sum, avg, min, max, round

2. **Execution Engine** (`services/virtual-endpoints/executor.js`)
   - VirtualEndpointExecutor class
   - Context builder with access to all utilities
   - Endpoint calling methods (get, post, put, delete, parallel)
   - Timeout protection
   - Error handling

3. **Code Generator** (`services/virtual-endpoints/code-generator.js`)
   - Generates React components for virtual endpoints
   - Injects user's function code
   - Provides context with all utilities
   - Handles path parameters, query params, and body

4. **Templates** (`services/virtual-endpoints/templates.js`)
   - 13 pre-built templates for common patterns:
     - Transform Single Endpoint
     - Combine Two Endpoints
     - Sequential Calls
     - Filter & Transform
     - Pagination Wrapper
     - Rename Fields
     - Aggregate Statistics
     - Call External API
     - Conditional Logic
     - Error Handling
     - Combine Multiple Endpoints
     - Data Enrichment

5. **State Management** (Extended `EndpointContext.jsx`)
   - createVirtualEndpoint()
   - updateVirtualEndpoint()
   - deleteVirtualEndpoint()
   - getVirtualEndpoints()
   - getRealEndpoints()

### UI Components

1. **VirtualEndpointDialog** (`components/VirtualEndpointDialog.jsx`)
   - Create/edit dialog with tabs
   - Code editor with template selector
   - Live validation
   - Test tab with execution preview
   - Input for test data (params, query, body)

2. **Sidebar Integration** (`components/Sidebar.jsx`)
   - Filter tabs: All | Real | Virtual
   - "New" button to create virtual endpoints
   - Count badges for each category

3. **EndpointItem Enhancement** (`components/EndpointItem.jsx`)
   - Context menu for virtual endpoints (⋮)
   - Edit and Delete actions
   - Inline edit dialog

## How to Test

### Basic Flow

1. **Navigate to the app**
   - Open http://localhost:3000 in your browser

2. **Create Your First Virtual Endpoint**
   - Click the "New" button in the sidebar (top right, next to "Endpoints")
   - Fill in the form:
     - Name: "Test Virtual Endpoint"
     - Method: GET
     - Path: /virtual/test
     - Description: "My first virtual endpoint"
   - The code editor will have a blank template loaded
   - Click "Create"

3. **View Virtual Endpoints**
   - Click the "Virtual" tab in the sidebar to filter
   - You should see your new virtual endpoint
   - Click it to select and view the generated code

### Test Scenarios

#### Scenario 1: Transform Single Endpoint

**Goal**: Create a virtual endpoint that fetches users and returns only id, name, email

1. Click "New" in sidebar
2. Set name: "Users (Filtered)"
3. Load template: "Transform Single Endpoint"
4. Modify the code:
   ```javascript
   async function virtualEndpoint(context) {
     const { get, utils } = context;

     const users = await get('get-users', {});

     return users.map(user => utils.pick(user, ['id', 'name', 'email']));
   }
   ```
5. Click "Test" tab
6. Enter test input: `{}`
7. Click "Execute Test"
8. You should see filtered user data
9. Click "Create"
10. Select the endpoint and click "Run Code" to see it in preview

#### Scenario 2: Combine Multiple Endpoints

**Goal**: Fetch a user and their posts in parallel, then combine

1. Click "New"
2. Set name: "User with Posts"
3. Set path: "/virtual/user/:id/profile"
4. Load template: "Combine Two Endpoints"
5. Modify the code to use actual endpoint IDs:
   ```javascript
   async function virtualEndpoint(context) {
     const { input, parallel, utils } = context;
     const userId = input.params.id;

     const [user, posts] = await parallel(
       { endpointId: 'get-user-by-id', options: { params: { id: userId } } },
       { endpointId: 'get-posts', options: { query: { userId } } }
     );

     return {
       ...utils.pick(user, ['id', 'name', 'email']),
       postCount: posts.length,
       recentPosts: posts.slice(0, 5)
     };
   }
   ```
6. Test with: `{"params": {"id": "1"}}`
7. Verify the combined response
8. Create and test in preview

#### Scenario 3: Add Statistics

**Goal**: Calculate statistics from an array of data

1. Click "New"
2. Set name: "Post Statistics"
3. Load template: "Aggregate Statistics"
4. Modify for posts:
   ```javascript
   async function virtualEndpoint(context) {
     const { get, utils } = context;

     const posts = await get('get-posts', {});

     return {
       totalPosts: posts.length,
       avgTitleLength: utils.avg(posts.map(p => p.title.length)),
       avgBodyLength: utils.avg(posts.map(p => p.body.length)),
       postsByUser: utils.groupBy(posts, 'userId'),
       longestPost: posts.reduce((max, p) =>
         p.body.length > max.body.length ? p : max, posts[0]
       )
     };
   }
   ```
5. Test and verify statistics are calculated correctly

#### Scenario 4: External API Call

**Goal**: Enrich data with an external API

1. Click "New"
2. Set name: "User with GitHub Data"
3. Load template: "Call External API"
4. Example code (if you have GitHub usernames):
   ```javascript
   async function virtualEndpoint(context) {
     const { input, get, fetch } = context;

     const user = await get('get-user-by-id', {
       params: { id: input.params.id }
     });

     // Note: This will fail if user doesn't have a GitHub username
     try {
       const githubData = await fetch(
         `https://api.github.com/users/${user.username || 'octocat'}`
       );

       return {
         ...user,
         github: {
           repos: githubData.public_repos,
           followers: githubData.followers
         }
       };
     } catch (err) {
       return {
         ...user,
         github: { error: 'GitHub data not available' }
       };
     }
   }
   ```

#### Scenario 5: Edit Virtual Endpoint

1. Find a virtual endpoint in the sidebar
2. Click the three dots (⋮) next to it
3. Click "Edit"
4. Modify the code or name
5. Click "Update"
6. Verify changes are reflected

#### Scenario 6: Delete Virtual Endpoint

1. Click the three dots (⋮) next to a virtual endpoint
2. Click "Delete"
3. Confirm the deletion
4. Verify it's removed from the list

### Testing Validation

1. **Empty Code**
   - Create new virtual endpoint
   - Clear all code
   - Try to save
   - Should show error: "Code is required"

2. **Syntax Error**
   - Enter invalid JavaScript: `function test( {`
   - Should show validation error in red

3. **Valid Code**
   - Enter valid code
   - Should show green checkmark: "Code is valid"

### Testing Preview Execution

1. Create a simple virtual endpoint:
   ```javascript
   async function virtualEndpoint(context) {
     return { message: 'Hello from virtual endpoint!', timestamp: Date.now() };
   }
   ```
2. Save it
3. Select it in sidebar
4. View the generated code in the editor
5. Click "Run Code" (if preview is enabled)
6. Click "Execute Virtual Endpoint" button
7. Should see the response with message and timestamp

## What to Look For

### ✅ Success Indicators

- Virtual endpoints appear in sidebar with "Virtual" tab
- Can create, edit, and delete virtual endpoints
- Code validation works (errors/warnings shown)
- Test execution works in dialog
- Templates load correctly
- Generated code runs in preview
- Context utilities are available (utils.pick, utils.sum, etc.)
- Can call real endpoints from virtual endpoints
- Parallel endpoint calls work
- State persists to localStorage

### ❌ Potential Issues

- **"Endpoint not found" error**: Make sure you're using correct endpoint IDs from your loaded spec
- **Syntax errors**: Check JavaScript syntax in the code editor
- **Execution timeout**: Complex logic may exceed 10s timeout
- **CORS errors**: External API calls may fail due to CORS
- **Missing utilities**: Some utils might not be available in generated code

## Advanced Testing

### Context API Testing

Test all context methods are available:

```javascript
async function virtualEndpoint(context) {
  const { input, get, post, parallel, fetch, utils, meta } = context;

  // Test all are defined
  return {
    hasInput: !!input,
    hasGet: typeof get === 'function',
    hasPost: typeof post === 'function',
    hasParallel: typeof parallel === 'function',
    hasFetch: typeof fetch === 'function',
    hasUtils: !!utils,
    hasMeta: !!meta,
    utilsKeys: Object.keys(utils),
    metaEndpoints: meta.endpoints.length
  };
}
```

### Utility Functions Testing

Test specific utils work:

```javascript
async function virtualEndpoint(context) {
  const { utils } = context;

  const testData = [
    { id: 1, name: 'Alice', score: 95 },
    { id: 2, name: 'Bob', score: 87 },
    { id: 3, name: 'Alice', score: 92 }
  ];

  return {
    picked: utils.pick(testData[0], ['id', 'name']),
    sorted: utils.sortBy(testData, 'score', 'desc'),
    grouped: utils.groupBy(testData, 'name'),
    sum: utils.sum(testData, 'score'),
    avg: utils.avg(testData, 'score'),
    unique: utils.uniqBy(testData, 'name')
  };
}
```

## Known Limitations

1. **No async in function declaration**: Users must use `async function virtualEndpoint(context)` format
2. **10s timeout**: Long-running operations will timeout
3. **Browser only**: No Node.js APIs (fs, path, process)
4. **No dynamic imports**: All code must be self-contained
5. **CORS restrictions**: External API calls subject to browser CORS policy

## Feature Summary

### What Works

✅ Create virtual endpoints with custom JavaScript
✅ Full context API with utilities
✅ Template library with 13+ patterns
✅ Live validation
✅ Test execution in dialog
✅ Preview integration
✅ Edit/delete virtual endpoints
✅ Filter by type (All/Real/Virtual)
✅ localStorage persistence
✅ Parallel endpoint calls
✅ External API calls
✅ Error handling

### Future Enhancements

- Monaco/VSCode editor with autocomplete
- TypeScript support
- Response caching
- Rate limiting
- Import/export virtual endpoints
- Visual flow builder
- Debugging tools
- Performance metrics
