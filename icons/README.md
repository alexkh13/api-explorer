# Icon System

Reusable SVG icon components with consistent styling and minimal duplication.

## Architecture

### Base Components (`IconBase.jsx`)

**IconBase**: Configurable stroke-based SVG wrapper
- Supports custom size, fill, stroke, strokeWidth
- Default: `w-4 h-4`, `fill="none"`, `stroke="currentColor"`
- Used for outlined/stroke icons (Code, Run, Preview, etc.)

**Icon**: Simplified filled SVG wrapper
- Default: `viewBox="0 0 24 24"`, `fill="currentColor"`
- Used for filled/solid icons (shapes array)

**Path**: Helper component for stroke paths
- Automatically applies `strokeLinecap="round"` and `strokeLinejoin="round"`
- Reduces repetition in path definitions

### Named Icons (`index.jsx`)

13 named icon components using `IconBase` and `Path`:
- **Code**: Code editor icon with custom size (`w-5 h-5 mr-2`)
- **Run**: Play button in circle
- **Preview**: Eye icon
- **HidePreview**: Eye slash icon
- **Check**: Checkmark
- **ChevronRight**: Right arrow chevron
- **AI**: Sparkle/AI icon
- **Reset**: Circular arrow
- **Settings**: Gear icon
- **Spinner**: Animated loading spinner (uses `animate-spin` class)
- **List**: Hamburger menu
- **File**: Document icon
- **Edit**: Pencil icon

### Shape Icons (Endpoint Variety)

100+ geometric shapes in the `shapes` array for visual endpoint differentiation:
- All use the `Icon` component for consistency
- Includes circles, polygons, rectangles, hexagons, stars, etc.
- Accessed via `getEndpointIcon(endpointId)` helper

## Usage

### Importing Icons

```javascript
import * as Icons from "../icons/index.jsx";

// Named icon
<Icons.Code />

// Shape icon
const iconIndex = Icons.getEndpointIcon(endpoint.id);
const EndpointIcon = Icons.shapes[iconIndex];
<EndpointIcon />
```

### Customizing Named Icons

Named icons use `IconBase` which accepts standard SVG props:

```javascript
// Custom size
<IconBase size="w-6 h-6" strokeWidth={2}>
  <Path d="M5 13l4 4L19 7" />
</IconBase>

// Custom className
<IconBase className="text-red-500 animate-pulse" strokeWidth={2}>
  <Path d="..." />
</IconBase>
```

## Files Used In

- **EndpointItem.jsx**: Uses `shapes` array and `ChevronRight`
- **ActionFABMenu.jsx**: Uses `List`, `Preview`, `Edit`, `AI`, `Reset`
- **LoadSpecButton.jsx**: (check for icon usage)

## Refactoring History

**Phase 7: Icon System Optimization**
- Created `IconBase.jsx` with reusable base components
- Refactored 13 named icons to eliminate SVG attribute duplication
- Converted 100+ shapes to use `Icon` component
- Maintained full backward compatibility with existing imports
- Improved code maintainability and consistency

## Benefits

1. **DRY Code**: No duplicate SVG attributes across icons
2. **Consistency**: All icons share the same default props
3. **Maintainability**: Changes to icon structure only need updating base components
4. **Type Safety Ready**: Base components can be enhanced with JSDoc types
5. **Tree-Shaking Ready**: Individual icons could be extracted to separate files if needed
6. **Accessibility**: Easy to add aria-labels and titles at the base level

## Future Enhancements

- Add JSDoc types for better IDE autocomplete
- Add `title` prop support for accessibility
- Extract individual icons to separate files for better tree-shaking
- Create icon variant system (size presets: xs, sm, md, lg, xl)
- Add icon animation utilities (spin, pulse, bounce)
