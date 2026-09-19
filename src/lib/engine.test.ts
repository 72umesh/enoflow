import { describe, it, expect, vi, afterEach } from "vitest";
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

describe("Code block async execution", () => {
  afterEach(() => vi.useRealTimers());

  function codeNode(code: string, id = "code"): Node<NodeData> {
    return {
      id, position: { x: 0, y: 0 },
      data: { label: id, nodeType: "code-block", category: "action", config: { code } },
    };
  }

  it.each([
    'return Promise.resolve({ foo: "bar" });',
    'const data = await Promise.resolve({ foo: "bar" }); return data;',
    'return { then(resolve) { resolve({ foo: "bar" }); } };',
    'return { foo: "bar" };',
  ])("stores resolved output and passes it downstream: %s", async (code) => {
    vi.useFakeTimers();
    const complete = vi.fn();
    const results = await new FlowEngine().executeFlow(
      [codeNode(code), codeNode('return input.foo + ":" + results.code.output.foo;', "next")],
      [{ id: "edge", source: "code", target: "next" }], undefined, complete,
    );
    expect(results.get("code")?.output).toEqual({ foo: "bar" });
    expect(results.get("next")?.output).toBe("bar:bar");
    expect(complete.mock.calls[0][1].output).toEqual({ foo: "bar" });
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['return Promise.reject(new Error("failed"));', 'throw new Error("failed");']) (
    "records failures and invokes the error callback: %s", async (code) => {
      vi.useFakeTimers();
      const error = vi.fn();
      const complete = vi.fn();
      const results = await new FlowEngine().executeFlow([codeNode(code)], [], undefined, complete, error);
      expect(results.get("code")).toMatchObject({ output: undefined, error: "failed" });
      expect(error).toHaveBeenCalledWith("code", "failed");
      expect(complete).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it("resolves outputs and reports rejected promises in step mode", async () => {
    const engine = new FlowEngine();
    const steps = [];
    for await (const step of engine.executeStepByStep([
      codeNode('return Promise.resolve({ foo: "bar" });'),
      codeNode('return Promise.reject(new Error("failed"));', "bad"),
    ], [])) steps.push(step);
    expect(steps[0]).toMatchObject({ status: "completed", output: { foo: "bar" } });
    expect(engine.getResults().get("code")?.output).toEqual({ foo: "bar" });
    expect(steps[1]).toMatchObject({ status: "error", error: "failed" });
    expect(engine.getResults().get("bad")?.error).toBe("failed");
  });

  it("times out a pending promise and continues the flow", async () => {
    vi.useFakeTimers();
    const error = vi.fn();
    const pending = new FlowEngine().executeFlow([
      codeNode('return new Promise(() => {});'), codeNode('return "done";', "next"),
    ], [], undefined, undefined, error);
    await vi.advanceTimersByTimeAsync(4999);
    expect(error).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    const results = await pending;
    expect(error).toHaveBeenCalledWith("code", "Code block timed out after 5000ms");
    expect(results.get("code")?.error).toBe("Code block timed out after 5000ms");
    expect(results.get("next")?.output).toBe("done");
    expect(vi.getTimerCount()).toBe(0);
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

describe("csv-to-json transform node", () => {
  it("parses standard comma-separated values into array of objects with headers", async () => {
    const csv = "name,age,city\nAlice,25,Jakarta\nBob,30,Bandung";
    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "CSV",
          nodeType: "csv-to-json",
          category: "transform",
          config: { delimiter: ",", hasHeader: true, trimValues: true },
        },
      },
    ];
    const engine = new FlowEngine();
    // @ts-expect-error testing private execution
    const output = await engine.executeNode(nodes[0], csv);
    expect(output).toEqual([
      { name: "Alice", age: "25", city: "Jakarta" },
      { name: "Bob", age: "30", city: "Bandung" },
    ]);
  });

  it("handles quoted fields with commas and escaped quotes correctly", async () => {
    const csv = 'product,description,price\nLaptop,"Powerful, sleek design",1500\nPhone,"6.5"" OLED, 128GB",800';
    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "CSV",
          nodeType: "csv-to-json",
          category: "transform",
          config: { delimiter: ",", hasHeader: true, trimValues: true },
        },
      },
    ];
    const engine = new FlowEngine();
    // @ts-expect-error testing private execution
    const output = await engine.executeNode(nodes[0], csv);
    expect(output).toEqual([
      { product: "Laptop", description: "Powerful, sleek design", price: "1500" },
      { product: "Phone", description: '6.5" OLED, 128GB', price: "800" },
    ]);
  });

  it("handles custom delimiters such as semicolon and tab", async () => {
    const csv = "id;name;role\n1;Admin;superadmin\n2;Guest;viewer";
    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "CSV",
          nodeType: "csv-to-json",
          category: "transform",
          config: { delimiter: ";", hasHeader: true },
        },
      },
    ];
    const engine = new FlowEngine();
    // @ts-expect-error testing private execution
    const output = await engine.executeNode(nodes[0], csv);
    expect(output).toEqual([
      { id: "1", name: "Admin", role: "superadmin" },
      { id: "2", name: "Guest", role: "viewer" },
    ]);
  });

  it("returns 2D string array when hasHeader is false", async () => {
    const csv = "a,b\nc,d";
    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "CSV",
          nodeType: "csv-to-json",
          category: "transform",
          config: { delimiter: ",", hasHeader: false },
        },
      },
    ];
    const engine = new FlowEngine();
    // @ts-expect-error testing private execution
    const output = await engine.executeNode(nodes[0], csv);
    expect(output).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("extracts CSV from object payload if path is configured", async () => {
    const payload = { file: { content: "sku,qty\nA101,5\nB202,12" } };
    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "CSV",
          nodeType: "csv-to-json",
          category: "transform",
          config: { path: "file.content", delimiter: ",", hasHeader: true },
        },
      },
    ];
    const engine = new FlowEngine();
    // @ts-expect-error testing private execution
    const output = await engine.executeNode(nodes[0], payload);
    expect(output).toEqual([
      { sku: "A101", qty: "5" },
      { sku: "B202", qty: "12" },
    ]);
  });

  it("handles empty or invalid inputs gracefully", async () => {
    const nodes: Node<NodeData>[] = [
      {
        id: "t1",
        position: { x: 0, y: 0 },
        data: {
          label: "CSV",
          nodeType: "csv-to-json",
          category: "transform",
          config: {},
        },
      },
    ];
    const engine = new FlowEngine();
    // @ts-expect-error testing private execution
    const output = await engine.executeNode(nodes[0], "");
    expect(output).toEqual([]);
  });
});
