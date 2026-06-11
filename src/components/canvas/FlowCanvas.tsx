"use client";

import { useCallback, useRef, DragEvent } from "react";
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

function FlowCanvasInner() {
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, selectNode,
  } = useFlowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

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
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

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
