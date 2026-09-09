# Contributing to EnoFlow

First off, thank you for considering contributing to **EnoFlow**! 🎉 

EnoFlow is an educational, browser-native workflow automation builder designed to make visual programming and data flow concepts easy to understand. Whether you're fixing a bug, adding documentation, writing tests, or proposing a brand-new workflow node, your help is warmly welcomed.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Finding Something to Work On](#finding-something-to-work-on)
3. [Contributor Ladder](#contributor-ladder)
4. [Local Development Setup](#local-development-setup)
5. [Project Architecture Overview](#project-architecture-overview)
6. [How to Add a New Node Type (4 Steps)](#how-to-add-a-new-node-type)
7. [Testing & Quality Checks](#testing--quality-checks)
8. [Submitting a Pull Request](#submitting-a-pull-request)
9. [Community & Questions](#community--questions)

---

## Code of Conduct

This project adheres to the [Contributor Covenant](.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior via the security contacts or private channels.

---

## Finding Something to Work On

We welcome contributions of all sizes! Browse our [Issues](https://github.com/AlphaIsYour/enoflow/issues) to find tasks:

* **`good first issue`**: Perfect for newcomers! These tasks are well-scoped, have defined boundaries, and can usually be completed in a few hours.
* **`help wanted`**: Problems or enhancements where community assistance is actively needed.
* **`documentation`**: Improvements to README, guides, or in-app node documentation.
* **`node-proposal`**: Opportunities to implement a new action, transform, or trigger node.

> 💡 **Tip:** If you plan to work on an issue, please leave a comment saying *"I'd like to work on this!"* so maintainers can assign it to you and avoid duplicate work.

---

## Contributor Ladder

We believe in supporting contributors from their very first PR to long-term ownership:

* 🟢 **Level 1 — First-Time Contributor**: Minor bug fixes, documentation clarifications, UI polish (e.g. adding copy buttons, improving tooltips).
* 🟡 **Level 2 — Regular Contributor**: Implementing new nodes (Math, CSV parser, etc.), adding test coverage, refactoring components.
* 🟠 **Level 3 — Advanced Contributor**: Engine optimizations (branch pruning, step-mode enhancements, subflow execution).
* 🟣 **Level 4 — Core Maintainer**: Triage incoming issues, review PRs, and help steer the project roadmap.

---

## Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) v18 or higher (v20+ recommended)
* `npm`, `pnpm`, or `bun`

### Steps

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/enoflow.git
   cd enoflow
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser. The canvas editor is located at [http://localhost:3000/editor](http://localhost:3000/editor).

---

## Project Architecture Overview

Understanding the directory structure makes navigating the codebase simple:

```text
src/
├── app/
│   ├── page.tsx               # Landing page
│   ├── editor/page.tsx        # Workflow canvas editor page
│   ├── templates/page.tsx     # Workflow templates gallery
│   └── docs/page.tsx          # Interactive documentation
├── components/
│   ├── canvas/
│   │   ├── FlowCanvas.tsx     # React Flow canvas wrapper
│   │   ├── FlowToolbar.tsx    # Header toolbar (run, step, save, load)
│   │   ├── NodePalette.tsx    # Left sidebar containing draggable nodes
│   │   ├── PropertiesPanel.tsx# Right sidebar for configuring selected nodes
│   │   ├── ExecutionPanel.tsx # Bottom drawer for execution results & steps
│   │   └── ValidationPanel.tsx# Bottom drawer for flow linting / errors
│   ├── nodes/CustomNode.tsx   # Custom React Flow visual node component
│   └── edges/CustomEdge.tsx   # Custom animated connection edge
├── lib/
│   ├── engine.ts              # FlowEngine: topological sort & execution
│   ├── node-definitions.ts    # Central registry of all 14+ node types
│   ├── store.ts               # Zustand store managing flow state
│   └── utils.ts               # Helper utilities & class merging (cn)
├── types/index.ts             # TypeScript definitions
└── data/                      # Static presets (templates, doc content)
```

---

## How to Add a New Node Type

Adding a new node to EnoFlow is modular and straightforward. Follow these 4 steps:

### Step 1: Register in `src/lib/node-definitions.ts`
Add your node definition to the `nodeDefinitions` array:
```ts
{
  type: "math-operation",
  label: "Math Operation",
  category: "transform",
  description: "Perform arithmetic calculations on numbers",
  icon: "Calculator", // Name of icon from lucide-react
  color: "#8b5cf6",
  inputs: 1,
  outputs: 1,
  defaultData: {
    label: "Math Operation",
    operation: "add",
    operand: 10,
  },
}
```

### Step 2: Implement Execution Logic in `src/lib/engine.ts`
Inside `executeNode(node, input)` in `FlowEngine`:
```ts
case "math-operation": {
  const num = Number(input) || 0;
  const op = config.operation || "add";
  const val = Number(config.operand) || 0;
  output = op === "add" ? num + val : num - val;
  break;
}
```

### Step 3: Add Property Form in `src/components/canvas/PropertiesPanel.tsx`
Render configuration controls (inputs, dropdowns) for your node:
```tsx
{selectedNode.data.nodeType === "math-operation" && (
  <div>
    <label className="text-xs text-gray-400">Operation</label>
    <select ...>...</select>
  </div>
)}
```

### Step 4: Add a Unit Test in `src/lib/engine.test.ts`
Verify that your node behaves as expected when executed.

---

## Testing & Quality Checks

Before pushing changes or opening a PR, always verify that your code passes all checks:

```bash
# 1. Typecheck with TypeScript
npm run typecheck

# 2. Run unit tests
npm test

# 3. Lint the codebase
npm run lint

# 4. Verify production build
npm run build
```

---

## Submitting a Pull Request

1. Create a descriptive branch:
   ```bash
   git checkout -b feat/math-operation-node
   # or
   git checkout -b fix/condition-branching
   ```
2. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   * `feat: add math operation node`
   * `fix: prevent inactive condition branch execution`
   * `docs: update setup guide in README`
   * `test: add unit tests for text-formatter`
3. Push to your fork:
   ```bash
   git push origin feat/math-operation-node
   ```
4. Open a Pull Request against `master`.
5. Fill out the Pull Request template. If applicable, attach screenshots or a short GIF of your changes in action.

### What to Expect from Maintainers
* **Respectful Review**: We appreciate your time and effort! Reviews are constructive, supportive, and intended to help.
* **Fast Feedback**: We aim to review PRs within 48-72 hours.
* **Recognition**: All contributors are credited in the `README.md` and release notes.

---

## Community & Questions

Have a question, idea, or need help?
* Open a discussion in [GitHub Discussions](https://github.com/AlphaIsYour/enoflow/discussions).
* Ask in the relevant issue thread.

Happy automating! 🚀
