# [FEATURE]: Implement CSV to JSON conversion transform node

## Problem
Users who want to import or simulate processing bulk tabular data (like CSV spreadsheets) cannot easily convert CSV strings into JSON arrays of objects.

## Why
CSV processing is one of the most common workflow automation use cases (e.g. ingesting customer leads, bulk product updates). A lightweight browser-native CSV parser node makes data pipelines much more practical.

## Expected Behavior
A new Transform node called `CSV to JSON`:
- **Category**: `transform`
- **Icon**: `FileSpreadsheet` from `lucide-react`
- **Configurable fields**:
  - `delimiter`: Default `,` (options: `,`, `;`, `\t`, `|`).
  - `hasHeader`: Boolean (default `true`). If true, first row keys object properties; if false, returns array of arrays.
  - `trimValues`: Boolean (default `true`).
- **Input**: CSV string or object containing CSV field.
- **Output**: Array of parsed JSON objects.

## Possible Approach
1. Register in `src/lib/node-definitions.ts`.
2. Implement a pure, dependency-free CSV parsing helper in `src/lib/utils.ts` or inside `src/lib/engine.ts` that splits lines and delimiter while properly handling quoted fields (`"value, with comma"`).
3. Add configuration inputs in `src/components/canvas/PropertiesPanel.tsx`.
4. Add unit test in `src/lib/engine.test.ts`.

## Acceptance Criteria
- [ ] Parses standard comma-separated values into array of objects.
- [ ] Handles custom delimiters (semicolon, tab).
- [ ] Handles quoted strings containing delimiters gracefully.
- [ ] Unit tests covering common CSV shapes and edge cases.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `node-expansion`, `help wanted`

## Relevant Files
- `src/lib/node-definitions.ts`
- `src/lib/engine.ts`
- `src/components/canvas/PropertiesPanel.tsx`
- `src/lib/engine.test.ts`
