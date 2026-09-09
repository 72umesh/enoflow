# [FEATURE]: Implement Math / Calculator transformation node

## Problem
Currently, to perform simple mathematical calculations on numbers in a flow (such as adding a fee, multiplying by quantity, or rounding a number), users are forced to write JavaScript in a `Code Block` node.

## Why
A dedicated `Math Operation` node simplifies workflow design for non-programmers and fits naturally into EnoFlow's mission as an educational workflow builder.

## Expected Behavior
A new Transform node called `Math Operation`:
- **Inputs**: 1
- **Outputs**: 1
- **Configurable fields**:
  - `operation`: Dropdown with options: `add` (+), `subtract` (-), `multiply` (*), `divide` (/), `modulo` (%), `round`, `floor`, `ceil`.
  - `operand`: Number input (e.g. `10`).
  - `path`: Optional dot-notation path if the incoming input is an object (e.g. `order.total`).
- **Output**: Returns the computed numerical result or updated object.

## Possible Approach
1. Follow the [How to Add a Node](CONTRIBUTING.md#how-to-add-a-new-node-type) guide in `CONTRIBUTING.md`.
2. Register node definition in `src/lib/node-definitions.ts` with icon `Calculator` from `lucide-react`.
3. Implement arithmetic logic in `FlowEngine.executeNode` in `src/lib/engine.ts`.
4. Add configuration inputs in `src/components/canvas/PropertiesPanel.tsx`.
5. Guard against division by zero (return error or `0`).
6. Write unit tests in `src/lib/engine.test.ts`.

## Acceptance Criteria
- [ ] Node appears under "Transforms" in the Node Palette sidebar.
- [ ] Operations (`+`, `-`, `*`, `/`, modulo, rounding) calculate accurately.
- [ ] Handles division by zero gracefully without crashing the engine.
- [ ] Form controls update node config in real-time.
- [ ] Unit tests pass via `npm test`.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `node-expansion`, `help wanted`

## Relevant Files
- `src/lib/node-definitions.ts`
- `src/lib/engine.ts`
- `src/components/canvas/PropertiesPanel.tsx`
- `src/lib/engine.test.ts`
