---
title: Self-description
description: How a tool teaches an agent its own surface — schema, an embedded agent guide, and example-led help.
owner: rnwolfe
lastReviewed: 2026-06-23
---

An agent meets your tool for the first time at runtime. It hasn't memorized your flags; it reads
what you tell it. Make the tool **self-describing**. This refines invariant
[I6](/invariants/#i6--the-tool-describes-itself-to-machines).

## `schema` — the machine-readable surface

A tool **MUST** expose a `schema` output (JSON) describing itself. Include:

- the **command tree** — every command and subcommand;
- every **flag** — name, type, default, one-line help;
- the **exit-code table** — code → name (so an agent resolves a code without guessing);
- the **current safety state** — read-only vs mutations-allowed, dry-run, no-input — so the agent
  can see what it is allowed to do *right now*.

```json
{
  "tool": "examplectl",
  "version": "0.1.0",
  "conformance": { "spec": "agent-cli-guidelines", "version": "0.4.0", "level": "Full" },
  "read_only": true,
  "commands": { "...": "the full tree" },
  "exit_codes": { "ok": 0, "usage": 2, "mutation_blocked": 12, "...": 0 },
  "safety": { "allow_mutations": false, "dry_run": false, "no_input": false }
}
```

Generate this from the *same definitions* the parser uses, so it can never drift from the real
surface. (Frameworks that model commands as data make this nearly free — e.g. Click's
`to_info_dict`, kong's grammar, swift-argument-parser's `--experimental-dump-help`.)

A tool **SHOULD** also declare a **`conformance`** claim in `schema` — the Agent CLI Guidelines
`version` and `level` it targets — so an agent (and a fleet audit) can verify the contract version
it is driving, rather than reading it off a human-only README badge.
*Assumption:* agents introspect a tool at runtime and benefit from a machine-readable
contract-version claim — durable while that holds (see [Evolution](/evolution/)).

## `agent` — an embedded usage guide

A tool **SHOULD** ship an `agent` subcommand that prints a concise usage guide (a `SKILL.md`)
**embedded in the binary** — so an agent that has only the binary, with no repo and no network,
can still learn how to drive it: the command surface, the read/mutation split, the output flags,
the exit codes, and a few copy-paste recipes.

## `--help` is the agent's first move

When an agent meets an unfamiliar CLI, the first thing it runs is `--help`. So:

- **Lead with examples.** Agents learn patterns from real invocations faster than from flag lists.
- Keep it complete and parseable; consider a terse agent-help mode (e.g. `TOOL_HELP=agent`) that
  prints a compact, machine-skimmable contract.

## Update awareness — inform, never self-mutate

A tool an agent invokes in a loop must not surprise it with version drift or rewrite itself
mid-task:

- It **SHOULD** offer a pull-based **`version --check`** — structured
  `{current, latest, updateAvailable, upgrade}`, a short network timeout, fail-silent — so an agent
  can ask "am I current?" without parsing prose.
- A passive "update available" notice **SHOULD** be **human-only**: at most a one-line hint to
  **stderr**, only on an interactive TTY + human format, cached so it costs nothing in a hot loop,
  and **silent for agents** (`--json` / non-TTY / `--no-input`).
- A tool **SHOULD NOT** auto-update, and **SHOULD NOT** instruct the agent to update it — a binary
  that rewrites itself mid-task breaks reproducibility and is a supply-chain/exec hazard. Surface
  the upgrade *command* to the human; let them (or their package manager) decide.

*Rationale:* the agent treats the tool as a fixed, deterministic dependency within a run; drift or
self-mutation corrupts that. *Assumption:* agents invoke tools repeatedly in unattended runs and
rely on stable behavior — durable; the "never self-mutate" half is a candidate to elevate to a
MUST NOT (see [Evolution](/evolution/)).

## One source of truth

`--help`, the embedded `agent` guide, and `schema` **SHOULD** be generated from a single
specification of the tool's surface. Three hand-maintained descriptions drift; one generated set
stays honest.

*Capability assumption:* this whole page assumes models learn a tool at runtime rather than from
training, and benefit from an explicit machine-readable contract. If models become reliably able
to infer a tool's full surface from `--help` alone, `schema`/`agent` may become a SHOULD rather
than a near-MUST — flagged in [Evolution](/evolution/).
