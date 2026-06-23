---
title: Evolution & governance
description: How this living standard is versioned, what assumptions it rests on, and the open questions that will move it.
owner: rnwolfe
lastReviewed: 2026-06-23
---

These guidelines are **living**. Agent capabilities change fast, and CLI patterns for agents
should change with them. This page makes that explicit: how the document is versioned, the
capability assumptions each part rests on, and the questions still open.

**Status:** v0.1 (draft), 2026-06-23.

## Versioning

The standard is versioned `MAJOR.MINOR.PATCH`:

- **MAJOR** — a breaking normative change: an invariant added, removed, or *tightened* such that a
  previously-conformant tool no longer conforms.
- **MINOR** — new non-breaking guidance: a pattern, an antipattern, a SHOULD, a clarified level.
- **PATCH** — editorial clarifications, examples, fixes.

A tool cites the version and level it targets (see [Conformance](/conformance/)). Numeric anchors
like default output bounds are **tunables**, not invariants — they can move in a MINOR when the
[capability assumptions](#capability-assumptions) behind them shift.

### Changelog
- **v0.1.0 (2026-06-23)** — Initial draft: 10 invariants; patterns for foundations, safety,
  self-description, token economy, and auth; the antipattern catalogue; two conformance levels.

## Capability assumptions

Every rule rests on an assumption about what LLM agents can and can't do. When an assumption
changes, the dependent rules should be revisited — not silently kept.

| Rule / area | Assumption today | Revisit when |
|---|---|---|
| [Bounded output / token caps](/economy/) | Context is scarce; recall degrades as it fills ("context rot"). | Windows grow *and* recall stays flat → raise default bounds (keep the principle). |
| [`schema` + `agent` self-description](/self-description/) | Models learn a tool at runtime, not from training; they benefit from a machine-readable contract. | Models reliably infer the full surface from `--help` alone → demote toward SHOULD. |
| [Prompt-injection fencing](/safety/#prompt-injection-fencing) | Agents may follow instructions found in fetched content. | Models become reliably immune to injected instructions → relax fencing. |
| [Never require a TTY prompt](/invariants/#i5--never-require-interaction-never-take-secrets-on-argv) | Agents have no TTY and can't answer prompts. | Durable for headless agents; unlikely to change. |
| [Read-only by default](/invariants/#i2--read-only-by-default-mutations-are-gated) | Agents act on inference, can be wrong, can be steered. | Durable — this is about consequence, not capability. |
| [Structured output / errors / exit codes](/foundations/) | Machines parse fields and branch on codes. | Durable. |

If you find yourself wanting to break a rule because "the model is good enough now," that's the
signal to open a proposal against the assumption — not to quietly ignore the rule.

## Open questions

- **The CLI ⇄ MCP boundary.** Where exactly does a CLI stop being the right transport? The
  field's rule of thumb (high-frequency/local → CLI; infrequent/SaaS → MCP) is useful but not
  precise. See [Philosophy](/philosophy/).
- **Identity, audit, and revocation.** The strongest argument *against* CLIs for agents in
  multi-user/enterprise settings: when an agent runs a CLI, whose identity is it, and how is that
  call audited and revoked? CLIs have no clean answer yet. See [Auth](/auth/).
- **A standard shape for `schema --json`.** There is no ratified cross-tool schema for a CLI's
  self-description. Converging on one would let agents introspect any conformant tool uniformly.
- **Output bounds as windows grow.** The right default cap is empirical and tied to recall, not
  just window size. Needs measurement, not guesswork.

## Governance

This is an opinionated, evidence-backed standard maintained in the open. To propose a change:

1. Open an issue on [GitHub](https://github.com/rnwolfe/agent-cli-guidelines) naming the rule and
   the **assumption** you're challenging (with evidence where possible).
2. Normative changes (invariants, levels) ship in a MAJOR/MINOR with rationale recorded in the
   changelog; clarifications ship as PATCH.
3. Disagreement is expected and welcome — a living standard earns its authority by being revised in
   public, not by being frozen.
