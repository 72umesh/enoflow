"use client";

import { useFlowStore } from "@/lib/store";
import { validateFlow } from "@/lib/engine";
import { cn } from "@/lib/utils";
import { X, AlertTriangle, XCircle, CheckCircle, ShieldCheck } from "lucide-react";

export default function ValidationPanel() {
  const { showValidation, setShowValidation, nodes, edges, selectNode } = useFlowStore();

  if (!showValidation) return null;

  const result = validateFlow(nodes, edges);

  return (
    <div className="absolute top-14 right-72 w-80 bg-[#181825] border border-[#313244] rounded-xl shadow-2xl z-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#313244]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#8b5cf6]" />
        <span className="text-xs font-semibold text-white flex-1">Validation Results</span>
        {result.valid ? (
          <span className="text-[10px] text-emerald-400 font-medium">Valid</span>
        ) : (
          <span className="text-[10px] text-red-400 font-medium">Issues Found</span>
        )}
        <button
          onClick={() => setShowValidation(false)}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[300px] overflow-y-auto">
        {result.errors.length === 0 && result.warnings.length === 0 ? (
          <div className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-emerald-400 font-medium">Flow is valid!</p>
            <p className="text-[10px] text-gray-500 mt-1">No issues detected</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {result.errors.map((err, i) => (
              <button
                key={`err-${i}`}
                onClick={() => err.nodeId && selectNode(err.nodeId)}
                className={cn(
                  "w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-colors",
                  "bg-red-500/5 hover:bg-red-500/10",
                  err.nodeId && "cursor-pointer"
                )}
              >
                <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-red-300">{err.message}</p>
                  {err.nodeId && <p className="text-[10px] text-red-400/60 mt-0.5">Click to select</p>}
                </div>
              </button>
            ))}
            {result.warnings.map((warn, i) => (
              <button
                key={`warn-${i}`}
                onClick={() => warn.nodeId && selectNode(warn.nodeId)}
                className={cn(
                  "w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-colors",
                  "bg-yellow-500/5 hover:bg-yellow-500/10",
                  warn.nodeId && "cursor-pointer"
                )}
              >
                <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] text-yellow-300">{warn.message}</p>
                  {warn.nodeId && <p className="text-[10px] text-yellow-400/60 mt-0.5">Click to select</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
