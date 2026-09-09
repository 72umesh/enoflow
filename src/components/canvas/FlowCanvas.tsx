"use client";

import { useCallback, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowStore } from "@/lib/store";
import { nodeDefinitionMap } from "@/lib/node-definitions";
import { generateId } from "@/lib/utils";
import { NodeData } from "@/types";
import CustomNode from "@/components/nodes/CustomNode";
import CustomEdge from "@/components/edges/CustomEdge";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const triggerDef = nodeDefinitionMap["manual-trigger"];

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

    const newNode: Node<NodeData> = {
      id: `node-${generateId()}`,
      type: "custom",
      position,
      data: {
        label: triggerDef.label,
        nodeType: triggerDef.type,
        category: triggerDef.category,
        config: { ...triggerDef.defaultData },
        status: "idle",
      },
    };

    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  const handleBrowseTemplates = useCallback(() => {
    router.push("/templates");
  }, [router]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
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
        <Controls
          className="!bg-[#1e1e2e] !border-[#313244] !shadow-lg !rounded-lg"
          showInteractive={false}
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

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-[#181825]/90 border border-[#313244] rounded-2xl p-6 max-w-sm text-center backdrop-blur shadow-2xl pointer-events-auto">
            <h3 className="text-base font-semibold text-white mb-1">
              Start Your Workflow
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Drag a Trigger node from the left panel onto the canvas, or start
              from a template.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleAddManualTrigger}
                className="text-xs font-medium text-white bg-[#313244] hover:bg-[#45475a] rounded-lg px-3 py-2 transition-colors"
              >
                Add Manual Trigger
              </button>
              <button
                onClick={handleBrowseTemplates}
                className="text-xs font-medium text-white border border-[#45475a] bg-transparent hover:bg-[#313244] rounded-lg px-3 py-2 transition-colors"
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
