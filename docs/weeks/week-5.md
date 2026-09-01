# Week 5 — Agents & async systems

<div class="tx-meta" markdown>

~18 min read · Examinable: 🔥 (asyncio is directly asked; agents are new-but-GA-tested) · GA5 · [ET-1 session](../sessions/et-01.md)

</div>

The agent week — the newest frontier with no PYQ history but heavy GA testing. asyncio.gather from here is one of the most reliably repeated exam questions. The agent concepts (tools, guardrails, sandboxes, MCP) are the new content the exam will likely lean on.

Course files: agent fundamentals · agent evaluation · agent memory · async/parallelism · loop engineering · MCP · multi-agent systems · sandboxing · specialized agents · tool calling.

---

## asyncio — the exam's concurrency questions

### The key terms

| Term | Simple meaning |
|---|---|
| **Synchronous** | Finish one task before starting the next |
| **Asynchronous** | Work on another task while waiting |
| **Concurrency** | Several tasks make progress during the same period |
| **Parallelism** | Several tasks run at the exact same time |

### The gather arithmetic — know it cold

```python
results = await asyncio.gather(call_api("A"), call_api("B"), call_api("C"))
```

`asyncio.gather` launches all tasks **simultaneously** and returns only when **every task completes**.

!!! success "Must remember — the professor's arithmetic"
    5 requests: 4 finish in 1 second, 1 takes 10 seconds.
    **Total: 10 seconds** — not 5 (the average), not 1 (the fastest), not 14
    (the sequential sum). Gather is gated by the **slowest** task.

    Concurrency removes the *sum*, not the *max*. One slow dependency holds
    everything hostage — which is why production code wraps each call in
    `asyncio.wait_for(..., timeout=...)`.

!!! warning "Trap — the hanging server"
    In the scenario version ([T1-AN Q21](../pyqs/t1-2026-an.md#q21-asynciogather-with-a-hanger)),
    one downstream node hangs for 60 seconds and the **entire server process
    halts** — gather can't return until every task finishes. The fix is per-call
    timeouts, not "more parallelism."

<div class="tx-anchor" markdown>

**Asked in:** [T1-AN Q21 — the hanging server](../pyqs/t1-2026-an.md#q21-asynciogather-with-a-hanger) · [T1-FN Q7 — the timing question](../pyqs/t1-2026-fn.md#q7-asynciogather-timing) · [ET-1 session](../sessions/et-01.md#asynciogather-the-bottleneck-arithmetic)

</div>

---

## Agent fundamentals — the loop and the parts

**What an agent is:** a model that can **choose and use tools repeatedly** to finish a goal. The difference from a chatbot:

| Chatbot | Agent |
|---|---|
| One response per turn | Multiple steps toward a goal |
| Returns text | Can search, calculate, edit, call APIs |
| User guides each turn | Agent chooses the next step |
| Low autonomy | Controlled autonomy |

### The agent loop

```
Goal → Decide next step → Use a tool → Observe result → (repeat until done) → Final answer
```

### The parts that matter for the exam

| Part | Purpose | The exam question |
|---|---|---|
| **Goal** | Defines what "done" means | "What stops the agent from running forever?" |
| **Tools** | Let the agent interact with systems | "What can the agent actually do?" — LLM06 |
| **Rules** | Limit permissions, steps, time, cost | "What's the budget/loop guardrail?" — GA5 |
| **Verifier** | Checks whether the result is correct | "How do you know it worked?" |

→ GA5: `agent-tool-guardrail-server`, `agent-budget-loop-guardrail-server`

---

## Tool calling — how agents act

**What it is:** the model outputs a structured request to use a tool ("search for X", "run this SQL"), your code executes it, and the result goes back to the model.

```python
tools = [
    {"name": "search", "description": "Search the knowledge base", "parameters": {...}},
    {"name": "calculator", "description": "Evaluate a math expression", "parameters": {...}},
]
```

**The security principle from W7 applies here:** tools should be **allow-listed** (deny by default) and destructive actions should require human approval. An agent that can `send_email` unsupervised is LLM06 — Excessive Agency.

→ GA5: `agent-tool-guardrail-server`

---

## Sandboxing — containing what agents can break

**The problem:** an agent that executes code or browses the web can damage your system, exfiltrate data, or get exploited.

**The solution:** run the agent's actions in a **sandbox** — an isolated environment where the worst it can do is contained:

| Sandbox type | What it isolates |
|---|---|
| **Container** (Docker) | Filesystem, processes, network |
| **VM** | The entire OS |
| **LXC** | Lightweight container isolation |
| **Cloud sandbox** | Ephemeral, auto-destroyed |

→ GA5: `lxd-sandbox-live-server`

---

## MCP — Model Context Protocol

**What it is:** a standard protocol for connecting LLMs to external tools and data sources. Instead of writing custom integrations for every tool, MCP provides a common interface.

**The exam angle:** MCP appears in GA5's `mcp-server-live-server` — know that it's the **standardized way agents connect to tools**, the "USB-C of AI integrations."

---

## Agent memory — state across steps

Agents need to remember what they've done:

| Memory type | What it holds | Lifetime |
|---|---|---|
| **Working memory** | Current task, recent results | One session |
| **Episodic memory** | Past interactions, what worked | Across sessions |
| **Semantic memory** | Knowledge, facts, learned patterns | Persistent |

**The exam connection:** memory is what makes an agent *not* repeat the same failed approach — it observes, remembers, and tries differently.

---

## Multi-agent systems — when one isn't enough

**The pattern:** split a complex goal across multiple agents, each with a specialised role:

- **Router** — sends each request to the right specialist
- **Workers** — each handles one type of task
- **Coordinator** — combines results into a final answer

**The exam angle:** this connects to the API gateway pattern ([T1-FN Q26–28](../pyqs/t1-2026-fn.md#q26-who-routes-the-request)) — centralized routing, specialized backends, one entry point. Same architecture, different layer.

---

## Self-check — can you answer these without looking?

??? question "1. asyncio.gather runs 5 tasks: 4 take 1s, 1 takes 10s. Total time?"
    **10 seconds.** Gather waits for the slowest — concurrency replaces the sum
    with the max, but the max is still the ceiling.

??? question "2. What's the difference between a chatbot and an agent?"
    A chatbot produces one response per turn. An agent **chooses and uses tools
    repeatedly** to finish a goal — decide, act, observe, repeat.

??? question "3. Why do agents need guardrails on their tool access?"
    Without limits, an agent can take destructive actions unsupervised (LLM06 —
    Excessive Agency). Allow-list tools by default; require human approval for
    destructive ones.

??? question "4. What is sandboxing and why does it matter for agents?"
    Running agent actions in an **isolated environment** (container, VM) so the
    worst a compromised agent can do is contained — it can't damage your host
    system or exfiltrate data.
