"use client";

import Link from "next/link";
import {
  Workflow, Play, Zap, ArrowRight, GitBranch, Code, Database,
  Clock, Globe, List, Braces, Type, Send, Bell, Timer,
  ArrowRightLeft, Shield, Footprints, Download,
  Sparkles, Layout,
} from "lucide-react";

const features = [
  {
    icon: Play,
    title: "Visual Flow Builder",
    description: "Drag and drop nodes onto a canvas. Connect them visually to build automation workflows.",
    color: "#10b981",
  },
  {
    icon: Zap,
    title: "Built-in Execution Engine",
    description: "Run flows entirely in the browser with a JSON-based engine. No server or AI API required.",
    color: "#f59e0b",
  },
  {
    icon: Footprints,
    title: "Step-by-Step Debugging",
    description: "Execute flows one node at a time. Inspect inputs and outputs at every stage.",
    color: "#8b5cf6",
  },
  {
    icon: Shield,
    title: "Flow Validation",
    description: "Automatic validation checks for disconnected nodes, missing triggers, and cyclic errors.",
    color: "#ef4444",
  },
  {
    icon: Download,
    title: "Save & Share",
    description: "Export flows as JSON files. Import them later or share with your team.",
    color: "#06b6d4",
  },
  {
    icon: Layout,
    title: "Ready-Made Templates",
    description: "Start from pre-built templates for common patterns like webhook processing and data pipelines.",
    color: "#ec4899",
  },
];

const nodeCategories = [
  {
    title: "Triggers",
    color: "#10b981",
    nodes: [
      { icon: Play, name: "Manual Trigger" },
      { icon: Globe, name: "Webhook Trigger" },
      { icon: Clock, name: "Schedule Trigger" },
    ],
  },
  {
    title: "Actions",
    color: "#f59e0b",
    nodes: [
      { icon: Timer, name: "Delay" },
      { icon: Globe, name: "HTTP Request" },
      { icon: Code, name: "Code Block" },
    ],
  },
  {
    title: "Transforms",
    color: "#8b5cf6",
    nodes: [
      { icon: Braces, name: "JSON Parser" },
      { icon: Type, name: "Text Formatter" },
      { icon: ArrowRightLeft, name: "Object Mapper" },
      { icon: List, name: "Array Iterator" },
    ],
  },
  {
    title: "Conditions",
    color: "#ef4444",
    nodes: [
      { icon: GitBranch, name: "Condition" },
    ],
  },
  {
    title: "Outputs",
    color: "#06b6d4",
    nodes: [
      { icon: Database, name: "Local Storage" },
      { icon: Send, name: "Webhook Response" },
      { icon: Bell, name: "Notification" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#11111b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#11111b]/80 backdrop-blur-xl border-b border-[#313244]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">EnoFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#nodes" className="text-sm text-gray-400 hover:text-white transition-colors">Nodes</a>
            <Link href="/templates" className="text-sm text-gray-400 hover:text-white transition-colors">Templates</Link>
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</Link>
          </nav>
          <Link
            href="/editor"
            className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            Open Editor
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8b5cf6]/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span className="text-xs text-[#8b5cf6] font-medium">Visual Workflow Automation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent leading-tight">
            Build Workflows
            <br />
            <span className="bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] bg-clip-text text-transparent">
              Visually
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            EnoFlow is a lightweight, educational workflow automation builder.
            Drag triggers, actions, transforms, and conditions onto a canvas —
            then execute your flow entirely in the browser.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/editor"
              className="px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#8b5cf6]/25"
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/templates"
              className="px-6 py-3 bg-[#1e1e2e] hover:bg-[#262637] text-white font-semibold rounded-xl transition-all border border-[#313244]"
            >
              View Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why EnoFlow?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A tool that teaches automation concepts through visual building, not just configuration.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl bg-[#181825] border border-[#313244] hover:border-[#8b5cf6]/30 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${f.color}15` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Node Catalog */}
      <section id="nodes" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">14 Built-in Nodes</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every node type you need to build real workflows — from triggers to outputs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodeCategories.map((cat) => (
            <div
              key={cat.title}
              className="p-5 rounded-xl bg-[#181825] border border-[#313244]"
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: cat.color }}
                />
                <h3 className="text-sm font-semibold text-white">{cat.title}</h3>
              </div>
              <div className="space-y-2">
                {cat.nodes.map((n) => (
                  <div
                    key={n.name}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#1e1e2e]"
                  >
                    <n.icon className="w-4 h-4" style={{ color: cat.color }} />
                    <span className="text-xs text-gray-200">{n.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Three steps to your first automated workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Drag & Connect",
              description: "Drag nodes from the palette onto the canvas. Connect outputs to inputs to define the flow of data.",
              icon: Workflow,
            },
            {
              step: "02",
              title: "Configure",
              description: "Click any node to configure its settings. Set URLs, write code, define conditions, and customize behavior.",
              icon: Code,
            },
            {
              step: "03",
              title: "Execute & Debug",
              description: "Run the full flow or step through it one node at a time. Inspect data at every stage.",
              icon: Play,
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <div className="text-xs text-[#8b5cf6] font-bold mb-2">STEP {item.step}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center p-12 rounded-2xl bg-gradient-to-b from-[#8b5cf6]/10 to-transparent border border-[#8b5cf6]/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Open the editor, drag your first trigger, and see how workflow automation works under the hood.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#8b5cf6]/25"
          >
            Launch Editor
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#313244] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-[#8b5cf6]" />
            <span className="text-sm font-semibold">EnoFlow</span>
            <span className="text-xs text-gray-500">v0.1.0</span>
          </div>
          <p className="text-xs text-gray-500">
            A lightweight workflow automation builder. Built with Next.js, React Flow, and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
