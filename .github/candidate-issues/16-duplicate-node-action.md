# [FEATURE]: Add Duplicate / Clone node action via keyboard shortcut and context menu

## Problem
When authoring flows with repetitive node configurations (e.g., several HTTP requests to different endpoints, multiple field formatters, or multiple delays), users must manually drag a new node from the palette and reconfigure all properties from scratch.

## Why
Duplicating an existing node with its parameters intact is a standard feature in modern visual workflow builders (like n8n, Zapier, Figma). It saves time and drastically cuts down on repetitive manual inputs.

## Expected Behavior
1. Allow users to clone/duplicate the currently selected node:
   - Via keyboard shortcut: `Ctrl+D` (Windows/Linux) or `Cmd+D` (macOS).
   - Via right-click on the node or duplicate button in `PropertiesPanel.tsx`.
2. The cloned node:
   - Generates a new unique node ID (`node-${generateId()}`).
   - Copies all configuration data from the original node.
   - Sets label to `${originalLabel} (Copy)` if desirable, or keeps the original.
   - Spawns at an offset position (`x: original.x + 30, y: original.y + 30`) so it doesn't completely overlap the original node.
   - Immediately becomes the newly selected node (`selectNode(newNode.id)`).

## Possible Approach
1. In `src/lib/store.ts`:
   - Implement `duplicateNode: (nodeId: string) => void`.
2. In `src/components/canvas/FlowCanvas.tsx`:
   - Listen for `keydown` with `(e.ctrlKey || e.metaKey) && e.key === 'd'`.
   - Prevent default browser bookmark shortcut and trigger `duplicateNode(selectedNodeId)`.
3. In `src/components/canvas/PropertiesPanel.tsx`:
   - Ensure the existing duplicate button hooks directly into `duplicateNode`.

## Acceptance Criteria
- [ ] Pressing `Ctrl+D` / `Cmd+D` with a node selected duplicates it with identical config.
- [ ] Duplicated node is positioned with a slight offset (+30px, +30px).
- [ ] Does not copy edges (cloned node starts unconnected).
- [ ] Works seamlessly across all node types.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/lib/store.ts`
- `src/components/canvas/FlowCanvas.tsx`
- `src/components/canvas/PropertiesPanel.tsx`
