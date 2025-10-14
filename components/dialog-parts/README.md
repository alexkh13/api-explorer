# Dialog Parts

Reusable components for building consistent dialog interfaces.

## Components

### DialogHeader

Standardized header for dialog modals with title and description.

**Props:**
- `title` (string) - Dialog title text
- `description` (string|ReactNode) - Dialog description/subtitle

**Example:**
```jsx
<DialogHeader
  title="Configure Settings"
  description="Adjust your application settings below."
/>
```

---

### DialogFooter

Standardized footer with Cancel and Submit buttons.

**Props:**
- `onCancel` (function) - Cancel button click handler
- `onSubmit` (function, optional) - Submit button handler (optional if in form)
- `submitLabel` (string) - Submit button text (default: "Save")
- `cancelLabel` (string) - Cancel button text (default: "Cancel")
- `loading` (boolean) - Loading state, disables buttons
- `disabled` (boolean) - Disabled state for submit button
- `submitType` (string) - Button type attribute (default: "submit")

**Example:**
```jsx
<DialogFooter
  onCancel={handleClose}
  submitLabel="Load Spec"
  loading={isLoading}
/>
```

---

### FormField

Standardized form field with label, input/select/textarea, error message, and help text.

**Props:**
- `label` (string) - Field label text
- `type` (string) - Input type: text, password, email, url, etc. (default: "text")
- `value` (string) - Field value
- `onChange` (function) - Change handler
- `placeholder` (string) - Placeholder text
- `error` (string) - Error message to display below field
- `helpText` (string) - Optional help text below field
- `disabled` (boolean) - Disabled state
- `required` (boolean) - Shows required asterisk
- `as` (string) - Element type: 'input', 'select', 'textarea' (default: 'input')
- `children` (ReactNode) - For select options or custom content

**Examples:**

**Text Input:**
```jsx
<FormField
  label="API URL"
  type="url"
  value={url}
  onChange={e => setUrl(e.target.value)}
  placeholder="https://api.example.com"
  error={urlError}
  required
/>
```

**Password Input:**
```jsx
<FormField
  label="API Key"
  type="password"
  value={apiKey}
  onChange={e => setApiKey(e.target.value)}
  placeholder="Enter your API key"
  helpText="Your key is stored locally"
/>
```

**Select Dropdown:**
```jsx
<FormField
  label="Model"
  as="select"
  value={model}
  onChange={e => setModel(e.target.value)}
>
  <option value="gpt-4">GPT-4</option>
  <option value="gpt-3.5">GPT-3.5</option>
</FormField>
```

**Textarea:**
```jsx
<FormField
  label="Description"
  as="textarea"
  value={description}
  onChange={e => setDescription(e.target.value)}
  placeholder="Enter description..."
/>
```

---

## Usage Pattern

**Complete Dialog Example:**

```jsx
import { Dialog } from "../Dialog.jsx";
import { DialogHeader, DialogFooter, FormField } from "../dialog-parts/index.jsx";

export function MyDialog({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader
        title="My Dialog"
        description="Enter your information below."
      />

      <form className="mt-6" onSubmit={handleSubmit}>
        <FormField
          label="URL"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          error={error}
          required
        />

        <DialogFooter
          onCancel={onClose}
          submitLabel="Submit"
          loading={loading}
        />
      </form>
    </Dialog>
  );
}
```

---

## Benefits

1. **Consistency** - All dialogs have the same look and feel
2. **DRY** - Eliminate repeated form/button styling
3. **Accessibility** - Consistent label/input association
4. **Maintainability** - Update styles in one place
5. **Developer Experience** - Less boilerplate code

---

## Styling

All components use CSS custom properties for theming:
- `--text-primary` - Primary text color
- `--text-secondary` - Secondary/muted text
- `--bg-primary` - Primary background
- `--bg-muted` - Muted background
- `--border-default` - Default border color
- `--accent-primary` - Accent color (buttons, focus)
- `--accent-primary-hover` - Accent hover state

These automatically adapt to light/dark themes.
