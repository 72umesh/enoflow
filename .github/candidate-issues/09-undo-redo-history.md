# [FEATURE]: Implement Undo / Redo history state for workflow canvas

## Problem
Currently in `/editor`, any changes made to the flow (adding nodes, moving nodes, deleting nodes, updating properties, connecting edges) cannot be undone. If a user accidentally deletes a node or disconnects edges, there is no way to revert the action without reloading a saved flow.

## Why
Accidental deletions or misconfigurations are common during visual workflow editing. Standard visual node editors (like Figma, n8n, React Flow builders) provide robust `Ctrl+Z` / `Ctrl+Y` (or `Cmd+Z` / `Cmd+Shift+Z`) history stacks to ensure peace of mind.

## Current Behavior
The canvas directly mutates Zustand state (`nodes`, `edges`) without tracking past snapshot history.

## Expected Behavior
1. Track past and future snapshots of `nodes` and `edges` (with debounce or discrete action checkpoints).
2. Add "Undo" and "Redo" buttons to `FlowToolbar.tsx` with hotkey indicators (`Ctrl+Z`, `Ctrl+Y` / `Cmd+Shift+Z`).
3. Support keyboard shortcuts `Ctrl+Z` (Undo) and `Ctrl+Y` / `Cmd+Shift+Z` (Redo) when canvas is active.
4. Disable Undo/Redo buttons when the corresponding history stack is empty.

## Possible Approach
1. In `src/lib/store.ts` (or with Zustand `zundo` / custom temporal slice):
   - Maintain `history: { past: FlowSnapshot[], future: FlowSnapshot[] }`.
   - Provide `undo()`, `redo()`, `canUndo`, and `canRedo`.
2. Add interactive Undo and Redo icons in `FlowToolbar.tsx`.

## Acceptance Criteria
- [ ] Clicking Undo reverts the previous canvas node/edge mutation.
- [ ] Clicking Redo reapplies the undone mutation.
- [ ] Keyboard shortcuts `Ctrl+Z` and `Ctrl+Y` / `Cmd+Shift+Z` work reliably.
- [ ] Undo and Redo buttons are disabled when stacks are empty.
- [ ] State changes do not cause memory leaks or infinite re-renders.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `ui/ux`, `state-management`

## Relevant Files
- `src/lib/store.ts`
- `src/components/canvas/FlowToolbar.tsx`
