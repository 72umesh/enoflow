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

describe("Condition branch pruning", () => {
  function node(id: string, nodeType: NodeData["nodeType"], config: Record<string, unknown>): Node<NodeData> {
    return { id, position: { x: 0, y: 0 }, data: { label: id, nodeType, category: "action", config } };
  }

  function fixture(condition: boolean) {
    const nodes = [
      node("condition", "condition", { expression: String(condition) }),
      node("yes", "code-block", { code: 'return "yes";' }),
      node("no", "code-block", { code: 'return "no";' }),
      node("descendant", "code-block", { code: 'return "descendant";' }),
      node("join", "code-block", { code: 'return input;' }),
    ];
    const edges: Edge[] = [
      { id: "yes", source: "condition", target: "yes", sourceHandle: "true" },
      { id: "no", source: "condition", target: "no", sourceHandle: "false" },
      { id: "descendant", source: "no", target: "descendant" },
      { id: "join-yes", source: "yes", target: "join" },
      { id: "join-no", source: "no", target: "join" },
    ];
    return { nodes, edges };
  }

  it.each([true, false])("executes only the active path and rejoins it (%s)", async (condition) => {
    const { nodes, edges } = fixture(condition);
    const started: string[] = [];
    const errors: string[] = [];
    const engine = new FlowEngine();
    const results = await engine.executeFlow(nodes, edges, id => started.push(id), undefined, id => errors.push(id));
    const active = condition ? "yes" : "no";
    const inactive = condition ? "no" : "yes";
    expect(started).toContain(active);
    expect(started).not.toContain(inactive);
    expect(results.get(inactive)).toMatchObject({ skipped: true, output: undefined, duration: 0 });
    expect(results.get("join")?.output).toBe(active);
    if (condition) {
      expect(started).not.toContain("descendant");
      expect(results.get("descendant")).toMatchObject({ skipped: true });
    } else {
      expect(started).toContain("descendant");
    }
    expect(errors).toEqual([]);
  });

  it.each([true, false])("reports skipped nodes in step mode (%s)", async (condition) => {
    const { nodes, edges } = fixture(condition);
    const engine = new FlowEngine();
    const steps = [];
    for await (const step of engine.executeStepByStep(nodes, edges)) steps.push(step);
    const inactive = condition ? "no" : "yes";
    expect(steps.find(step => step.nodeId === inactive)).toMatchObject({ status: "skipped", output: undefined });
    expect(steps.find(step => step.nodeId === "join")?.output).toBe(condition ? "yes" : "no");
    expect(engine.getResults().get(inactive)).toMatchObject({ skipped: true });
  });

  it("does not invoke code on a skipped branch", async () => {
    const { nodes, edges } = fixture(true);
    nodes.find(n => n.id === "no")!.data.config.code = 'throw new Error("inactive side effect");';
    const errors: string[] = [];
    await new FlowEngine().executeFlow(nodes, edges, undefined, undefined, (_, error) => errors.push(error));
    expect(errors).toEqual([]);
  });

  it("preserves multiple active inputs while removing inactive inputs", async () => {
    const { nodes, edges } = fixture(true);
    nodes.push(node("other", "code-block", { code: 'return "other";' }));
    edges.push({ id: "other-join", source: "other", target: "join" });
    const results = await new FlowEngine().executeFlow(nodes, edges);
    expect(results.get("join")?.output).toEqual(["yes", "other"]);
  });

  it("propagates skipping through nested conditions", async () => {
    const { nodes, edges } = fixture(true);
    nodes.find(n => n.id === "no")!.data.nodeType = "condition";
    nodes.find(n => n.id === "no")!.data.config = { expression: "false" };
    edges.find(e => e.id === "descendant")!.sourceHandle = "false";
    const results = await new FlowEngine().executeFlow(nodes, edges);
    expect(results.get("descendant")).toMatchObject({ skipped: true });
    expect(results.get("join")?.output).toBe("yes");
  });

  it("recomputes skipped paths when the same engine runs again", async () => {
    const engine = new FlowEngine();
    const { nodes, edges } = fixture(true);
    const completed: string[] = [];
    await engine.executeFlow(nodes, edges, undefined, (id, result) => {
      if (result.skipped) completed.push(id);
    });
    expect(completed).toEqual(["no", "descendant"]);
    nodes[0].data.config.expression = "false";
    const results = await engine.executeFlow(nodes, edges);
    expect(results.get("yes")).toMatchObject({ skipped: true });
    expect(results.get("no")?.skipped).toBeUndefined();
    expect(results.get("join")?.output).toBe("no");
  });

});
