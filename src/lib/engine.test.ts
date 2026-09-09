import { describe, it, expect } from "vitest";
import { FlowEngine, validateFlow } from "./engine";
import { Node, Edge } from "@xyflow/react";
import { NodeData } from "@/types";

describe("validateFlow", () => {
  it("should fail validation if there are no trigger nodes", () => {
    const nodes: Node<NodeData>[] = [
      {
        id: "action-1",
        position: { x: 0, y: 0 },
        data: {
          label: "Delay",
          nodeType: "delay",
          category: "action",
          config: { duration: 100 },
        },
      },
    ];
    const edges: Edge[] = [];

    const result = validateFlow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.message.includes("at least one trigger"))).toBe(true);
  });

  it("should detect cyclic dependency in flow", () => {
    const nodes: Node<NodeData>[] = [
      {
        id: "n1",
        position: { x: 0, y: 0 },
        data: { label: "Trigger", nodeType: "manual-trigger", category: "trigger", config: {} },
      },
      {
        id: "n2",
        position: { x: 100, y: 0 },
        data: { label: "Delay", nodeType: "delay", category: "action", config: {} },
      },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n2", target: "n1" }, // cycle
    ];

    const result = validateFlow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.message.includes("cycle"))).toBe(true);
  });

  it("should pass validation for valid trigger and action sequence", () => {
    const nodes: Node<NodeData>[] = [
      {
        id: "trigger-1",
        position: { x: 0, y: 0 },
        data: { label: "Start", nodeType: "manual-trigger", category: "trigger", config: {} },
      },
      {
        id: "action-1",
        position: { x: 200, y: 0 },
        data: { label: "Format", nodeType: "text-formatter", category: "transform", config: { operation: "uppercase" } },
      },
      {
        id: "output-1",
        position: { x: 400, y: 0 },
        data: { label: "Notify", nodeType: "notification", category: "output", config: { title: "Done" } },
      },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "action-1", target: "output-1" },
    ];

    const result = validateFlow(nodes, edges);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("FlowEngine Execution", () => {
  it("should execute nodes in topological order and pass data downstream", async () => {
    const engine = new FlowEngine();

    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "Trigger",
          nodeType: "manual-trigger",
          category: "trigger",
          config: { data: "hello world" },
        },
      },
      {
        id: "fmt",
        position: { x: 200, y: 0 },
        data: {
          label: "Uppercase",
          nodeType: "text-formatter",
          category: "transform",
          config: { operation: "uppercase" },
        },
      },
    ];

    const edges: Edge[] = [{ id: "e1", source: "t1", target: "fmt" }];

    const executionOrder: string[] = [];
    const results = await engine.executeFlow(
      nodes,
      edges,
      (nodeId) => executionOrder.push(nodeId)
    );

    expect(executionOrder).toEqual(["t1", "fmt"]);
    expect(results.get("t1")?.output).toHaveProperty("trigger", "manual");
  });
});
