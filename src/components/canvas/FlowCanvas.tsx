"use client";

import { useCallback, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  useViewport,
  ReactFlowProvider,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Sparkles, Play, Plus, Minus, Maximize2 } from "lucide-react";

import { useFlowStore } from "@/lib/store";
import { nodeDefinitionMap } from "@/lib/node-definitions";
import { generateId } from "@/lib/utils";
import { NodeData } from "@/types";
import CustomNode from "@/components/nodes/CustomNode";
import CustomEdge from "@/components/edges/CustomEdge";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const triggerDef = nodeDefinitionMap["manual-trigger"];

function CanvasZoomToolbar() {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center bg-[#1e1e2e]/95 border border-[#313244] rounded-lg shadow-xl backdrop-blur p-1 gap-0.5 text-white">
      <button
        onClick={() => zoomOut()}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#313244] text-gray-400 hover:text-white transition-colors"
        title="Zoom Out"
        type="button"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => zoomTo(1)}
        className="px-2 h-7 flex items-center justify-center rounded hover:bg-[#313244] text-[11px] font-medium text-gray-300 hover:text-white transition-colors font-mono min-w-[48px]"
        title="Reset Zoom to 100%"
        type="button"
      >
        {zoomPercent}%
      </button>

      <button
        onClick={() => zoomIn()}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#313244] text-gray-400 hover:text-white transition-colors"
        title="Zoom In"
        type="button"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#313244] mx-1" />

      <button
        onClick={() => fitView({ padding: 0.2 })}
        className="px-2 h-7 flex items-center gap-1 rounded hover:bg-[#313244] text-[11px] text-gray-400 hover:text-white transition-colors"
        title="Fit All Nodes"
        type="button"
      >
        <Maximize2 className="w-3 h-3" />
        <span className="text-[10px] hidden sm:inline">Fit View</span>
      </button>
    </div>
  );
}

function FlowCanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
  } = useFlowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const router = useRouter();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/enoflow-node");
      if (!nodeType) return;

      const def = nodeDefinitionMap[nodeType];
      if (!def) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<NodeData> = {
        id: `node-${generateId()}`,
        type: "custom",
        position,
        data: {
          label: def.label,
          nodeType: def.type,
          category: def.category,
          config: { ...def.defaultData },
          status: "idle",
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleAddManualTrigger = useCallback(() => {
    if (!triggerDef) return;

    const wrapper = reactFlowWrapper.current;
    const screenAlignCenter = wrapper
      ? {
          x: wrapper.getBoundingClientRect().left + wrapper.clientWidth / 2,
          y: wrapper.getBoundingClientRect().top + wrapper.clientHeight / 2,
        }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const position = screenToFlowPosition(screenAlignCenter);

    const newNodeId = `node-${generateId()}`;
    const newNode: Node<NodeData> = {
      id: newNodeId,
      type: "custom",
      position: {
        x: position.x - 110,
        y: position.y - 40,
      },
      data: {
        label: triggerDef.label,
        nodeType: triggerDef.type,
        category: triggerDef.category,
        config: { ...triggerDef.defaultData },
        status: "idle",
      },
    };

    addNode(newNode);
    selectNode(newNodeId);
  }, [screenToFlowPosition, addNode, selectNode]);

  const handleBrowseTemplates = useCallback(() => {
    router.push("/templates");
  }, [router]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2, stroke: "#6b7280" },
          type: "custom",
        }}
        fitView
        className="bg-[#11111b]"
        deleteKeyCode={["Backspace", "Delete"]}
        selectionOnDrag
        panOnScroll
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#313244"
        />
        <MiniMap
          className="!bg-[#181825] !border-[#313244]"
          nodeColor={(node) => {
            const data = node.data as NodeData;
            const def = nodeDefinitionMap[data.nodeType];
            return def?.color || "#6b7280";
          }}
          maskColor="rgba(17, 17, 27, 0.8)"
          style={{ background: "#181825" }}
        />
      </ReactFlow>

      <CanvasZoomToolbar />

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="bg-[#181825]/95 border border-[#313244] rounded-2xl p-6 max-w-sm text-center backdrop-blur shadow-2xl pointer-events-auto"
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Start Your Workflow
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Drag a Trigger node from the left panel onto the canvas, or start
              from a template.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleAddManualTrigger}
                className="text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg px-3.5 py-2 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Add Manual Trigger
              </button>
              <button
                onClick={handleBrowseTemplates}
                className="text-xs font-medium text-gray-300 hover:text-white border border-[#313244] hover:border-[#45475a] bg-[#1e1e2e]/50 hover:bg-[#313244] rounded-lg px-3.5 py-2 transition-colors"
              >
                Browse Templates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
