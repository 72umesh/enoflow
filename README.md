# EnoFlow — Visual Workflow Automation Builder

A lightweight, educational workflow automation builder inspired by tools like n8n, but intentionally simpler, more visual, and easier to understand.

![EnoFlow](https://img.shields.io/badge/EnoFlow-v0.1.0-8b5cf6?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiLz48L3N2Zz4=)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Screenshots

<!-- TODO: Add screenshots -->
<!-- ![Landing Page](./screenshots/landing.png) -->
<!-- ![Editor](./screenshots/editor.png) -->
<!-- ![Templates](./screenshots/templates.png) -->
<!-- ![Docs](./screenshots/docs.png) -->

## Overview

EnoFlow lets you build automation workflows visually by dragging nodes onto a canvas and connecting them with edges. Each node represents a step in your workflow — a trigger, action, transform, condition, or output. The entire flow executes in the browser using a built-in JSON-based engine.

**Key differentiators:**
- 🎓 Educational — teaches automation concepts through visual building
- 🖥️ Client-side — no server, no AI API, runs entirely in the browser
- 🧩 14 built-in nodes — triggers, actions, transforms, conditions, outputs
- 🐛 Step-by-step debugging — inspect data at every stage
- ✅ Flow validation — catches errors before execution
- 📦 JSON export/import — save, share, and reload flows

## Features

### Visual Flow Builder
- Drag-and-drop node placement
- Connect nodes by dragging between handles
- Animated edges showing data flow direction
- Minimap for navigation
- Zoom and pan controls

### 14 Built-in Nodes

| Category | Nodes |
|----------|-------|
| **Triggers** | Manual Trigger, Webhook Trigger, Schedule Trigger |
| **Actions** | Delay, HTTP Request, Code Block |
| **Transforms** | JSON Parser, Text Formatter, Object Mapper, Array Iterator |
| **Conditions** | Condition (with true/false branches) |
| **Outputs** | Local Storage, Webhook Response, Notification |

### Execution Engine
- Topological sort ensures correct execution order
- Full flow execution with real-time status updates
- Step-by-step mode for debugging
- Per-node input/output inspection
- Error handling with visual feedback

### Flow Management
- Save flows as JSON files
- Load flows from JSON files
- 6 ready-made templates
- Flow validation with error/warning reporting

### Documentation
- Comprehensive docs page
- Explains triggers, actions, transforms, conditions, and outputs
- Best practices and tips
- Quick navigation between sections

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Node Editor**: React Flow (@xyflow/react)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/enoflow.git
cd enoflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── editor/
│   │   └── page.tsx          # Flow editor page
│   ├── templates/
│   │   └── page.tsx          # Templates gallery
│   └── docs/
│       └── page.tsx          # Documentation
├── components/
│   ├── canvas/
│   │   ├── FlowCanvas.tsx    # Main canvas component
│   │   ├── FlowToolbar.tsx   # Editor toolbar
│   │   ├── NodePalette.tsx   # Node sidebar
│   │   ├── PropertiesPanel.tsx # Node properties
│   │   ├── ExecutionPanel.tsx  # Execution results
│   │   └── ValidationPanel.tsx # Validation results
│   ├── nodes/
│   │   └── CustomNode.tsx    # Custom React Flow node
│   └── edges/
│       └── CustomEdge.tsx    # Custom React Flow edge
├── lib/
│   ├── engine.ts             # Flow execution engine
│   ├── store.ts              # Zustand state store
│   ├── node-definitions.ts   # Node type definitions
│   └── utils.ts              # Utility functions
├── data/
│   ├── templates.ts          # Flow templates
│   └── docs.ts               # Documentation content
└── types/
    └── index.ts              # TypeScript type definitions
```

## How It Works

1. **Build** — Drag nodes from the palette onto the canvas. Connect outputs to inputs.
2. **Configure** — Click any node to configure its settings (URLs, code, conditions, etc.).
3. **Execute** — Run the full flow or step through it one node at a time.
4. **Inspect** — View execution results, input/output data, and error messages.

## Templates

EnoFlow includes 6 pre-built templates:

- **Hello World** — Simplest flow: trigger → notification
- **Webhook Processor** — Parse webhook data, check conditions, respond
- **Data Pipeline** — Fetch → parse → transform → store
- **Text Transform Chain** — Multiple text transformations
- **Scheduled Report** — Simulate scheduled job with report generation
- **Array Processing** — Demonstrate array map/filter operations

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

### Other Platforms

EnoFlow is a standard Next.js app and can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with `npm run build && npm start`

## Roadmap

- [ ] Custom node types (user-defined)
- [ ] Subflows and flow composition
- [ ] Variable store and secrets management
- [ ] Real webhook endpoint integration
- [ ] Flow versioning and history
- [ ] Collaborative editing
- [ ] Plugin system for third-party nodes
- [ ] Mobile-responsive editor
- [ ] Dark/light theme toggle
- [ ] Flow analytics and monitoring

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Flow](https://reactflow.dev/) — The node editor library
- [n8n](https://n8n.io/) — Inspiration for workflow automation
- [Next.js](https://nextjs.org/) — The React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Lucide](https://lucide.dev/) — Beautiful icons
