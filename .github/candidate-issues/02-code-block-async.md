# [BUG]: Code Block node does not await async/Promise returning functions

## Problem
In the Code Block node, if a user returns an asynchronous operation (such as `Promise.resolve(...)` or an `async` function / `fetch`), the node output is stored as a raw Promise object (`[object Promise]`) rather than the resolved value.

## Why
Users frequently need to write quick async transformations or API calls in Code Blocks. Having the promise unawaited means subsequent nodes receive a pending Promise instead of actual data.

## Current Behavior
In `src/lib/engine.ts` lines 140-145:
```ts
case "code-block": {
  const code = (config.code as string) || "return input;";
  const fn = new Function("input", "config", "results", code);
  output = fn(input, config, Object.fromEntries(this.results));
  break;
}
```
If `fn` returns a Promise, `output` is the Promise itself, not the resolved value.

## Expected Behavior
The engine should check if the returned output is a Promise/Thenable (`output instanceof Promise || (output && typeof output.then === "function")`), and `await` it before proceeding.

## Possible Approach
Modify the `code-block` case in `src/lib/engine.ts`:
```ts
case "code-block": {
  const code = (config.code as string) || "return input;";
  // Wrap in async function if needed or await the result
  const fn = new Function("input", "config", "results", `
    return (async () => {
      ${code.includes("return") ? code : `return (${code});`}
    })();
  `);
  output = await fn(input, config, Object.fromEntries(this.results));
  break;
}
```
Add timeout protection (e.g. `Promise.race` with 5000ms timeout) so infinite async calls do not hang the browser.

## Acceptance Criteria
- [ ] Returning `Promise.resolve({ foo: "bar" })` outputs `{ foo: "bar" }`.
- [ ] Async syntax `const data = await ...; return data;` works.
- [ ] Rejected promises properly catch and set the node status to `error`.
- [ ] Unit test added in `src/lib/engine.test.ts`.

## Difficulty
Beginner

## Suggested Labels
`bug`, `engine`, `good first issue`

## Relevant Files
- `src/lib/engine.ts`
- `src/lib/engine.test.ts`
