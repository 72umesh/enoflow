// ─── Node Data Types ───────────────────────────────────────────────
export type NodeCategory = 'trigger' | 'action' | 'transform' | 'condition' | 'output';

export interface NodeDefinition {
  type: string;
  label: string;
  category: NodeCategory;
  description: string;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
  defaultData: Record<string, unknown>;
}

export interface NodeData {
  label: string;
  nodeType: string;
  category: NodeCategory;
  config: Record<string, unknown>;
  result?: unknown;
  status?: 'idle' | 'running' | 'success' | 'error';
  error?: string;
  executionTime?: number;
  [key: string]: unknown;
}

// ─── Flow Types ────────────────────────────────────────────────────
export interface FlowData {
  id: string;
  name: string;
  description?: string;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface SerializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
  width?: number;
  height?: number;
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  label?: string;
}

// ─── Execution Types ───────────────────────────────────────────────
export interface ExecutionContext {
  nodeId: string;
  input: unknown;
  config: Record<string, unknown>;
  variables: Record<string, unknown>;
  executionId: string;
}

export interface ExecutionResult {
  nodeId: string;
  output: unknown;
  error?: string;
  duration: number;
  timestamp: string;
}

export interface FlowExecution {
  id: string;
  flowId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  results: Map<string, ExecutionResult>;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface StepExecution {
  nodeId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  input: unknown;
  output: unknown;
  error?: string;
  duration: number;
}

// ─── Template Types ────────────────────────────────────────────────
export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  flow: FlowData;
}

// ─── Validation Types ──────────────────────────────────────────────
export interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
