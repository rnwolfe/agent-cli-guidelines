---
title: Invariants — the core
description: The non-negotiable MUSTs that define an agent-CLI, plus how to read the normative keywords.
owner: rnwolfe
lastReviewed: 2026-06-23
---

## How to read this standard

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are used as in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) / [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174):

- **MUST** — required for conformance. Violating any MUST means the tool is not an agent-CLI.
- **SHOULD** — strongly recommended; deviate only with a documented reason.
- **MAY** — optional.

The **invariants on this page are the MUSTs** and together define **Core conformance** (see
[Conformance](/conformance/)). The pattern pages refine them with SHOULDs, rationale, and
examples. Every rule is tagged with the **assumption about LLM capability** it rests on, so the
standard can be revisited as models change — see [Evolution](/evolution/).

## The invariants

### I1 — Streams are typed: data to stdout, everything else to stderr
A tool **MUST** write machine-consumable output to **stdout** and all human chatter — progress,
warnings, prompts, errors — to **stderr**. A stray log line or spinner on stdout corrupts the
agent's parse.
*Rationale:* the agent reads stdout as the result. *Assumption:* stable across model generations.

### I2 — Read-only by default; mutations are gated
A tool **MUST NOT** change state, send messages, or take outward-facing actions unless the caller
**explicitly opts in** (e.g. a global `--allow-mutations`/`--write`, or a separate command). A
blocked mutation **MUST** fail with a structured error and a dedicated exit code (see I7, I4) —
not silently, and not with a TTY prompt. The guarantee **MUST** live in the binary, not in a
wrapper or skill layer.
*Rationale:* agents act on inference and can be wrong; the safe path must be the default.
*Assumption:* agents are fallible and may be adversarially steered — durable.

### I3 — Output is structured and stable
A tool **MUST** offer machine-readable output (`--json` / `--format json`) whose field names and
shapes are a **stable, documented contract**. Human formatting **MUST NOT** be the only option.
*Rationale:* agents parse fields, not prose. *Assumption:* durable.

### I4 — Exit codes are distinct, documented, and stable
A tool **MUST** return `0` on success and **distinct, documented** non-zero codes for
meaningfully different failures (usage, auth, not-found, blocked-mutation, …). Codes **MUST NOT**
change meaning across versions.
*Rationale:* exit codes are the agent's branch condition. *Assumption:* durable.

### I5 — Never require interaction; never take secrets on argv
A tool **MUST** be fully operable without a TTY. A `--no-input` mode (or equivalent) **MUST**
hard-fail rather than block when input is missing. Secrets **MUST NOT** be accepted as
command-line arguments (they leak via `ps`, `/proc`, and shell history); use stdin, env, or a
keyring.
*Rationale:* an agent has no TTY and cannot answer a prompt; a hidden prompt deadlocks it.
*Assumption:* durable.

### I6 — The tool describes itself to machines
A tool **MUST** expose a machine-readable description of its own surface — at minimum a
`schema` output (command tree, flags, exit codes, and current safety state) — and **SHOULD** ship
an embedded usage guide (an `agent` subcommand) so an agent can bootstrap with no external files.
*Rationale:* models learn a tool at *runtime*, not from training. *Assumption:* **revisit** —
if models reliably internalize a tool from `--help` alone, the bar may drop.

### I7 — Errors are structured and actionable
On failure a tool **MUST** emit a structured error carrying a machine-readable **code**, a human
message, and a **remediation** (the corrected command or next step) — to stderr, as JSON when JSON
output is requested. Opaque tracebacks **MUST NOT** be the only error surface.
*Rationale:* a good error lets the agent self-correct without a human. *Assumption:* durable.

### I8 — Output is bounded by default
A tool **MUST NOT** emit unbounded output by default. List operations **MUST** have a sane default
limit and a way to page or project fields. Truncation **MUST** be signalled, not silent.
*Rationale:* unbounded output blows the agent's context and degrades recall. *Assumption:*
**revisit** — the exact bound is tied to context-window size and recall behavior (see
[Token economy](/economy/)).

### I9 — Untrusted content is fenced
Output that originates from an external/attacker-influenceable source (message bodies, descriptions,
logs, web content) **MUST** be marked as untrusted in agent-facing output, so a downstream agent
does not execute instructions embedded in it.
*Rationale:* fetched content is a prompt-injection vector. *Assumption:* durable while agents
follow instructions found in their context.

### I10 — The surface is an append-only contract
Once agents depend on it, a tool **MUST** treat commands, flags, and output field names as
**append-only**: add, don't remove or repurpose, within a major version. Breaking changes
**MUST** bump the major version and be documented.
*Rationale:* agents encode your surface in scripts and weights; silent breakage is invisible
until it fails in production. *Assumption:* durable.

---

Meeting all ten is **Core conformance**. The [pattern pages](/foundations/) show how to implement
each well, and [Full conformance](/conformance/) adds their SHOULDs. The [antipatterns](/antipatterns/)
are these invariants stated as the real-world failures they prevent.
