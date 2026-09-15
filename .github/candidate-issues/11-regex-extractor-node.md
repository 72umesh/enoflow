# [FEATURE]: Implement Regex / Text Extractor transformation node

## Problem
In many real-world automation scenarios, incoming payloads from webhooks or HTTP requests contain raw unformatted strings (such as order confirmation texts, log lines, user input messages, or URLs). Users currently have to resort to custom JavaScript in `Code Block` nodes just to extract simple substrings like emails, phone numbers, or tokens.

## Why
A dedicated `Regex Extractor` node enables non-programmers to parse and sanitize text effortlessly, with common regex presets readily available.

## Expected Behavior
A new Transform node called `Regex Extractor`:
- **Inputs**: 1
- **Outputs**: 1
- **Configurable fields**:
  - `pattern`: Regex pattern string (e.g. `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`).
  - `flags`: Flags string like `g`, `i`, `m` (default: `g`).
  - `mode`: Dropdown with modes:
    - `extract-first`: Extracts first match or capture group.
    - `extract-all`: Returns an array of all matches.
    - `replace`: Replaces matches with a given `replacement` string.
    - `test`: Returns boolean `true`/`false` indicating if pattern matches.
  - `preset`: Quick preset dropdown providing pre-filled patterns:
    - *Email Address*
    - *URL / Link*
    - *Phone Number*
    - *Numbers Only*
    - *Custom*
- **Output**: The matched string(s), replaced text, or boolean test result.

## Possible Approach
1. Register node definition in `src/lib/node-definitions.ts` under category `transform` with icon `Search` or `Binary` from `lucide-react`.
2. Implement execution logic in `src/lib/engine.ts` inside `executeNode`:
   - Safely construct `new RegExp(pattern, flags)` with `try/catch` to handle invalid regex syntax gracefully without crashing.
3. Add configuration fields in `src/components/canvas/PropertiesPanel.tsx`.
4. Add unit test suite in `src/lib/engine.test.ts`.

## Acceptance Criteria
- [ ] Node appears in "Transforms" category in the left palette.
- [ ] Supports preset selection (Email, URL, etc.) auto-filling the pattern.
- [ ] Safely catches invalid regex syntax and reports error in execution results.
- [ ] All modes (`extract-first`, `extract-all`, `replace`, `test`) compute expected results.
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
