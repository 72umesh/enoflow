# [FEATURE]: Add Node Search and Filter in Node Palette sidebar

## Problem
As EnoFlow continues to expand with new Triggers, Actions, Transforms, and Utilities, the left `NodePalette` sidebar has grown significantly. Users currently have to scroll through multiple categorized accordion sections to locate a specific node.

## Why
A quick-filter search box allows users to type "csv", "delay", or "math" and immediately find the exact node they want to drag onto the canvas, vastly speeding up workflow construction.

## Expected Behavior
1. Add a compact search input at the top of `NodePalette.tsx` (with a search icon and clear `X` button).
2. As the user types:
   - Instantly filter visible nodes across all categories based on `label`, `description`, and `type`.
   - Automatically expand category sections that contain matching search results.
   - Show a friendly empty state if no nodes match the search term (e.g. *"No nodes found matching '<term>'"*).
3. Clearing the search restores the standard categorized palette view.
4. Pressing `/` or `Ctrl+K` focuses the search bar.

## Possible Approach
1. In `src/components/canvas/NodePalette.tsx`:
   - Add a `searchQuery` state.
   - Filter `nodeDefinitions` using `searchQuery.toLowerCase()`.
   - Group remaining matching nodes by `category`.

## Acceptance Criteria
- [ ] Instant search filtering with 0 perceptible lag.
- [ ] Filters against node labels and descriptions.
- [ ] Drag-and-drop continues to function properly on filtered search results.
- [ ] Empty state displayed when no nodes match.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/components/canvas/NodePalette.tsx`
