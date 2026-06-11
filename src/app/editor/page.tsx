"use client";

import FlowCanvas from "@/components/canvas/FlowCanvas";
import NodePalette from "@/components/canvas/NodePalette";
import PropertiesPanel from "@/components/canvas/PropertiesPanel";
import FlowToolbar from "@/components/canvas/FlowToolbar";
import ExecutionPanel from "@/components/canvas/ExecutionPanel";
import ValidationPanel from "@/components/canvas/ValidationPanel";
import { useFlowStore } from "@/lib/store";
import Link from "next/link";
import { ArrowLeft, Workflow } from "lucide-react";

export default function EditorPage() {
  const { selectedNodeId } = useFlowStore();

  return (
    <div className="h-screen flex flex-col bg-[#11111b] overflow-hidden">
      {/* Top Bar */}
      <div className="h-10 bg-[#181825] border-b border-[#313244] flex items-center px-3 gap-3 z-30">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-[11px]">Home</span>
        </Link>
        <div className="w-px h-4 bg-[#313244]" />
        <div className="flex items-center gap-1.5">
          <Workflow className="w-4 h-4 text-[#8b5cf6]" />
          <span className="text-xs font-bold text-white tracking-wide">EnoFlow</span>
        </div>
        <div className="flex-1" />
        <Link
          href="/templates"
          className="text-[11px] text-gray-400 hover:text-white transition-colors"
        >
          Templates
        </Link>
        <Link
          href="/docs"
          className="text-[11px] text-gray-400 hover:text-white transition-colors"
        >
          Docs
        </Link>
      </div>

      {/* Toolbar */}
      <FlowToolbar />

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Node Palette */}
        <NodePalette />

        {/* Center: Canvas */}
        <div className="flex-1 relative">
          <FlowCanvas />
          <ExecutionPanel />
          <ValidationPanel />
        </div>

        {/* Right: Properties */}
        {selectedNodeId && <PropertiesPanel />}
      </div>
    </div>
  );
}
