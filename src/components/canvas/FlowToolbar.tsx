"use client";

import { useFlowStore } from "@/lib/store";
import { FlowEngine } from "@/lib/engine";
import { downloadJson } from "@/lib/utils";
import {
  Play, ShieldCheck, Upload, FilePlus,
  RotateCcw, Footprints, Loader2, Download,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Node, Edge } from "@xyflow/react";
import { NodeData } from "@/types";

export default function FlowToolbar() {
  const {
    nodes, edges, flowName, setFlowName, isExecuting, setExecuting,
    setExecutionResults, setNodeStatus, setNodeResult, clearResults,
    setShowValidation, setStepMode, addStepResult,
    resetSteps, setCurrentStepIndex, exportFlow, loadFlow, newFlow,
    setShowResults,
  } = useFlowStore();

  const [isRunningSteps, setIsRunningSteps] = useState(false);
  const engineRef = useRef<FlowEngine | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Full Execution ────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (isExecuting) {
      engineRef.current?.abort();
      setExecuting(false);
      return;
    }

    clearResults();
    setExecuting(true);
    setShowResults(true);
    const engine = new FlowEngine();
    engineRef.current = engine;

    // Mark all nodes as idle
    for (const n of nodes) {
      setNodeStatus(n.id, "idle");
    }

    try {
      await engine.executeFlow(
        nodes as Node<NodeData>[],
        edges as Edge[],
        (nodeId) => setNodeStatus(nodeId, "running"),
        (nodeId, result) => {
          setNodeStatus(nodeId, "success");
          setNodeResult(nodeId, result);
          // Store result in node data for display
          const store = useFlowStore.getState();
          store.updateNodeData(nodeId, { result: result.output, executionTime: result.duration });
        },
        (nodeId, error) => {
          setNodeStatus(nodeId, "error", error);
        }
      );
      setExecutionResults(engine.getResults());
    } catch {
      // Errors are handled per-node
    } finally {
      setExecuting(false);
    }
  }, [nodes, edges, isExecuting, clearResults, setExecuting, setShowResults, setNodeStatus, setNodeResult, setExecutionResults]);

  // ── Step-by-step ──────────────────────────────────────────────
  const handleStepMode = useCallback(async () => {
    if (isRunningSteps) return;

    resetSteps();
    setStepMode(true);
    setShowResults(true);
    setIsRunningSteps(true);

    const engine = new FlowEngine();
    let stepIndex = 0;

    for (const n of nodes) {
      setNodeStatus(n.id, "idle");
    }

    try {
      for await (const step of engine.executeStepByStep(nodes as Node<NodeData>[], edges as Edge[])) {
        addStepResult(step);
        setCurrentStepIndex(stepIndex);
        setNodeStatus(step.nodeId, step.status === "completed" ? "success" : step.status === "error" ? "error" : "running");
        if (step.output !== undefined) {
          useFlowStore.getState().updateNodeData(step.nodeId, { result: step.output, executionTime: step.duration });
        }
        stepIndex++;
        // Small delay between steps for visual effect
        await new Promise((r) => setTimeout(r, 300));
      }
      setExecutionResults(engine.getResults());
    } catch {
      // Errors handled per-step
    } finally {
      setIsRunningSteps(false);
    }
  }, [nodes, edges, isRunningSteps, resetSteps, setStepMode, setShowResults, addStepResult, setCurrentStepIndex, setNodeStatus, setExecutionResults]);

  // ── Save/Load ─────────────────────────────────────────────────
  const handleSave = () => {
    const flow = exportFlow();
    downloadJson(flow, `${flow.name.replace(/\s+/g, "-").toLowerCase()}.json`);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const flow = JSON.parse(text);
      loadFlow(flow);
    } catch {
      alert("Invalid flow file");
    }
    e.target.value = "";
  };

  return (
    <div className="h-12 bg-[#181825] border-b border-[#313244] flex items-center px-3 gap-2 z-20">
      {/* Flow Name */}
      <input
        type="text"
        value={flowName}
        onChange={(e) => setFlowName(e.target.value)}
        className="bg-transparent text-sm font-semibold text-white border-none outline-none max-w-[200px] placeholder-gray-500"
        placeholder="Untitled Flow"
      />

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleRun}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isExecuting
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run Flow
            </>
          )}
        </button>

        <button
          onClick={handleStepMode}
          disabled={isRunningSteps || isExecuting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#8b5cf6]/20 text-[#8b5cf6] hover:bg-[#8b5cf6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Footprints className="w-3.5 h-3.5" />
          Step
        </button>

        <div className="w-px h-5 bg-[#313244] mx-1" />

        <button
          onClick={() => setShowValidation(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1e1e2e] transition-all"
          title="Validate flow"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1e1e2e] transition-all"
          title="Save flow"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleLoad}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1e1e2e] transition-all"
          title="Load flow"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => { if (confirm("Start a new flow? Unsaved changes will be lost.")) newFlow(); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1e1e2e] transition-all"
          title="New flow"
        >
          <FilePlus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={clearResults}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#1e1e2e] transition-all"
          title="Clear results"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
