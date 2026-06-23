---
title: Safety & mutation control
description: Read-only by default, mutation gating, dry-run and reviewed-plan apply, and prompt-injection fencing.
owner: rnwolfe
lastReviewed: 2026-06-23
---

This is the highest-stakes surface of an agent-CLI, and the one the real-world crop most often
gets wrong (see [Antipatterns](/antipatterns/)). It refines invariants
[I2](/invariants/#i2--read-only-by-default-mutations-are-gated) and
[I9](/invariants/#i9--untrusted-content-is-fenced).

## Read-only by default

An agent acts on inference and can be wrong or adversarially steered, so the **safe path is the
default**:

- State-changing operations **MUST** be off unless the caller explicitly opts in — a single global
  gate (`--allow-mutations` / `--write`) read by every mutating command is the clearest shape.
- A blocked mutation returns a **structured error with a dedicated exit code** (e.g.
  `MUTATION_BLOCKED`), so the agent can distinguish "blocked — ask permission" from a real failure.
- The guarantee lives **in the binary**. Putting confirmation only in a wrapper/skill is an
  [antipattern](/antipatterns/#safety-in-the-wrapper-not-the-binary): an agent that shells out
  directly bypasses it.

### Read-only-*only* tools
If a tool has no mutating commands by design (a pure state-gatherer), the gate becomes an **input
validator**: a generic passthrough (`tool run "<cmd>"`) refuses anything that isn't a read,
returning a structured `WRITE_REFUSED`, and there is *deliberately no escape flag* — "no writes"
is the product boundary, not a toggle. Gate operationally heavy reads (debug, full dumps) behind
their own explicit opt-in.

## Confirming a mutation an agent requested

A human types `y`; an agent cannot. So:

- `--yes` / `--force` **MAY** bypass a confirmation for scripted/agent use.
- A bare `--yes` **MUST NOT** act on an implicit or wildcard target — the dangerous target must be
  named explicitly.
- Scale friction to severity: trivial change → just do it; destructive change → require the target
  be named, or a typed confirmation token that is still scriptable.

### `--dry-run` and reviewed-plan apply
- Every mutating command **SHOULD** support `--dry-run`: perform the full plan, print what *would*
  change (as JSON under `--json`), change nothing, exit 0.
- For high-stakes changes, prefer **reviewed-plan apply**: `--dry-run` emits a plan plus a hash;
  a separate `apply <hash>` executes *only that exact plan*. This closes the time-of-check /
  time-of-use gap that a blind `--yes` opens — the artifact reviewed is the artifact executed
  (the model Terraform uses with saved plan files).
- Prefer **idempotent/declarative verbs** (`ensure`, `apply`, `sync`) so an agent's retries don't
  double-act; "delete an already-gone thing" is a soft success, not an error.

## Fan-out safety
When a tool acts across many targets (a fleet), **isolate per-target failures** — one unreachable
host must not fail the others — and return a **partial-success exit code** when any target failed.
Default targeting must never silently fan a mutation out to *everything*.

## Prompt-injection fencing

Output that originates from an external, attacker-influenceable source — message bodies, interface
descriptions, neighbor names, logs, web pages, ticket text — is a prompt-injection vector. In
agent-facing output it **MUST** be fenced as untrusted:

- Wrap raw free text in explicit `BEGIN/END UNTRUSTED …` markers, and/or set an `"untrusted": true`
  flag on the carrying JSON object.
- Default this **on** in agent mode. Of the real-world crop, essentially one tool fenced untrusted
  content at all, and even then it was opt-in — make it the default.

*Capability assumption:* fencing matters as long as agents may follow instructions found in their
context. If models become reliably immune to injected instructions, this relaxes — see
[Evolution](/evolution/).
