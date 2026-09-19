# [FEATURE]: Implement Sleep / Delay countdown indicator during live execution

## Problem
When a workflow runs a `Delay` node (for instance, waiting 3000ms or 5000ms between actions), the UI simply shows a generic loading spinner on the node. Users have no indication of how much wait time remains or whether the application is still actively counting down.

## Why
Providing a live visual countdown (e.g. *"Waiting 2.4s..."*) makes workflow execution feel responsive, predictable, and reassuring to users observing long-running automated tasks.

## Expected Behavior
1. While a `Delay` node is executing in `running` state:
   - Display a countdown badge or progress ring indicating remaining time in seconds / tenths of seconds.
2. In `ExecutionPanel.tsx`, the running step displays the remaining duration live.
3. Once the delay concludes, the node immediately switches to `success` and displays final duration.

## Possible Approach
1. In `src/lib/engine.ts`:
   - During `case "delay":`, emit interval ticks or progress callbacks via `onProgress?: (nodeId: string, remainingMs: number) => void`.
2. In `src/components/nodes/CustomNode.tsx`:
   - Render a live countdown chip next to the spinning icon when status is `running` and `nodeType === "delay"`.

## Acceptance Criteria
- [ ] Shows remaining seconds/milliseconds while delay executes.
- [ ] Smooth transition back to completed state upon timer completion.
- [ ] Does not block browser event loop or cause performance degradation.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `engine`, `ui/ux`

## Relevant Files
- `src/lib/engine.ts`
- `src/components/nodes/CustomNode.tsx`
- `src/components/canvas/ExecutionPanel.tsx`
