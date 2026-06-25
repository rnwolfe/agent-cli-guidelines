---
title: Conformance
description: Two conformance levels and a checklist, so a tool can self-certify and be graded.
owner: rnwolfe
lastReviewed: 2026-06-23
---

A tool may claim conformance to a **version** of these guidelines at a **level**. State it
explicitly, e.g.:

> Conforms to **Agent CLI Guidelines v0.3, Core**.

## Levels

- **Core** — satisfies every [invariant](/invariants/) (the MUSTs). This is the floor that makes a
  CLI safely and usefully agent-drivable.
- **Full** — Core **plus** the SHOULDs across the pattern pages (the embedded `agent` guide,
  `--dry-run`/reviewed-plan apply for high-stakes mutations, projection + pagination, an
  example-led `--help`, a `doctor`, single-source-of-truth self-description, prompt-injection
  fencing on by default).

## Checklist

### Core (the invariants)
- [ ] **I1** stdout = data, stderr = everything else
- [ ] **I2** read-only by default; mutations gated in the binary; blocked → structured error + code
- [ ] **I3** `--json`/`--format` with a stable, documented schema
- [ ] **I4** distinct, documented, stable exit codes
- [ ] **I5** never requires a TTY; `--no-input` hard-fails; no secrets on argv
- [ ] **I6** machine-readable `schema` (tree + flags + exit codes + safety state)
- [ ] **I7** structured errors `{error, code, remediation}`
- [ ] **I8** output bounded by default; truncation signalled
- [ ] **I9** untrusted external content fenced in agent output
- [ ] **I10** commands/flags/fields append-only within a major version

### Full (adds the key SHOULDs)
- [ ] Embedded `agent` usage guide (works with no repo/network)
- [ ] `--dry-run`; reviewed-plan (`apply <hash>`) for high-stakes mutations
- [ ] `--select` projection + opaque-cursor pagination + `--concise`/`--detailed`
- [ ] Example-led `--help` (+ optional agent-help mode)
- [ ] `auth login|status|logout|refresh` with a token-redacting `status`; `doctor`
- [ ] Secrets in OS keyring; warn on insecure file perms
- [ ] Self-description (`--help`, `agent`, `schema`) generated from one source
- [ ] Idempotent/declarative verbs; per-target isolation + partial-success code on fan-out
- [ ] Prompt-injection fencing **on by default** in agent mode
- [ ] Unofficial/scraped backend: self-throttle (conservative rate, backoff, persistent
      cross-process throttle, circuit-break on block) — protect the provider's infra and the user's access
- [ ] Unofficial/ToS-encumbered backend: state the legitimacy boundary (risk + intended scale) in
      README/`agent`; no evasion of provider controls
- [ ] Declare partial/narrowed results (a `scope`/`partial` field) — never silently limit output
- [ ] Update awareness: `version --check` (structured, fail-silent); passive notice human-only;
      never auto-update or instruct self-update

## Grading it

The checklist is designed to be run as an audit. A companion reviewer (the `cli-ux-audit` skill in
the agent-cli-factory toolchain) grades a tool's command surface against these items and reports
findings by severity. Treat a failed **Core** item as a release blocker.

## Show it

Meeting the bar? Declare it: grab a **[conformance badge](/badge/)** and a one-line statement for
your README that link back here.

## Self-certifying honestly

Conformance is a claim about behavior, not a logo. If you deviate from a SHOULD, document why. If
you can't meet a Core invariant because of the target (e.g. no agent-completable auth exists), the
honest answer may be that the tool shouldn't ship as an agent-CLI — say so.
