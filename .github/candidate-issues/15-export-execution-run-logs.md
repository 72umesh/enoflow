# [FEATURE]: Add Export Execution Run Log to JSON in ExecutionPanel

## Problem
Currently, after a flow is executed in `Run` or `Step` mode, the results, node status, and input/output payloads are displayed inside the floating `ExecutionPanel`. However, once the page is reloaded, the results are cleared, and there is no option to save or export the complete execution log for offline analysis, auditing, or sharing with team members.

## Why
Being able to download execution traces (including execution timings, error messages, skipped branches, and per-node input/output data) as a structured JSON file is crucial for debugging complex flows and reporting bugs.

## Expected Behavior
1. Add an "Export Log" button (with `Download` icon) to the header of `ExecutionPanel.tsx` next to "Clear results".
2. When clicked, generate and download a timestamped JSON file: `enoflow-run-<flowName>-<timestamp>.json`.
3. The exported JSON contains:
   - `flowName`: Current flow name.
   - `executedAt`: ISO timestamp string.
   - `mode`: `"full"` or `"step"`.
   - `totalDuration`: Sum of all node execution durations in ms.
   - `summary`: `{ totalNodes: number, completed: number, error: number, skipped: number }`.
   - `steps`: Array of node execution results with nodeId, label, status, duration, input, output, and error.
4. Button is disabled when there are no execution results.

## Possible Approach
1. In `src/components/canvas/ExecutionPanel.tsx`:
   - Import `downloadJson` utility from `src/lib/utils.ts`.
   - Read `executionResults`, `stepResults`, `nodes`, `flowName` from `useFlowStore()`.
   - Construct the report object and trigger download with `downloadJson(report, filename)`.

## Acceptance Criteria
- [ ] "Export Log" button appears in `ExecutionPanel` header when execution results exist.
- [ ] Generates valid, formatted JSON with all execution metadata and node traces.
- [ ] Successfully triggers browser download with accurate filename.
- [ ] Gracefully disabled or hidden when no results are present.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/components/canvas/ExecutionPanel.tsx`
- `src/lib/utils.ts`
