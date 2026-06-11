import { create } from "zustand";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from "@xyflow/react";
import { NodeData, FlowData, ExecutionResult, StepExecution } from "@/types";
import { generateId } from "./utils";

interface FlowState {
  // ── Flow data ─────────────────────────────────────────────────
  nodes: Node<NodeData>[];
  edges: Edge[];
  flowName: string;
  flowDescription: string;
  flowId: string;

  // ── UI state ──────────────────────────────────────────────────
  selectedNodeId: string | null;
  isExecuting: boolean;
  isStepMode: boolean;
  currentStepIndex: number;
  stepResults: StepExecution[];
  executionResults: Map<string, ExecutionResult>;
  showResults: boolean;
  showValidation: boolean;

  // ── Actions ───────────────────────────────────────────────────
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<NodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  removeNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setFlowName: (name: string) => void;
  setFlowDescription: (desc: string) => void;

  // ── Execution ─────────────────────────────────────────────────
  setExecuting: (executing: boolean) => void;
  setExecutionResults: (results: Map<string, ExecutionResult>) => void;
  setNodeResult: (nodeId: string, result: ExecutionResult) => void;
  setNodeStatus: (nodeId: string, status: NodeData["status"], error?: string) => void;
  clearResults: () => void;
  setShowResults: (show: boolean) => void;
  setShowValidation: (show: boolean) => void;

  // ── Step mode ─────────────────────────────────────────────────
  setStepMode: (mode: boolean) => void;
  addStepResult: (step: StepExecution) => void;
  resetSteps: () => void;
  setCurrentStepIndex: (index: number) => void;

  // ── Flow operations ───────────────────────────────────────────
  loadFlow: (flow: FlowData) => void;
  exportFlow: () => FlowData;
  newFlow: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────
  nodes: [],
  edges: [],
  flowName: "Untitled Flow",
  flowDescription: "",
  flowId: generateId(),

  selectedNodeId: null,
  isExecuting: false,
  isStepMode: false,
  currentStepIndex: -1,
  stepResults: [],
  executionResults: new Map(),
  showResults: false,
  showValidation: false,

  // ── React Flow handlers ────────────────────────────────────────
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<NodeData>[] });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const edge: Edge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}-${generateId()}`,
      animated: true,
      style: { strokeWidth: 2 },
    };
    set({ edges: addEdge(edge, get().edges) });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } }
          : n
      ),
    });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setFlowName: (name) => set({ flowName: name }),
  setFlowDescription: (desc) => set({ flowDescription: desc }),

  // ── Execution ──────────────────────────────────────────────────
  setExecuting: (executing) => set({ isExecuting: executing }),

  setExecutionResults: (results) => set({ executionResults: results, showResults: true }),

  setNodeResult: (nodeId, result) => {
    const results = new Map(get().executionResults);
    results.set(nodeId, result);
    set({ executionResults: results });
  },

  setNodeStatus: (nodeId, status, error) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, status, error } }
          : n
      ),
    });
  },

  clearResults: () => {
    set({
      executionResults: new Map(),
      stepResults: [],
      currentStepIndex: -1,
      showResults: false,
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle" as const, result: undefined, error: undefined },
      })),
    });
  },

  setShowResults: (show) => set({ showResults: show }),
  setShowValidation: (show) => set({ showValidation: show }),

  // ── Step mode ──────────────────────────────────────────────────
  setStepMode: (mode) => set({ isStepMode: mode }),

  addStepResult: (step) => {
    set({ stepResults: [...get().stepResults, step] });
  },

  resetSteps: () => {
    set({
      stepResults: [],
      currentStepIndex: -1,
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle" as const, result: undefined, error: undefined },
      })),
    });
  },

  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  // ── Flow operations ────────────────────────────────────────────
  loadFlow: (flow) => {
    set({
      flowId: flow.id,
      flowName: flow.name,
      flowDescription: flow.description || "",
      nodes: flow.nodes.map((n) => ({
        ...n,
        type: "custom",
        data: { ...n.data, status: "idle" },
      })),
      edges: flow.edges.map((e) => ({
        ...e,
        animated: true,
        style: { strokeWidth: 2 },
      })),
      executionResults: new Map(),
      stepResults: [],
      currentStepIndex: -1,
      showResults: false,
    });
  },

  exportFlow: () => {
    const { nodes, edges, flowName, flowDescription, flowId } = get();
    return {
      id: flowId,
      name: flowName,
      description: flowDescription,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type || "custom",
        position: n.position,
        data: n.data,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        animated: e.animated,
        label: typeof e.label === "string" ? e.label : undefined,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0.0",
    };
  },

  newFlow: () => {
    set({
      flowId: generateId(),
      flowName: "Untitled Flow",
      flowDescription: "",
      nodes: [],
      edges: [],
      executionResults: new Map(),
      stepResults: [],
      currentStepIndex: -1,
      selectedNodeId: null,
      showResults: false,
      showValidation: false,
    });
  },
}));
