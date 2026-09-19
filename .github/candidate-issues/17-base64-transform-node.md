# [FEATURE]: Implement Base64 Encode / Decode transformation node

## Problem
When integrating webhooks or APIs that transmit binary payloads, Basic Auth credentials (`Basic base64(user:pass)`), or encoded file contents, users currently have no native way to encode or decode Base64 strings without writing custom script in a `Code Block`.

## Why
Base64 encoding/decoding is a foundational utility in API automation and data transformation pipelines. A dedicated `Base64` node provides a clean, visual, and zero-code way to prepare authentication headers or decode payloads.

## Expected Behavior
A new Transform node called `Base64 Transform`:
- **Category**: `transform`
- **Icon**: `Binary` from `lucide-react`
- **Color**: `#8b5cf6`
- **Inputs**: 1
- **Outputs**: 1
- **Configurable fields**:
  - `operation`: Select dropdown (`encode` or `decode`).
  - `path`: Optional dot-notation field path if input is an object.
  - `urlSafe`: Boolean (default `false`) — handles URL-safe base64 characters (`-` and `_` instead of `+` and `/`).
- **Output**: The encoded or decoded string result.

## Possible Approach
1. Register definition in `src/lib/node-definitions.ts`.
2. Add `Binary` icon to `CustomNode.tsx`.
3. Add configuration inputs in `src/components/canvas/PropertiesPanel.tsx`.
4. In `src/lib/engine.ts`, implement UTF-8 safe base64 encoding/decoding (e.g. using `btoa`/`atob` with `encodeURIComponent` / `TextEncoder` / `TextDecoder`).
5. Write unit tests in `src/lib/engine.test.ts`.

## Acceptance Criteria
- [ ] Correctly encodes standard UTF-8 strings to Base64.
- [ ] Correctly decodes Base64 strings back to original text.
- [ ] Handles URL-safe base64 formatting when enabled.
- [ ] Catches malformed base64 decode strings gracefully and returns an error without crashing.
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
