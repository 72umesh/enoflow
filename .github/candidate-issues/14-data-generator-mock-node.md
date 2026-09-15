# [FEATURE]: Implement Mock Data / Generator node (UUID, Random Number, Timestamp, Faker)

## Problem
When authoring and debugging workflows in EnoFlow, users frequently need realistic sample data (such as random UUIDs, mock user objects, timestamps, random integers, or booleans) to verify their logic before connecting production webhooks or API endpoints. Currently, users must manually type sample JSON in manual triggers or write math scripts.

## Why
A dedicated `Data Generator` node accelerates workflow testing and prototyping, allowing beginners to easily simulate realistic data streams.

## Expected Behavior
A new Trigger / Action node called `Data Generator`:
- **Inputs**: 0 or 1 (can act as a trigger or enrich an existing payload)
- **Outputs**: 1 (returns the generated mock data object)
- **Configurable fields**:
  - `dataType`: Dropdown with generator types:
    - `uuid`: Generates a standard UUID v4 string (e.g. `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`).
    - `random-number`: Generates a random number between `min` and `max` (integer or float).
    - `timestamp`: Returns ISO timestamp string or UNIX epoch millisecond timestamp.
    - `random-choice`: Picks one random item from a comma-separated list of choices.
    - `mock-user`: Returns a mock user object with `{ id, name, email, role, active }`.
  - `keyName`: Property key to write the output to (e.g. `mockId`, `generatedUser`).

## Possible Approach
1. Register `data-generator` node in `src/lib/node-definitions.ts` with icon `Sparkles` or `Dice5` from `lucide-react`.
2. Implement generation logic in `src/lib/engine.ts` using standard browser `crypto.randomUUID()` and native JS math.
3. Add configuration controls in `src/components/canvas/PropertiesPanel.tsx`.
4. Add unit test suite in `src/lib/engine.test.ts`.

## Acceptance Criteria
- [ ] Node selectable from Node Palette under "Actions" or "Transforms".
- [ ] Generates valid UUID v4 compliant string.
- [ ] Generates numbers strictly within `[min, max]` range.
- [ ] Returns valid ISO 8601 timestamps.
- [ ] Generates consistent mock object format without external heavy dependencies.
- [ ] Unit tests pass via `npm test`.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `node-expansion`, `good first issue`

## Relevant Files
- `src/lib/node-definitions.ts`
- `src/lib/engine.ts`
- `src/components/canvas/PropertiesPanel.tsx`
- `src/lib/engine.test.ts`
