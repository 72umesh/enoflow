# [FEATURE]: Add Workflow Template Preview Modal in Templates Page

## Problem
On the `/templates` page, clicking a template's "Use Template" button immediately loads it into the canvas and navigates away to `/editor`. Users have no way to inspect the flow's nodes, triggers, or diagram structure before choosing to load it over their current canvas.

## Why
Users want to preview what nodes and connections are inside a template before replacing whatever workflow they might currently have in progress. A preview modal with a mini node map and step-by-step summary improves confidence and template discoverability.

## Expected Behavior
1. Add a "Preview" button on each template card on `/templates`.
2. Clicking "Preview" opens an interactive modal overlay containing:
   - Template title, description, category, and difficulty tag.
   - Node breakdown: list of all included nodes with their icons and categories.
   - Flow outline / sequence summary.
   - "Use This Template" primary button (loads flow and navigates to editor).
   - "Cancel / Close" button.
3. Accessible via keyboard (`Esc` closes modal).

## Possible Approach
1. In `src/app/templates/page.tsx`:
   - Create a `TemplatePreviewModal` component.
   - Inspect `template.flow.nodes` and `template.flow.edges` to display sequence tags.

## Acceptance Criteria
- [ ] Clicking "Preview" opens clean Catppuccin modal without navigating.
- [ ] Lists all included nodes with icons and types.
- [ ] "Use Template" from modal successfully loads the flow into the store and navigates to `/editor`.
- [ ] Modal closes on background click or `Escape` key.

## Difficulty
Intermediate

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/app/templates/page.tsx`
- `src/data/templates.ts`
