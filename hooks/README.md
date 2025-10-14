# Custom Hooks

Reusable React hooks for common patterns in the application.

## Available Hooks

### useLocalStorageState

**Purpose**: State that automatically syncs with localStorage with debounced writes.

**Signature**:
```javascript
useLocalStorageState(key, initialValue, options)
```

**Parameters**:
- `key` (string) - localStorage key
- `initialValue` (*) - Initial value or initializer function
- `options` (object) - Configuration options
  - `debounceMs` (number) - Debounce delay (default: 1000ms)
  - `serialize` (function) - Custom serialization function
  - `deserialize` (function) - Custom deserialization function

**Returns**: `[state, setState]` - Same as useState

**Example**:
```javascript
const [config, setConfig] = useLocalStorageState('appConfig', {
  theme: 'dark',
  notifications: true
});

// With custom serialization (e.g., for Set/Map)
const [state, setState] = useLocalStorageState(
  'myState',
  { items: new Set() },
  {
    serialize: (state) => ({
      ...state,
      items: Array.from(state.items)
    }),
    deserialize: (saved) => ({
      ...saved,
      items: new Set(saved.items)
    })
  }
);
```

**Benefits**:
- Automatic persistence to localStorage
- Debounced writes prevent performance issues
- Supports custom serialization for complex types
- Works like standard useState

---

### useLocalStorageValue

**Purpose**: Simplified localStorage sync without debouncing (for immediate saves).

**Signature**:
```javascript
useLocalStorageValue(key, defaultValue)
```

**Parameters**:
- `key` (string) - localStorage key
- `defaultValue` (*) - Default value if not found

**Returns**: `[value, setValue]`

**Example**:
```javascript
const [apiKey, setApiKey] = useLocalStorageValue('api_key', '');
```

**Use When**:
- Immediate localStorage updates needed
- Simple values that don't change frequently
- Form fields that save on blur

---

### useAsyncAction

**Purpose**: Manages async action state (loading, error, data) with automatic updates.

**Signature**:
```javascript
useAsyncAction(asyncFn, options)
```

**Parameters**:
- `asyncFn` (async function) - The async function to execute
- `options` (object) - Configuration
  - `onSuccess` (function) - Success callback
  - `onError` (function) - Error callback
  - `initialData` (*) - Initial data value

**Returns**: Object with:
- `loading` (boolean) - Loading state
- `error` (string|null) - Error message
- `data` (*) - Result data
- `execute` (function) - Function to trigger the action
- `reset` (function) - Reset to initial state
- `isLoading` (boolean) - Alias for loading
- `isError` (boolean) - Whether there's an error
- `isSuccess` (boolean) - Whether action succeeded

**Example**:
```javascript
const fetchUsers = useAsyncAction(
  async (page) => {
    const response = await fetch(`/api/users?page=${page}`);
    return response.json();
  },
  {
    onSuccess: (data) => console.log('Loaded', data.length, 'users'),
    onError: (error) => console.error('Failed:', error)
  }
);

// In component
<button onClick={() => fetchUsers.execute(1)} disabled={fetchUsers.loading}>
  {fetchUsers.loading ? 'Loading...' : 'Load Users'}
</button>

{fetchUsers.error && <div className="error">{fetchUsers.error}</div>}
{fetchUsers.data && <UserList users={fetchUsers.data} />}
```

**Benefits**:
- Eliminates boilerplate for async state management
- Automatic loading/error handling
- Clean API with helper flags
- Success/error callbacks

---

### useAsyncState

**Purpose**: Simpler version for manual async state management.

**Signature**:
```javascript
useAsyncState(initialValue)
```

**Returns**: Object with:
- `value` - Current value
- `setValue` - Update value
- `loading` - Loading flag
- `setLoading` - Update loading
- `error` - Error message
- `setError` - Update error
- `reset` - Reset to initial state
- `isLoading` - Alias for loading
- `isError` - Whether there's an error

**Example**:
```javascript
const { value, setValue, loading, setLoading, error, setError } = useAsyncState(null);

const loadData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchData();
    setValue(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Use When**:
- Need more control over async flow
- Complex multi-step async operations
- Multiple async calls in single function

---

## Usage Patterns

### Context with localStorage Persistence

```javascript
import { useLocalStorageState } from '../hooks/index.js';

export function MyProvider({ children }) {
  const [state, setState] = useLocalStorageState('myApp', {
    user: null,
    settings: {}
  });

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}
```

### Async Data Fetching

```javascript
import { useAsyncAction } from '../hooks/index.js';

export function UserProfile({ userId }) {
  const fetchProfile = useAsyncAction(
    async (id) => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    }
  );

  useEffect(() => {
    fetchProfile.execute(userId);
  }, [userId]);

  if (fetchProfile.loading) return <Spinner />;
  if (fetchProfile.error) return <Error message={fetchProfile.error} />;
  if (!fetchProfile.data) return null;

  return <div>{fetchProfile.data.name}</div>;
}
```

---

## Best Practices

1. **useLocalStorageState for Contexts**
   - Perfect for provider state that needs persistence
   - Handles serialization automatically
   - Debouncing prevents excessive writes

2. **useAsyncAction for API Calls**
   - Cleaner than manual useState + try/catch
   - Consistent error handling
   - Built-in loading states

3. **Custom Hooks Composition**
   - Combine these hooks to create domain-specific hooks
   - Example: `useAuth` could use `useLocalStorageState` + `useAsyncAction`

4. **Testing**
   - Hooks are isolated and easily testable
   - Mock localStorage for tests
   - Mock async functions for useAsyncAction

---

## Migration Guide

### Before (Manual localStorage):
```javascript
const [state, setState] = useState(() => {
  const saved = localStorage.getItem('key');
  return saved ? JSON.parse(saved) : defaultValue;
});

useEffect(() => {
  localStorage.setItem('key', JSON.stringify(state));
}, [state]);
```

### After (useLocalStorageState):
```javascript
const [state, setState] = useLocalStorageState('key', defaultValue);
```

---

### Before (Manual Async State):
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await apiCall();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### After (useAsyncAction):
```javascript
const { data, loading, error, execute: fetchData } = useAsyncAction(apiCall);
```

---

## Performance Considerations

- **useLocalStorageState** debounces writes (default: 1000ms) to prevent excessive localStorage operations
- **useAsyncAction** doesn't cache results - use React Query or SWR for advanced caching
- Both hooks use React's built-in memoization patterns

---

## Related

- See `utils/storage.js` for localStorage utilities
- See `services/code-validation.js` for example service used with contexts
- See `contexts/` for real-world usage examples
