# Edition Switcher Implementation Summary

## Overview

Successfully implemented a date-based edition switching feature for the Tech Radar. This allows users to filter blips by specific radar editions, with editions representing snapshots in time based on blip move history.

## Architecture

### Domain Model

**Key Insight**: Editions are time-based snapshots. A blip appears in an edition if its move history shows activity on or before that edition's date (and the most recent move before the edition date isn't "go"/removed).

**Critical Design Decision**: Edition selection is **MANDATORY**. A blip may appear in multiple editions (e.g., React appears in Editions 1, 2, 3, and 4), so without edition filtering, the radar would show duplicate blips. The UI always defaults to the latest edition and does NOT offer an "All Editions" option.

```typescript
type Edition = {
  number: EditionNumber;  // Branded type for type safety
  title: string;
  date: EditionDate;      // Publication date
};
```

### Smart Constructor Pattern

Following functional programming principles:

```typescript
export const createEdition = (
  number: number,
  title: string,
  date: Date
): Result<Edition, ValidationError> => {
  // Validates inputs and returns Result type
  // Never throws exceptions for expected errors
}
```

## Implementation Details

### 1. Schema Updates

#### Astro Content Schema ([config.ts:106-113](apps/astro/src/content/config.ts#L106-L113))

```typescript
const EditionSchema = z.object({
  id: z.string(),           // "1", "2", "3"
  number: z.number().int().positive(),  // For ordering/display
  title: z.string(),        // "Q4 2023 Tech Radar"
  content: z.string(),      // Markdown content
  date: z.date(),          // Publication date - matches blip movements
});
```

### 2. Edition Filtering Logic ([editionHelpers.ts](apps/astro/src/utils/editionHelpers.ts))

**Core Function**: `isBlipActiveInEdition(blip, editionDate)`

Logic:
1. Filter blip moves on or before edition date
2. Sort chronologically (most recent first)
3. Check most recent move type
4. Blip is active unless most recent move is "go" (removed)

**Additional Helpers**:
- `getBlipsForEdition()` - Get all active blips for an edition
- `getMovesInEdition()` - Get moves that occurred within edition timeframe
- `isBlipNewInEdition()` - Check if blip first appeared in edition
- `getEditionsForBlip()` - Get all editions a blip appears in

### 3. UI Components

#### EditionSwitcher ([EditionSwitcher.tsx](apps/astro/src/components/radar/EditionSwitcher.tsx))

**Features**:

- Dropdown selector (NO "All Editions" option to prevent duplicates)
- Automatically defaults to latest edition on mount
- Shows edition date when selected
- Uses nanostores for global state management
- Accessible with ARIA labels

**State Management**:
```typescript
export const selectedEdition = atom<Edition | null>(null);
// Initialized to null, but automatically set to latest edition
// Never remains null in practice - always has an edition selected
```

#### Styling ([EditionSwitcher.css.ts](apps/astro/src/components/radar/EditionSwitcher.css.ts))

- Functional composition of design tokens
- Semi-transparent backdrop with blur effect
- Smooth transitions and hover states
- Custom dropdown arrow styling

### 4. Radar Integration

**Data Flow** ([Radar.tsx:44-67](apps/astro/src/components/radar/Radar.tsx#L44-L67)):

```
All Blips
  → Edition Filter (getBlipsForEdition) ← ALWAYS FIRST
  → Search Filter (useBlipSearch)
  → Displayed Blips
```

**Critical Order**: Edition filtering **MUST** happen before search to prevent duplicate blips.

**Filter Composition**:
```typescript
// 1. Edition filtering FIRST (mandatory to prevent duplicates)
const currentEdition = useStore(selectedEdition);
const editionBlips = currentEdition
  ? getBlipsForEdition(blips, currentEdition)
  : []; // Empty if no edition selected yet

// 2. Search filtering on edition-specific blips
const { filteredBlips } = useBlipSearch(editionBlips);

// 3. Final blips for rendering
const radarBlips = UseBlipPositions(filteredBlips);

// Minimap also uses edition-filtered blips (not all blips)
const miniMapBlips = UseBlipPositions(editionBlips);
```

**UI Layout**:
- Edition switcher positioned above search input
- Both in top-right corner of radar
- Vertical stacking with 8px gap

### 5. Example Editions Created

#### Edition 2 - December 2023 ([two.mdx](apps/astro/src/content/edition/two.mdx))
- Date: 2023-12-31
- Captures Q4 2023 state

#### Edition 3 - March 2024 ([three.mdx](apps/astro/src/content/edition/three.mdx))
- Date: 2024-03-31
- Q1 2024 evolution

#### Edition 4 - December 2024 ([four.mdx](apps/astro/src/content/edition/four.mdx))
- Date: 2024-12-31
- Year-end 2024 snapshot

### 6. JWT Test Case

**JWT Move History**:
```typescript
move: [
  ["grow", "2023-11-20"],  // First appearance
  ["go", "2024-02-03"],    // Removed
  ["stay", "2024-03-01"],  // Back on radar
  ["grow", "2024-03-30"],  // Growing
  ["go", "2024-12-20"],    // Removed again
  ["go", "2025-03-22"]     // Still removed
]
```

**Expected Edition Membership**:
- ✅ Edition 2 (2023-12-31): YES - most recent move is "grow"
- ✅ Edition 3 (2024-03-31): YES - most recent move is "grow" (2024-03-30)
- ❌ Edition 4 (2024-12-31): NO - most recent move is "go" (2024-12-20)
- ❌ Edition 1 (2025-06-01): NO - most recent move is "go" (2025-03-22)

## Design Principles Applied

### 1. Functional Programming
- **Pure functions** for edition filtering logic
- **Smart constructors** with validation
- **Result types** instead of exceptions
- **Immutable data structures**

### 2. Domain-Driven Design
- **Branded types** (`EditionNumber`, `EditionDate`)
- **Ubiquitous language** (Edition, Move, Active, Removed)
- **Domain rules** encapsulated in helpers
- **Type safety** prevents illegal states

### 3. Composition Over Complexity
- **Small, focused functions** that compose
- **Filter composition** (edition → search → display)
- **Separation of concerns** (UI, domain logic, state)

### 4. User Experience
- **Mandatory edition selection** - prevents duplicate blips
- **Auto-default to latest** - sensible starting point
- **Clear feedback** - selected edition date displayed
- **Accessible** - proper ARIA labels
- **Non-destructive** - filters don't modify underlying data

## Testing Strategy

### Manual Testing
1. Start dev server: `pnpm dev`
2. Navigate to `http://localhost:4321`
3. Test edition switcher dropdown
4. Verify JWT appears in correct editions
5. Test combination of search + edition filters

### Expected Behaviors
- Edition 2 shows JWT (it was growing)
- Edition 3 shows JWT (still growing)
- Edition 4 does NOT show JWT (removed with "go")
- Search works within selected edition
- Minimap shows only edition-filtered blips

## Files Modified/Created

### Created Files
- `apps/astro/src/utils/editionHelpers.ts` - Domain logic and helpers
- `apps/astro/src/components/radar/EditionSwitcher.tsx` - UI component
- `apps/astro/src/components/radar/EditionSwitcher.css.ts` - Styles
- `apps/astro/src/content/edition/two.mdx` - Test edition
- `apps/astro/src/content/edition/three.mdx` - Test edition
- `apps/astro/src/content/edition/four.mdx` - Test edition

### Modified Files
- `apps/astro/src/content/config.ts` - Updated Edition schema
- `apps/astro/src/content/edition/one.mdx` - Added number field
- `apps/astro/src/components/radar/Radar.tsx` - Integrated edition filtering
- `apps/astro/src/components/radar/Radar.css.ts` - Updated container styles
- `apps/astro/src/pages/index.astro` - Pass editions to Radar component

## Known Limitations & Future Considerations

### Content Evolution Challenge

**Current Limitation**: The implementation works well for filtering blips by edition, but doesn't handle evolving blip content between editions. A blip like React might have different descriptions, rings, or details in Edition 2 vs Edition 4, but the current single-file approach shows the same content across all editions.

**Trade-off**: The current approach prioritizes:
- ✅ **Maintainability**: Single source of truth per blip
- ✅ **Move tracking**: History preserved in one place
- ❌ **Content evolution**: Content can't change between editions

**Potential Future Solutions** (if content evolution becomes critical):

1. **Edition-based folders** (most maintainable)
   ```
   content/editions/
     2023-q4/
       _meta.json
       react.mdx
     2024-q1/
       _meta.json
       react.mdx  // Updated content
   ```

2. **Content blocks in metadata** (more complex)
   ```yaml
   contents:
     - edition: 2
       ring: "adopt"
       description: "React 18 features"
     - edition: 3
       ring: "adopt"
       description: "React 19 with Suspense"
   ```

**Current Recommendation**: Keep the existing approach unless content evolution becomes a real user need. The move array provides sufficient historical tracking for most use cases.

## Next Steps (Optional Enhancements)

### 1. Edition Comparison View
Show blips that moved between two editions:
```typescript
const compareEditions = (
  edition1: Edition,
  edition2: Edition
): EditionComparison => {
  // Identify new, moved, and removed blips
}
```

### 2. Edition Timeline Visualization
Visual timeline showing:
- When editions were published
- Number of blips per edition
- Major technology shifts

### 3. Blip Edition Badge
Show which editions a blip appears in:
```typescript
<BlipBadge
  blip={blip}
  editions={getEditionsForBlip(blip, allEditions)}
/>
```

### 4. Deep Linking
Support URL parameters:
```
/radar?edition=2
/radar?edition=3&search=jwt
```

### 5. Edition Export
Export edition snapshot as JSON/CSV for historical tracking.

## Conclusion

The edition switcher successfully implements date-based filtering using functional programming principles and domain-driven design. The implementation:

- ✅ Uses smart constructors and branded types
- ✅ Filters blips based on move history
- ✅ Composes with existing search functionality
- ✅ Follows project architectural standards
- ✅ Maintains type safety throughout
- ✅ Provides clear user experience
- ✅ Prevents duplicate blips through mandatory edition selection

The feature is production-ready and can be extended with additional capabilities as needed. The current design prioritizes simplicity and maintainability over complex content evolution features, which aligns with the project's functional programming and domain-driven design principles.
