---
title: Token & context economy
description: Bounded, projectable, paginated output — and an honest accounting of which rules depend on today's context limits.
owner: rnwolfe
lastReviewed: 2026-06-23
---

Every token a tool emits is a token the agent pays for and must reason around. This is the page
most tied to current model capability, so each rule is paired with its assumption. It refines
invariant [I8](/invariants/#i8--output-is-bounded-by-default).

## Bound output by default

- List operations **MUST** have a sane default limit (e.g. 50) and **MUST** signal truncation
  (a note to stderr, or a `nextCursor` in JSON) — never silently cut.
- Provide **field projection** (`--select a,b.c`) so the agent fetches only what it needs.
- Provide **pagination** via an **opaque cursor**; emit `nextCursor` and treat its absence as
  end-of-results. The caller must never have to construct or parse the cursor.
- Offer a verbosity control (`--concise` default, `--detailed`) so the agent can opt into more.

## Return handles, not haystacks

- Prefer returning **IDs / paths / stable references** and letting the agent drill down on demand,
  over dumping every nested object. Summarize, then fetch.
- **Resolve opaque identifiers to human-readable names** where feasible (a `uuid` → a name); it
  improves the agent's precision and cuts hallucination. Drop low-signal cruft (`mime_type`,
  `256px_image_url`) from default output.

## Consolidate, don't mirror the API

Don't expose one command per upstream endpoint. Build **few, task-shaped commands** that return
the high-signal result for a real job (a `search_X` that returns the relevant lines with context,
not a `read_all_X` the agent must then filter). Mirroring an API one-to-one is an
[antipattern](/antipatterns/#mirroring-the-api-instead-of-the-task).

## The honest part: what depends on today's limits

These rules exist because **context is currently scarce and model recall degrades as it fills**
("context rot"). That premise is real today and drives concrete anchors — e.g. capping a single
tool response on the order of ~25k tokens is a reasonable default now.

But the premise is **not permanent**, and this standard says so out loud:

- If context windows grow by orders of magnitude **and** recall stays flat across them, the
  *default limits* should rise — the **principle** (bound by default; let the agent ask for more)
  stays; the **numbers** move.
- If models get materially better at ignoring irrelevant tokens, aggressive projection/pagination
  becomes a smaller win.
- What will **not** change soon: emitting a 10,000-row table by default is hostile regardless of
  window size, because it crowds out the agent's reasoning budget and its own prior context.

Treat every specific number on this page as a **tunable tied to a capability assumption**, tracked
in the [capability-assumptions table](/evolution/#capability-assumptions). Treat "bounded,
projectable, paginated, summarize-then-drill" as durable.
