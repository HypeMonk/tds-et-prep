# Learn

The full material — course content with the theory layer the exam actually tests, plus the professor's own revision-session walkthroughs.

## The six official exam topics — where each lives

The end-term's official study guide names six topics. Every one is covered below — read the week section to *learn* it, the short note to *revise* it:

| Official topic | Learn it | Revise it |
|---|---|---|
| **1. Observability & Monitoring** (metrics, percentiles, readiness, AI cost) | [Week 6 — reading metrics](../weeks/week-6.md#reading-metrics-correctly-averages-lie-percentiles-dont) | [Data & ML](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont) |
| **2. Data Pipeline Integrity** (identity, idempotency, provenance) | [Week 6 — pipeline integrity](../weeks/week-6.md#data-pipeline-integrity-five-properties-of-a-pipeline-you-can-trust) | [Data & ML](../topics/data-ml.md#data-pipeline-integrity-the-five-properties) |
| **3. CI/CD & Release Security** (secret isolation, supply chain, rollouts) | [Week 7 — release security](../weeks/week-7.md#release-security-four-things-cicd-must-get-right) | [Git, security & practices](../topics/git-security.md#release-security-what-cicd-must-get-right) |
| **4. Reliable AI/LLM Systems** (verify output, authz in code) | [Week 3 — reliability discipline](../weeks/week-3.md#reliability-discipline-for-llm-systems) | [LLMs & prompting](../topics/llm-prompting.md#reliability-discipline-for-llm-systems) |
| **5. Web/API/Infra Fundamentals** (statelessness, error design, delegated access) | [Week 2 — the four new sections](../weeks/week-2.md#statelessness-durable-storage-why-servers-are-allowed-to-die) | [Web & APIs](../topics/web-apis.md#statelessness-durable-storage-why-servers-are-allowed-to-die) |
| **6. Applied AI Judgment** | [The grading guide](../exam/llm-grading-guide.md) — it *is* the topic | same |

## Week notes

Read in course order, or jump to the weeks the [frequency table](../pyqs/index.md#the-priority-list-how-often-each-topic-is-asked) says matter most for you.

| Week | Topic | Time | Examinability |
|---|---|---|---|
| [Bridge](../weeks/week-bridge.md) | Terminal, virtualenv, HTTP basics, git basics | ~8 min | 🔥 assumed knowledge |
| [W1](../weeks/week-1.md) | Git workflow, SQLite, HTTP clients, data formats, bash | ~20 min | 🔥🔥 every paper |
| [W2](../weeks/week-2.md) | FastAPI, CORS, caching, secrets, Docker, deployment | ~25 min | 🔥🔥🔥 highest density |
| [W3](../weeks/week-3.md) | Prompt anatomy, system/user prompts, Structured Outputs, embeddings | ~20 min | 🔥🔥 asked + growing |
| [W4](../weeks/week-4.md) | RAG pipeline, chunking, retrieval, grounding, stale docs | ~18 min | 🔥🔥 new — expect fresh questions |
| [W5](../weeks/week-5.md) | asyncio, agents, tools, sandboxing, MCP, memory | ~18 min | 🔥 new — GA-tested heavily |
| [W6](../weeks/week-6.md) | DuckDB/Parquet, rate limits, dedup, Playwright, ethics | ~18 min | 🔥 asked across papers |
| [W7](../weeks/week-7.md) | Prompt injection, OWASP LLM Top 10, serverless, CI/CD, Terraform | ~20 min | 🔥🔥 new — GA-tested |
| [W8](../weeks/week-8.md) | BigQuery ML, MLflow, finetuning, quantization, HuggingFace | ~15 min | 🔥 new — GA-tested |

!!! tip "New weeks are not less important"
    W4 (RAG), W5 (Agents), and W8 (ML platforms) have **no PYQ history** — but
    that's because they're **new this term**, not because they're less examinable.
    The professor said "patterns changed" and the GAs test these heavily. Expect
    the exam to lean on fresh content.

## Revision sessions

The professor's own paper walkthroughs, kept as primary source:

- **[ET-1](../sessions/et-01.md)** — solved the T1-2026 AN paper live (27 Aug 2026)
- **[ET-2](../sessions/et-02.md)** — solved the T3-2025 FN paper live (28 Aug 2026) · **the LLM-grading reveal**
- **[ET-3](../sessions/et-03.md)** — no paper: the exam format itself (3 Sept 2026) · **the 50% subjective split**

More sessions will be appended as they happen.
