# [TEST]: Add unit test suite for Transform nodes in FlowEngine

## Problem
While `src/lib/engine.test.ts` now tests basic topological sorting and graph cycle validation, the 4 Transform nodes (`json-parser`, `text-formatter`, `object-mapper`, `array-iterator`) currently have no dedicated unit tests.

## Why
Transform nodes contain complex string replacement, JSON path evaluation, object key remapping, and array iterator functions. Having automated tests prevents regressions when refactoring or upgrading dependencies.

## Current Behavior
Transform logic inside `FlowEngine.executeNode` in `src/lib/engine.ts` (lines 148-261) is only tested manually through the browser interface.

## Expected Behavior
A comprehensive unit test file `src/lib/transforms.test.ts` (or additions to `src/lib/engine.test.ts`) that verifies:
1. `json-parser`:
   - Parses valid JSON strings.
   - Extracts nested fields using dot notation (`user.profile.name`).
   - Stringifies objects when `operation === "stringify"`.
2. `text-formatter`:
   - Replaces template placeholders `{{key}}`.
   - Correctly transforms text for `uppercase`, `lowercase`, `trim`, and `reverse`.
3. `object-mapper`:
   - Maps source properties to target keys according to mapping JSON.
   - Handles nested paths (`address.city`).
4. `array-iterator`:
   - Performs `map`, `filter`, and `forEach` on arrays.
   - Evaluates custom item expressions safely.

## Acceptance Criteria
- [ ] New tests run successfully via `npm test`.
- [ ] Edge cases tested (e.g. invalid JSON string, empty array, non-existent path).
- [ ] All tests pass without external dependencies.

## Difficulty
Beginner

## Suggested Labels
`testing`, `engine`, `good first issue`

## Relevant Files
- `src/lib/engine.ts`
- `src/lib/engine.test.ts`
