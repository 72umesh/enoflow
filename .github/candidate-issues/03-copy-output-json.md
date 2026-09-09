# [UI/UX]: Add one-click "Copy JSON" button in ExecutionPanel

## Problem
In `ExecutionPanel.tsx`, when inspecting the Input or Output data of executed nodes, users must manually click, highlight, and copy text from the `<pre>` blocks.

## Why
For large JSON objects or arrays, manual highlighting is tedious, prone to missing closing brackets, and hurts the debugging workflow experience.

## Current Behavior
The panel displays input/output inside static `<pre>` blocks:
```tsx
<pre className="text-[10px] text-gray-300 bg-[#11111b] rounded p-1.5 overflow-auto max-h-[80px] font-mono whitespace-pre-wrap break-all">
  {step.input !== undefined ? JSON.stringify(step.input, null, 2) : "(none)"}
</pre>
```

## Expected Behavior
Provide a compact "Copy" button in the upper right corner of each JSON display box. Clicking the button:
1. Copies the formatted JSON string to the user's clipboard (`navigator.clipboard.writeText`).
2. Changes the icon temporarily to a checkmark (`Check` from `lucide-react`) for ~1.5 seconds.
3. Shows a subtle tooltip ("Copied!").

## Possible Approach
1. Create a lightweight reusable component `CopyJsonButton({ text }: { text: string })`:
   ```tsx
   function CopyJsonButton({ text }: { text: string }) {
     const [copied, setCopied] = useState(false);
     const handleCopy = () => {
       navigator.clipboard.writeText(text);
       setCopied(true);
       setTimeout(() => setCopied(false), 1500);
     };
     return (
       <button onClick={handleCopy} className="text-gray-400 hover:text-white p-0.5">
         {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
       </button>
     );
   }
   ```
2. Integrate this button in `ExecutionPanel.tsx` next to the "INPUT" and "OUTPUT" labels.

## Acceptance Criteria
- [ ] Clicking copy button correctly copies JSON to clipboard.
- [ ] Visual confirmation shown for 1.5 seconds.
- [ ] Gracefully disabled or hidden if data is `undefined` or `"(none)"`.
- [ ] Verified on Chrome and Firefox.

## Difficulty
Beginner

## Suggested Labels
`enhancement`, `ui/ux`, `good first issue`

## Relevant Files
- `src/components/canvas/ExecutionPanel.tsx`
