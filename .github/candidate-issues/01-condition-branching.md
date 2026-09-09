# [BUG]: Condition node branches both execute instead of pruning inactive branch

## Problem
When a Condition node evaluates its expression (for example evaluating to `true`), nodes connected to both the `true` and the `false` output handles are executed.

## Why
Condition nodes exist to create logical branching in workflows. If both branches execute unconditionally, flows that depend on conditional decision-making (e.g. "if status === 200 notify success, else alert error") will erroneously execute both paths.

## Current Behavior
In `src/lib/engine.ts`:
1. `executeFlow` sorts all nodes in a flat topological order: `const sorted = this.topologicalSort(nodes, edges);`
2. It iterates through every node in `sorted` and executes it.
3. The helper method `getOutputForHandle` was created at line 65 but is never invoked.
4. As a result, both branches execute regardless of condition truthiness.

## Expected Behavior
- When a Condition node evaluates to `true`, only downstream nodes connected to the `true` handle should execute.
- Downstream nodes connected to the `false` handle should be marked as `skipped` (unless they also receive valid active input from another active path).
- The same applies in reverse if the Condition evaluates to `false`.

## Possible Approach
1. In `FlowEngine.executeNode`, return the active handle ID alongside the result:
   ```ts
   output = { condition: result, value: input, activeHandle: result ? "true" : "false" };
   ```
2. In `executeFlow`, maintain a set of `inactiveNodeIds`.
3. If an incoming edge originates from a handle that was not active, do not execute the child node unless it has another active incoming edge. Mark inactive nodes as `skipped`.
4. Update `CustomNode.tsx` or `ExecutionPanel.tsx` to display a subtle grayed-out badge for `skipped` nodes.

## Acceptance Criteria
- [ ] Nodes connected exclusively to the inactive branch of a Condition node are not executed.
- [ ] Skipped nodes are reflected in execution results without causing flow errors.
- [ ] Unit test added in `src/lib/engine.test.ts` validating conditional branch pruning.

## Difficulty
Intermediate

## Suggested Labels
`bug`, `engine`, `help wanted`

## Relevant Files
- `src/lib/engine.ts`
- `src/components/nodes/CustomNode.tsx`
- `src/lib/engine.test.ts`
