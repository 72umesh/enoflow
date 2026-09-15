# [FEATURE]: Implement Array Utility transformation node (Slice, Sort, Unique, Limit)

## Problem
Currently, when a workflow handles a list of items (e.g., from an API response or database query), users have no dedicated node to truncate lists, sort entries, remove duplicates, or take the first N items without writing raw code.

## Why
Array manipulation is one of the most frequent operations in automation workflows (e.g., "process top 5 recent orders", "sort by price descending", "deduplicate user IDs"). Having a visual `Array Utility` node dramatically improves ease of use.

## Expected Behavior
A new Transform node called `Array Utility`:
- **Inputs**: 1 (expects an Array or an object containing an array at `path`)
- **Outputs**: 1 (returns the transformed array)
- **Configurable fields**:
  - `operation`: Dropdown with options:
    - `limit`: Take the first N items (specified by `count`).
    - `slice`: Take a subslice from `startIndex` to `endIndex`.
    - `sort`: Sort array by key with order `asc` or `desc`.
    - `unique`: Remove duplicate primitive items or duplicate objects by key.
    - `reverse`: Reverse the order of elements.
    - `count`: Return the length/count of items in the array.
  - `keyPath`: Optional property key name when working with arrays of objects (e.g. `id` or `createdAt`).
  - `count` / `startIndex` / `endIndex`: Numeric parameters.

## Possible Approach
1. Register `array-utility` node in `src/lib/node-definitions.ts` with icon `ListFilter` or `ListOrdered` from `lucide-react`.
2. Implement operation execution in `src/lib/engine.ts`. Ensure non-array inputs are handled gracefully (e.g. returning error or empty array rather than throwing unhandled exceptions).
3. Render dedicated field inputs in `src/components/canvas/PropertiesPanel.tsx`.
4. Add unit test coverage in `src/lib/engine.test.ts`.

## Acceptance Criteria
- [ ] Registered under "Transforms" in `nodeDefinitionMap`.
- [ ] Correctly executes `limit`, `slice`, `sort`, `unique`, and `reverse`.
- [ ] Gracefully handles invalid inputs (null, undefined, non-arrays) with clear error message.
- [ ] Unit tests cover all operations and edge cases.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `node-expansion`, `good first issue`

## Relevant Files
- `src/lib/node-definitions.ts`
- `src/lib/engine.ts`
- `src/components/canvas/PropertiesPanel.tsx`
- `src/lib/engine.test.ts`
