# Virtual Endpoint Context API Reference

Quick reference for the `context` object available in virtual endpoint functions.

## Basic Structure

```javascript
async function virtualEndpoint(context) {
  const { input, get, post, put, delete, parallel, fetch, utils, meta } = context;

  // Your code here

  return { your: 'data' };
}
```

---

## Input Data

Access request parameters, query strings, body, and headers.

```javascript
context.input = {
  params: {},   // URL parameters { id: '123' }
  query: {},    // Query string { page: 1, limit: 10 }
  body: {},     // Request body (POST/PUT/PATCH)
  headers: {}   // Request headers
}
```

**Example:**
```javascript
const userId = context.input.params.id;
const page = context.input.query.page || 1;
```

---

## Endpoint Calling

### Call Single Endpoint

```javascript
// GET request
const users = await context.get('endpoint-id', {
  params: { id: '123' },
  query: { limit: 10 },
  headers: { 'X-Custom': 'value' }
});

// POST request
const newUser = await context.post('create-user-endpoint', {
  body: { name: 'John', email: 'john@example.com' }
});

// PUT request
await context.put('update-user-endpoint', {
  params: { id: '123' },
  body: { name: 'Jane' }
});

// DELETE request
await context.delete('delete-user-endpoint', {
  params: { id: '123' }
});
```

### Call Multiple Endpoints in Parallel

```javascript
const [users, posts, comments] = await context.parallel(
  { endpointId: 'get-users', options: {} },
  { endpointId: 'get-posts', options: { query: { limit: 5 } } },
  { endpointId: 'get-comments', options: {} }
);
```

### Call External APIs

```javascript
const externalData = await context.fetch('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' }
});
```

---

## Utility Functions

All utilities are available at `context.utils`.

### Object Utilities

```javascript
// Pick specific keys
utils.pick(user, ['id', 'name', 'email'])
// → { id: 1, name: 'John', email: 'john@example.com' }

// Omit keys
utils.omit(user, ['password', 'salt'])
// → user without password and salt fields

// Merge objects
utils.merge({ a: 1 }, { b: 2 }, { c: 3 })
// → { a: 1, b: 2, c: 3 }

// Rename keys
utils.renameKeys(user, { user_name: 'userName', created_at: 'createdAt' })
// → Converts snake_case to camelCase

// Get nested value safely
utils.get(user, 'address.city', 'Unknown')
// → user.address.city or 'Unknown' if not found

// Map object keys
utils.mapKeys(obj, (key) => key.toUpperCase())

// Map object values
utils.mapValues(obj, (value) => value * 2)

// Filter object
utils.filterObject(user, (value, key) => value !== null)
```

### Array Utilities

```javascript
// Group by key
utils.groupBy(users, 'role')
// → { admin: [...], user: [...] }

// Sort by key
utils.sortBy(users, 'createdAt', 'desc')
// → Users sorted by creation date, newest first

// Unique by key
utils.uniqBy(users, 'email')
// → Remove duplicate users by email

// Flatten array
utils.flatten([[1, 2], [3, 4]], 1)
// → [1, 2, 3, 4]

// Chunk array
utils.chunk([1, 2, 3, 4, 5], 2)
// → [[1, 2], [3, 4], [5]]

// Partition array
utils.partition(users, user => user.active)
// → [[active users], [inactive users]]
```

### Math Utilities

```javascript
// Sum
utils.sum(orders, 'total')
// → Sum of all order.total values

// Average
utils.avg(orders, 'total')
// → Average order value

// Min
utils.min(orders, 'total')
// → Minimum order value

// Max
utils.max(orders, 'total')
// → Maximum order value

// Round
utils.round(3.14159, 2)
// → 3.14
```

### String Utilities

```javascript
// Convert to camelCase
utils.camelCase('user_name')
// → 'userName'

// Convert to snake_case
utils.snakeCase('userName')
// → 'user_name'

// Convert to kebab-case
utils.kebabCase('userName')
// → 'user-name'

// Capitalize
utils.capitalize('hello')
// → 'Hello'

// Slugify
utils.slugify('Hello World!')
// → 'hello-world'

// Truncate
utils.truncate('Long text here', 10)
// → 'Long te...'
```

### Date Utilities

```javascript
// Format date
utils.formatDate(new Date(), 'YYYY-MM-DD')
// → '2025-10-26'

// Parse date
utils.parseDate('2025-10-26')
// → Date object

// Add days
utils.addDays(new Date(), 7)
// → Date 7 days from now

// Difference in days
utils.diffDays(date1, date2)
// → Number of days between dates

// Check if today
utils.isToday(date)
// → true/false

// Check if after
utils.isAfter(date1, date2)
// → true if date1 > date2
```

### Validation Utilities

```javascript
utils.isEmail('test@example.com')  // → true
utils.isUrl('https://example.com')  // → true
utils.isEmpty([])                   // → true
utils.isNumeric('123')              // → true
```

### Data Transformation

```javascript
// Safe JSON parse
utils.jsonParse('{"a":1}', {})
// → { a: 1 } or {} if parse fails

// JSON stringify
utils.jsonStringify({ a: 1 }, true)
// → Pretty-printed JSON

// Base64 encode/decode
utils.base64Encode('hello')
utils.base64Decode('aGVsbG8=')

// Hash (for cache keys)
utils.hash('some-string')
// → '1a2b3c4d'
```

### HTTP Utilities

```javascript
// Build URL with params
utils.buildUrl('/users/:id', { id: '123' })
// → '/users/123'

// Parse query string
utils.parseQueryString('?page=1&limit=10')
// → { page: '1', limit: '10' }

// Build query string
utils.buildQueryString({ page: 1, limit: 10 })
// → 'page=1&limit=10'
```

---

## Metadata

Access information about the virtual endpoint and available real endpoints.

```javascript
context.meta = {
  endpointId: 'virtual-123',
  name: 'My Virtual Endpoint',
  timestamp: 1729900000000,
  endpoints: [
    { id: 'get-users', name: 'Get Users', method: 'GET', url: '/users' },
    // ... all loaded endpoints
  ]
}
```

---

## Common Patterns

### Transform Response

```javascript
async function virtualEndpoint(context) {
  const { get, utils } = context;

  const users = await get('get-users', {});

  return users.map(user => utils.pick(user, ['id', 'name', 'email']));
}
```

### Combine Endpoints

```javascript
async function virtualEndpoint(context) {
  const { input, parallel, utils } = context;

  const [user, posts] = await parallel(
    { endpointId: 'get-user', options: { params: { id: input.params.id } } },
    { endpointId: 'get-posts', options: { query: { userId: input.params.id } } }
  );

  return {
    ...user,
    postsCount: posts.length,
    recentPosts: posts.slice(0, 5)
  };
}
```

### Add Statistics

```javascript
async function virtualEndpoint(context) {
  const { get, utils } = context;

  const orders = await get('get-orders', {});

  return {
    total: orders.length,
    revenue: utils.sum(orders, 'total'),
    avgOrder: utils.avg(orders, 'total'),
    byStatus: utils.groupBy(orders, 'status')
  };
}
```

### Filter & Sort

```javascript
async function virtualEndpoint(context) {
  const { get, utils } = context;

  const items = await get('get-items', {});

  return items
    .filter(item => item.active)
    .map(item => utils.pick(item, ['id', 'name', 'price']))
    .sort((a, b) => b.price - a.price);
}
```

### Error Handling

```javascript
async function virtualEndpoint(context) {
  const { get } = context;

  try {
    const data = await get('flaky-endpoint', {});
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      fallback: { message: 'Service unavailable' }
    };
  }
}
```

### Sequential Calls

```javascript
async function virtualEndpoint(context) {
  const { input, get } = context;

  // First call
  const user = await get('get-user', {
    params: { id: input.params.id }
  });

  // Use result in second call
  const orders = await get('get-orders', {
    query: { userId: user.id, status: user.preferredStatus }
  });

  return { user, orders };
}
```

---

## Tips & Best Practices

1. **Always use async/await**: Virtual endpoint functions must be async
2. **Destructure context**: `const { input, get, utils } = context;`
3. **Handle errors**: Wrap risky calls in try/catch
4. **Use utilities**: Don't reinvent the wheel - utils have common operations
5. **Keep it simple**: Complex logic may hit the 10s timeout
6. **Test incrementally**: Use the Test tab to verify each step
7. **Use parallel when possible**: Fetch independent data in parallel for speed
8. **Check input**: Validate `input.params` before using

---

## Debugging

Log to console (visible in browser DevTools):

```javascript
async function virtualEndpoint(context) {
  console.log('Input:', context.input);
  console.log('Available endpoints:', context.meta.endpoints);

  const data = await context.get('endpoint-id', {});
  console.log('Response:', data);

  return data;
}
```

Check available utilities:

```javascript
return {
  availableUtils: Object.keys(context.utils),
  samplePick: context.utils.pick({ a: 1, b: 2, c: 3 }, ['a', 'b'])
};
```
