# [UI/UX]: Add floating Zoom Controls with percentage display and quick presets

## Problem
Currently, the canvas relies on default ReactFlow controls in the corner. Users have no visual indication of the current zoom level percentage (e.g. `100%`, `75%`), nor can they quickly snap to useful presets like 100% zoom or fit all nodes with a single labeled button.

## Why
When building large workflows, navigating between a high-level bird's-eye view and detailed node property inspection is essential. Labeled zoom presets (`100%`, `Fit View`) and an explicit zoom percentage badge significantly improve user spatial orientation on infinite canvases.

## Expected Behavior
1. Display a sleek floating toolbar near the existing controls (or integrated into the canvas corner):
   - Current Zoom Percentage badge (e.g. `100%`, updating dynamically during wheel scroll or pinch zoom).
   - Zoom In button (`+` icon).
   - Zoom Out button (`-` icon).
   - Reset Zoom button (snaps back to `100%` at `zoomTo(1)`).
   - "Fit View" button (calls `fitView({ padding: 0.2 })`).
2. Adhere to EnoFlow's dark Catppuccin theme (`#1e1e2e`, `#313244` border, hover effects).
3. Clicking percentage or double-clicking resets zoom to `100%`.

## Possible Approach
1. In `src/components/canvas/FlowCanvas.tsx`:
   - Use `useViewport()` or `useReactFlow()` from `@xyflow/react` to read the current zoom factor `Math.round(zoom * 100)`.
   - Call `zoomIn()`, `zoomOut()`, `zoomTo(1)`, and `fitView()`.
2. Create a clean `ZoomControls.tsx` component or embed in `FlowCanvas.tsx`.

## Acceptance Criteria
- [ ] Displays real-time zoom percentage rounded to integer (e.g. `100%`).
- [ ] Zoom In / Out buttons smoothly step zoom level.
- [ ] Reset button restores zoom scale to `1` (100%).
- [ ] Fit View button centers all canvas nodes with comfortable padding.
- [ ] Styled consistently with existing canvas control buttons.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/components/canvas/FlowCanvas.tsx`
