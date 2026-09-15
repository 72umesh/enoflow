# [UI/UX]: Add Light and Dark theme toggle with persistence

## Problem
EnoFlow currently has hardcoded dark mode colors across all pages and canvas components (using Catppuccin Mocha `#11111b`, `#181825`, `#1e1e2e`, etc.). Users working in brightly lit environments or who prefer light themes for accessibility have no option to switch modes.

## Why
Modern web applications and Developer Tools almost universally provide theme options (System, Dark, Light). Supporting light and dark themes makes EnoFlow much more pleasant, accessible, and professional.

## Expected Behavior
1. Add a theme switcher icon button (Sun/Moon) to the top navigation header and `/editor` toolbar.
2. Toggle between:
   - `dark` (default Catppuccin Mocha dark theme)
   - `light` (clean, high-contrast Catppuccin Latte light theme or neutral slate palette)
   - `system` (follows user's OS preference)
3. Persist user preference in `localStorage`.
4. Prevent flash of unstyled theme on page load.
5. Canvas background dots, grid lines, nodes, and mini-map colors smoothly adapt to the active theme.

## Possible Approach
1. Use `next-themes` or CSS class-based theming on `<html>` (`class="dark"`).
2. Define CSS variable tokens in `src/app/globals.css` for canvas background, panel cards, borders, and text colors.
3. Update `FlowCanvas.tsx` background variant and minimap mask to read the current theme.

## Acceptance Criteria
- [ ] Theme toggle button in header and editor toolbar.
- [ ] Toggling theme instantly updates header, sidebar palette, canvas grid, node cards, and panels.
- [ ] Selected theme persists across page refreshes and routes.
- [ ] Zero flicker on initial page render.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `ui/ux`

## Relevant Files
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/canvas/FlowCanvas.tsx`
- `src/components/canvas/FlowToolbar.tsx`
