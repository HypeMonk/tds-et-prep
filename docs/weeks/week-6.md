# Week 6 — Scraping, extraction & data at scale

<div class="tx-meta" markdown>

~18 min read · Examinable: 🔥 (DuckDB/Parquet, rate limits, dedup — asked across papers) · GA6 · [ET-2 session](../sessions/et-02.md)

</div>

The data extraction week — 22 course files covering everything from Playwright to OSINT. The exam cares about three things: **DuckDB + Parquet, rate limits + caching, and change detection/dedup**. These connect directly to the ETL and data-engineering questions in the papers.

Course files: anti-bot patterns · authenticated scraping · change detection/dedup · Cloudflare bot · document parsing · DuckDB/Parquet · Google dork · hidden JSON APIs · HTML-to-Markdown · image processing · legal/ethical scraping · OSINT · pagination · Playwright (basic + advanced) · rate limits/retries/caching · scheduled scraping · sitemaps/RSS/JSON-LD · speech AI · video understanding · vision models · Wayback/CommonCrawl.

---

## DuckDB + Parquet — analytics without a server

### The two-database pattern

| | SQLite (OLTP) | DuckDB (OLAP) |
|---|---|---|
| Job | Scraper **state**: seen-IDs, hashes, last-seen | **Analysis**: aggregate millions of rows |
| Pattern | Many tiny keyed reads/writes | Few huge scans over columns |
| In-process | ✓ (no server) | ✓ (no server) |

**SQLite remembers what your scraper has seen; DuckDB answers questions about what it collected** — straight off Parquet files, no import step, no server.

### Why Parquet, not CSV

| | CSV | Parquet |
|---|---|---|
| Types | Everything is a string | Real types preserved |
| Size | Baseline | **5–10× smaller** (columnar + compression) |
| Reading one column | Parse every byte | Read only that column |
| Schema | None | Embedded |

```bash
uvx duckdb -c "SELECT author, count(*) n FROM 'quotes.parquet' GROUP BY author ORDER BY n DESC LIMIT 5"
```

SQL over a file on disk — DuckDB reads only the columns it needs. That's the columnar advantage the exam keeps asking about.

!!! success "The rule"
    **CSV to hand a human a file; Parquet for everything your code touches.**
    → [T1-AN Q4](../pyqs/t1-2026-an.md#q4-why-parquet-beats-csv) · [T3-FN Q2](../pyqs/t3-2025-fn.md#q2-parquet-for-large-arrays)

<div class="tx-anchor" markdown>

**Asked in:** [T1-AN Q4 — Parquet vs CSV speed](../pyqs/t1-2026-an.md#q4-why-parquet-beats-csv) · [T3-FN Q2 — Parquet for arrays](../pyqs/t3-2025-fn.md#q2-parquet-for-large-arrays) · [T1-AN Q11 — NULL in AVG](../pyqs/t1-2026-an.md#q11-avg-over-nulls-in-duckdb) · GA6

</div>

---

## Rate limits, retries & caching — the professional scraper

**The philosophy:** the difference between a scraper that runs for months and one that's blocked on day one is rarely cleverness — it's **restraint**. Three habits:

### 1. Cap your concurrency

Don't fire 10 simultaneous requests at a 60/minute limit. **Throttle with sleep() between requests** — and remember limits are often per rolling window and shared across keys.

→ [T3-AN Q26](../pyqs/t3-2025-an.md#q26-respecting-the-rate-limit)

### 2. Back off when told to

When you get a **429** (rate limit) or **5xx** (server error), don't hammer. The professional pattern:

```python
# Exponential backoff with jitter, honouring Retry-After
RETRY_ON = {429, 500, 502, 503, 504}
# wait 1s → 2s → 4s → 8s → give up after MAX_ATTEMPTS
```

### 3. Cache everything you fetch

Never fetch the same page twice. Cache the response (with a TTL appropriate to the data's change frequency) and check before requesting.

**The connection to Week 2's caching family:** same concept (TTL, Cache-Control), applied to scraping instead of API responses.

<div class="tx-anchor" markdown>

**Asked in:** [T3-AN Q26 — rate limits](../pyqs/t3-2025-an.md#q26-respecting-the-rate-limit) · [T3-AN Q23 — the HTTP library](../pyqs/t3-2025-an.md#q23-the-http-library) · GA6 (`politeness-audit-server`, `rate-limits-retries-caching`)

</div>

---

## Change detection & dedup — knowing what's new

**The problem:** you scrape a page daily. Most content is unchanged. How do you know what's new without processing everything?

**The pattern:**

1. **Hash the content** (or a canonical version of it) on each scrape
2. **Store the hash** in SQLite (the scraper's state database)
3. **Compare**: new hash = changed content; same hash = skip
4. **Deduplicate** on unique IDs + timestamps so re-seeing a row is harmless

This is the **same lookback + dedup pattern** the ET-2 session taught for ETL pipelines — just applied at the scraper level instead of the data pipeline level.

→ GA6: `duckdb-json-ledger-reconciliation-server`

---

## Playwright — browser automation for scraping

**What it is:** a library that controls a real browser (Chromium, Firefox, WebKit) programmatically. You can navigate, click, fill forms, extract content, and take screenshots.

**When you need it (vs simple HTTP):**

| HTTP requests (requests/httpx) | Playwright |
|---|---|
| Static HTML pages | JavaScript-rendered pages |
| Simple APIs | Single-page apps, infinite scroll |
| Fast, lightweight | Heavy (full browser) but handles anything |

**The exam angle:** Playwright questions test whether you know *when a browser is needed* — the answer is always "when the content is rendered by JavaScript."

→ GA6: `playwright-shadow-incident-audit-server`, `playwright-table-server`

---

## Document parsing — extracting from PDFs, images, and messy formats

**The challenge:** real-world data arrives in PDFs, scanned images, and structurally messy formats. The course covers:

- **Text extraction from PDFs** (pdfplumber, PyMuPDF)
- **OCR for scanned documents** (Tesseract)
- **Structured extraction** (finding tables, forms, key-value pairs)
- **Vision models for understanding images** (Week 3's multimodal inputs)

→ GA6: `rotated-image-grid-forensics-server`, `document-parsing`

---

## Legal and ethical scraping — the line

**Legal:** scraping publicly available data, respecting robots.txt, rate-limiting yourself, identifying your bot.

**Not legal/ethical:** scraping behind authentication without permission, harvesting PII, overloading servers, ignoring terms of service.

The course's framing: **be a good citizen of the web** — the same restraint that keeps you from being blocked is also what keeps you on the right side of the line.

---

## Self-check — can you answer these without looking?

??? question "1. Why is Parquet 5–10× smaller than CSV for the same data?"
    **Columnar storage + compression.** Values of each column live together in
    binary format (real types preserved), enabling type-aware compression. CSV
    stores everything as text with row-oriented structure.

??? question "2. You need to scrape 10 pages from a site with a 60/minute limit. What do you do?"
    **Throttle with sleep() between requests** — don't fire all 10 simultaneously.
    Handle 429 with exponential backoff if you hit the limit anyway.

??? question "3. SQLite vs DuckDB — which for what?"
    **SQLite** for scraper state (seen-IDs, hashes, many small reads/writes —
    OLTP). **DuckDB** for analysis (aggregating millions of rows off Parquet —
    OLAP). Both run in-process with no server.

??? question "4. When do you need Playwright instead of requests?"
    When the content is **rendered by JavaScript** — single-page apps, infinite
    scroll, dynamic content. `requests` gets the raw HTML before JS runs;
    Playwright gets the rendered result.

??? question "5. How does change detection work in a daily scraper?"
    Hash the content on each scrape, store hashes in SQLite, compare — new hash
    means changed content, same hash means skip. Deduplicate on unique IDs so
    re-seeing a row is harmless.
