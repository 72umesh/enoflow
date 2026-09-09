# [UI/UX]: Add interactive empty-state onboarding guide on Canvas

## Problem
When a user navigates to `/editor` with a blank flow, the canvas displays an infinite empty grid. There is no prompt, call-to-action, or visual cue indicating how to begin building a workflow.

## Why
First-time users might feel lost or wonder if the editor is broken or still loading. An interactive empty state drastically improves onboarding and user delight.

## Current Behavior
When `nodes.length === 0`, `FlowCanvas.tsx` renders an empty `<ReactFlow>` canvas with just the background grid pattern.

## Expected Behavior
When `nodes.length === 0`:
1. Render a centered, subtle overlay card on the canvas:
   - Header: "Start Your Workflow"
   - Body: "Drag a Trigger node from the left panel onto the canvas, or start from a template."
   - Quick action buttons:
     - "Add Manual Trigger" (adds a node at canvas center).
     - "Browse Templates" (navigates to `/templates` or opens template picker).
2. The overlay card automatically fades out or unmounts as soon as the first node is dropped or added.

## Possible Approach
In `src/components/canvas/FlowCanvas.tsx`:
```tsx
const { nodes, addNode } = useFlowStore();

{nodes.length === 0 && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="bg-[#181825]/90 border border-[#313244] rounded-2xl p-6 max-w-sm text-center backdrop-blur shadow-2xl pointer-events-auto">
      {/* Visual Icon & Copy */}
      <h3 className="text-base font-semibold text-white mb-1">Canvas is Empty</h3>
      <p className="text-xs text-gray-400 mb-4">Drag nodes from the left palette to connect your flow.</p>
      ...
    </div>
  </div>
)}
```

## Acceptance Criteria
- [ ] Empty state only visible when `nodes.length === 0`.
- [ ] Disappears immediately once a node is placed.
- [ ] Responsive on both large and small viewport sizes.
- [ ] Does not block dragging from `NodePalette`.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/components/canvas/FlowCanvas.tsx`
