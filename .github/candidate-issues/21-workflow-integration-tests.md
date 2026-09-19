# [TEST]: Add integration tests for complete multi-step workflow execution in Vitest

## Problem
Currently, our test suite in `src/lib/engine.test.ts` primarily validates individual node behaviors (like JSON parser, CSV parser, Condition expressions) or isolated condition pruning. There are no integration test suites that construct full, realistic multi-node automation pipelines (such as Webhook -> Code Block -> CSV to JSON -> HTTP Request simulation) to verify end-to-end payload flow across sequential nodes.

## Why
Full workflow integration tests ensure regressions don't break data forwarding between handles, complex branched pipelines, or execution order when multiple nodes are linked together.

## Expected Behavior
A comprehensive test file `src/lib/workflow-integration.test.ts` that tests:
1. Linear pipeline: `Manual Trigger` -> `Code Block` -> `CSV to JSON` -> `Text Formatter`.
2. Split pipeline: One trigger branching into two parallel transform paths that converge into a single notification.
3. Abort signal test: Triggering `abort()` mid-flow cleanly stops subsequent nodes from executing.
4. Error handling pipeline: An upstream node encountering an exception halts dependent downstream nodes while recording proper error status.

## Possible Approach
1. Create `src/lib/workflow-integration.test.ts` utilizing `FlowEngine.executeFlow` and `executeStepByStep`.
2. Construct node fixtures matching real-world schema.
3. Assert step sequence and final result map contents.

## Acceptance Criteria
- [ ] Tests verify data propagation across 4+ chained nodes.
- [ ] Tests verify parallel branching and convergence.
- [ ] Tests verify abort cancellation behavior.
- [ ] Tests run and pass cleanly with `npm test`.

## Difficulty
Beginner

## Suggested Labels
`testing`, `engine`, `good first issue`

## Relevant Files
- `src/lib/workflow-integration.test.ts`
- `src/lib/engine.ts`
