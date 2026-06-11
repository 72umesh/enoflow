export interface DocSection {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export const docSections: DocSection[] = [
  {
    id: "what-is-automation",
    title: "What is Workflow Automation?",
    icon: "Workflow",
    content: `Workflow automation is the process of designing a sequence of steps that run automatically when triggered. Instead of manually performing repetitive tasks, you define the logic once and let the system execute it every time.

**EnoFlow** makes this visual: you drag nodes onto a canvas, connect them with edges, and each node represents one step — a trigger, an action, a transformation, a condition, or an output.

Think of it like a flowchart that actually runs.`,
  },
  {
    id: "triggers",
    title: "Triggers — Starting a Flow",
    icon: "Play",
    content: `Every flow needs a starting point. Triggers are the nodes that kick off execution.

**Manual Trigger** — Click to run the flow. Great for testing and one-off executions.

**Webhook Trigger** — Simulates receiving an HTTP request. In a real system, this would be an actual endpoint that external services call.

**Schedule Trigger** — Simulates a cron-based trigger. In production, this would run on a schedule (every minute, hourly, daily, etc.).

A flow can have multiple triggers, but only one runs at a time during execution.`,
  },
  {
    id: "actions",
    title: "Actions — Doing Things",
    icon: "Zap",
    content: `Action nodes perform operations. They receive input from previous nodes and produce output for the next ones.

**Delay** — Pauses execution for a specified duration. Useful for rate limiting or simulating real-world timing.

**HTTP Request** — Simulates calling an external API. Configure the method, URL, and mock response. In a real system, this would make actual network calls.

**Code Block** — Execute custom JavaScript. Access the input data via the \`input\` variable and return your output. This is the most flexible node — you can implement any logic here.`,
  },
  {
    id: "transforms",
    title: "Transforms — Reshaping Data",
    icon: "ArrowRightLeft",
    content: `Transform nodes modify data as it flows through the system. They don't perform side effects — they just change the shape or content of the data.

**JSON Parser** — Parse JSON strings into objects, or stringify objects. You can also extract a specific path from the data.

**Text Formatter** — Apply text transformations: templates with \`{{variable}}\` placeholders, case changes (uppercase, lowercase), trimming, and reversing.

**Object Mapper** — Map fields from one object shape to another. Define a mapping like \`{"name": "user.name"}\` to extract nested fields.

**Array Iterator** — Process arrays with map, filter, or forEach operations. Write expressions that transform each item.`,
  },
  {
    id: "conditions",
    title: "Conditions — Branching Logic",
    icon: "GitBranch",
    content: `Condition nodes let your flow make decisions. They evaluate an expression and route data to different paths based on the result.

**Condition** has two outputs:
- **True path** (top output) — taken when the condition is met
- **False path** (bottom output) — taken when the condition is not met

You can configure conditions using:
- **Field-based**: Check if a field equals, contains, or compares to a value
- **Expression-based**: Write a custom JavaScript expression that returns true/false

This is how you add intelligence to your workflows.`,
  },
  {
    id: "outputs",
    title: "Outputs — Completing the Flow",
    icon: "CheckCircle",
    content: `Output nodes are the final destinations. They receive data and perform the final action.

**Local Storage** — Save data to the browser's local storage. Useful for persisting results between sessions.

**Webhook Response** — Simulate sending a response back to the caller. In a real system, this would be the HTTP response.

**Notification** — Show a browser notification with the flow results. Requests permission if not already granted.

Every flow should end with at least one output node.`,
  },
  {
    id: "connecting-nodes",
    title: "Connecting Nodes",
    icon: "Link",
    content: `Nodes are connected by dragging from an output handle (right side) to an input handle (left side). The connection represents data flowing from one node to the next.

**Rules:**
- Triggers have no inputs (they start the flow)
- Outputs have no outputs (they end the flow)
- One output can connect to multiple inputs (branching)
- One input can receive from multiple outputs (merging)

**Animated edges** show the direction of data flow. When you run the flow, edges light up to show execution progress.`,
  },
  {
    id: "execution",
    title: "Executing Flows",
    icon: "Play",
    content: `EnoFlow supports two execution modes:

**Full Execution** — Runs the entire flow from start to finish. All nodes execute in topological order (dependencies first). Watch the canvas as nodes light up green (success) or red (error).

**Step-by-Step Execution** — Runs one node at a time. Use the controls to advance through each step, inspect the input and output at each stage, and understand exactly what's happening.

Both modes show execution results in a panel where you can inspect the data at each node.`,
  },
  {
    id: "validation",
    title: "Flow Validation",
    icon: "ShieldCheck",
    content: `Before running a flow, EnoFlow validates it for common issues:

**Errors** (must fix):
- No trigger nodes — every flow needs a starting point
- Cyclic connections — flows must be acyclic (no loops)

**Warnings** (should review):
- Disconnected nodes — nodes with no incoming or outgoing connections
- Missing outputs — flows that don't end with an output node

Validation runs automatically when you click the validation button. Fix all errors before executing.`,
  },
  {
    id: "save-load",
    title: "Saving and Loading Flows",
    icon: "Save",
    content: `Flows are saved as JSON files that you can download and share.

**Save** — Exports the current flow as a \`.json\` file containing all nodes, edges, positions, and configuration.

**Load** — Import a previously saved flow file. This replaces the current flow.

**Templates** — Start from pre-built templates to learn common patterns. Templates are fully editable — modify them to fit your needs.

The JSON format is human-readable, so you can also edit flows in a text editor if needed.`,
  },
  {
    id: "tips",
    title: "Tips & Best Practices",
    icon: "Lightbulb",
    content: `**Start simple** — Begin with a manual trigger and a notification. Add complexity gradually.

**Use Code Block for custom logic** — When built-in nodes aren't enough, the Code Block node can implement any JavaScript logic.

**Test with Manual Trigger** — Always test your flow with a manual trigger before switching to webhook or schedule triggers.

**Name your nodes clearly** — Double-click a node label to rename it. Clear names make flows easier to understand.

**Inspect results** — After execution, click on any node to see its input and output data. This is invaluable for debugging.

**Save often** — Download your flow as JSON before making big changes. You can always reload if something goes wrong.`,
  },
];
