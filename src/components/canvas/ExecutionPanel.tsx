"use client";

import { useFlowStore } from "@/lib/store";
import { formatDuration, cn } from "@/lib/utils";
import {
  X, CheckCircle, XCircle, Clock, ChevronRight, ChevronDown,
  Loader2, Trash2, Footprints, Copy, Check,
} from "lucide-react";
import { useState } from "react";

function CopyJsonButton({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);

  if (data === undefined || data === null) return null;

  const textToCopy = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#313244] transition-colors"
      title={copied ? "Copied!" : "Copy JSON"}
    >
      {copied ? (
        <>
          <Check className="w-2.5 h-2.5 text-emerald-400" />
          <span className="text-emerald-400 text-[9px] font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-2.5 h-2.5" />
          <span className="text-[9px]">Copy</span>
        </>
      )}
    </button>
  );
}

export default function ExecutionPanel() {
  const {
    executionResults, stepResults, showResults, setShowResults,
    isStepMode, currentStepIndex, clearResults, nodes,
  } = useFlowStore();
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  if (!showResults && stepResults.length === 0) return null;

  const resultEntries = Array.from(executionResults.entries());
  const hasResults = resultEntries.length > 0 || stepResults.length > 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#181825] border-t border-[#313244] z-10 max-h-[300px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#313244]">
        <Footprints className="w-3.5 h-3.5 text-[#8b5cf6]" />
        <span className="text-xs font-semibold text-white flex-1">
          Execution Results
          {isStepMode && (
            <span className="ml-2 text-[10px] text-[#8b5cf6] font-normal">
              Step {currentStepIndex + 1} of {stepResults.length}
            </span>
          )}
        </span>
        <span className="text-[10px] text-gray-500">
          {resultEntries.length || stepResults.length} node{(resultEntries.length || stepResults.length) !== 1 ? "s" : ""}
        </span>
        {hasResults && (
          <button
            onClick={() => { clearResults(); }}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
            title="Clear results"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => setShowResults(false)}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isStepMode && stepResults.length > 0 ? (
          <div className="p-2 space-y-1">
            {stepResults.map((step, i) => {
              const node = nodes.find((n) => n.id === step.nodeId);
              const isExpanded = expandedNode === step.nodeId;

              return (
                <div
                  key={`${step.nodeId}-${i}`}
                  className={cn(
                    "rounded-lg border transition-all",
                    step.status === "completed" && "border-emerald-500/20 bg-emerald-500/5",
                    step.status === "error" && "border-red-500/20 bg-red-500/5",
                    step.status === "running" && "border-blue-500/20 bg-blue-500/5",
                    (step.status === "pending" || step.status === "skipped") && "border-[#313244] bg-[#1e1e2e]",
                    i === currentStepIndex && "ring-1 ring-[#8b5cf6]/50"
                  )}
                >
                  <button
                    onClick={() => setExpandedNode(isExpanded ? null : step.nodeId)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5"
                  >
                    {step.status === "completed" && <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                    {step.status === "error" && <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />}
                    {step.status === "running" && <Loader2 className="w-3 h-3 text-blue-400 animate-spin flex-shrink-0" />}
                    {step.status === "skipped" && <span className="text-[10px] text-gray-400">Skipped</span>}
                    {step.status === "pending" && <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                    <span className="text-[11px] font-medium text-white flex-1 text-left truncate">
                      {node?.data.label || step.nodeId}
                    </span>
                    <span className="text-[10px] text-gray-500">{formatDuration(step.duration)}</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                  </button>

                  {isExpanded && (
                    <div className="px-2.5 pb-2 space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Input</p>
                          <CopyJsonButton data={step.input} />
                        </div>
                        <pre className="text-[10px] text-gray-300 bg-[#11111b] rounded p-1.5 overflow-auto max-h-[80px] font-mono whitespace-pre-wrap break-all">
                          {step.input !== undefined ? JSON.stringify(step.input, null, 2) : "(none)"}
                        </pre>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Output</p>
                          <CopyJsonButton data={step.output} />
                        </div>
                        <pre className="text-[10px] text-gray-300 bg-[#11111b] rounded p-1.5 overflow-auto max-h-[80px] font-mono whitespace-pre-wrap break-all">
                          {step.output !== undefined ? JSON.stringify(step.output, null, 2) : "(none)"}
                        </pre>
                      </div>
                      {step.error && (
                        <div>
                          <p className="text-[10px] text-red-400 uppercase tracking-wider mb-0.5">Error</p>
                          <p className="text-[10px] text-red-300">{step.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : hasResults ? (
          <div className="p-2 space-y-1">
            {resultEntries.map(([nodeId, result]) => {
              const node = nodes.find((n) => n.id === nodeId);
              const isExpanded = expandedNode === nodeId;

              return (
                <div
                  key={nodeId}
                  className={cn(
                    "rounded-lg border transition-all",
                    result.skipped
                      ? "border-[#313244] bg-[#1e1e2e]"
                      : result.error
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-emerald-500/20 bg-emerald-500/5"
                  )}
                >
                  <button
                    onClick={() => setExpandedNode(isExpanded ? null : nodeId)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5"
                  >
                    {result.skipped ? (
                      <span className="text-[10px] text-gray-400">Skipped</span>
                    ) : result.error ? (
                      <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    )}
                    <span className="text-[11px] font-medium text-white flex-1 text-left truncate">
                      {node?.data.label || nodeId}
                    </span>
                    <span className="text-[10px] text-gray-500">{formatDuration(result.duration)}</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                  </button>

                  {isExpanded && (
                    <div className="px-2.5 pb-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Output</p>
                        {!result.skipped && !result.error && <CopyJsonButton data={result.output} />}
                      </div>
                      <pre className="text-[10px] text-gray-300 bg-[#11111b] rounded p-1.5 overflow-auto max-h-[120px] font-mono whitespace-pre-wrap break-all">
                        {result.skipped
                          ? "Inactive condition branch"
                          : result.error
                          ? `Error: ${result.error}`
                          : JSON.stringify(result.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6">
            <p className="text-xs text-gray-500">No results yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
