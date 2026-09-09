# [FEATURE]: Add keyboard shortcuts for Run, Step Debug, and Delete

## Problem
Currently, all canvas interactions require mouse clicks: running a flow requires clicking the Play button, stepping requires clicking the Step button, and closing results requires clicking the X button.

## Why
Power users and developers expect standard keyboard shortcuts in visual canvas editors. Keyboard shortcuts dramatically accelerate editing and debugging velocity.

## Expected Behavior
Support standard keyboard shortcuts when the editor page is active (and the user is not typing in an `<input>` or `<textarea>`):
- `Ctrl + Enter` / `Cmd + Enter`: Run full flow.
- `Ctrl + Shift + Enter`: Step through flow.
- `Delete` / `Backspace`: Delete currently selected node or edge.
- `Escape`: Deselect current node or close bottom panels.
- `?`: Toggle a modal/popover showing keyboard shortcut reference cheat sheet.

## Possible Approach
1. In `src/app/editor/page.tsx` or inside a custom React hook `useEditorKeyboardShortcuts()`:
   - Listen to `keydown` events on `window`.
   - Ensure `!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)`.
   - Dispatch appropriate store actions (`setExecuting`, `removeNode`, etc.).
2. Add a small keyboard icon in `FlowToolbar.tsx` showing the shortcuts dialog.

## Acceptance Criteria
- [ ] Shortcuts do not trigger when typing inside text inputs/code blocks.
- [ ] `Ctrl/Cmd + Enter` triggers flow execution.
- [ ] `Delete` removes selected node.
- [ ] Works identically on macOS (`Cmd`) and Windows/Linux (`Ctrl`).

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `ui/ux`, `developer-experience`

## Relevant Files
- `src/app/editor/page.tsx`
- `src/components/canvas/FlowToolbar.tsx`
- `src/lib/store.ts`
