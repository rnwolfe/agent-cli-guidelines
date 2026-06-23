---
title: "Foundations: output, errors, exit codes"
description: The output contract, structured errors, and exit-code design that everything else builds on.
owner: rnwolfe
lastReviewed: 2026-06-23
---

These refine invariants [I1](/invariants/#i1--streams-are-typed-data-to-stdout-everything-else-to-stderr),
[I3](/invariants/#i3--output-is-structured-and-stable),
[I4](/invariants/#i4--exit-codes-are-distinct-documented-and-stable), and
[I7](/invariants/#i7--errors-are-structured-and-actionable).

## Output discipline

- **stdout = data, stderr = chatter.** Route *all* results through one writer to stdout and all
  progress/notes/warnings/errors to stderr. Never `print` progress to stdout "just this once" — a
  single stray line breaks the agent's parse.
- **Formats.** Offer `--format json|plain|tsv` with `--json` as an alias for `--format json`.
  - `json` — the contract. Two-space indent, no HTML escaping (URLs must survive).
  - `plain`/`tsv` — for humans and `grep`/`awk`; never the only machine path.
- **Color and TTY.** Disable color when output is not a TTY, when `NO_COLOR` is set, or when a
  non-human format is active. Color **MUST** never appear in `json`/`tsv`.
- **A stable schema.** Field names are a contract (see [I10](/invariants/#i10--the-surface-is-an-append-only-contract)).
  Put output types in one place, document them, and **snapshot them in a test** so a rename is a
  reviewed diff, not a silent break. Add a `schemaVersion` field if the shape may evolve.
- **Normalize provider noise.** If the upstream emits envelope cruft (e.g. NX-OS
  `{"TABLE_x":{"ROW_x":[…]}}`), normalize it to a clean array/object so projection and limiting
  work — don't leak it to the agent.

## Errors

Every failure returns a structured object, to stderr, as JSON when JSON is requested:

```json
{ "error": "item 42 not found", "code": "NOT_FOUND", "remediation": "list items to find a valid id" }
```

- **`code`** is a stable machine string the agent can branch on.
- **`remediation`** names the corrected command or next step. A model can often self-correct from
  a good error alone — e.g. a "bad column" error that points at `schema` lets the agent retry
  without a human.
- **Did-you-mean.** On an unknown command or flag, suggest the nearest valid one (edit distance).
- **Echo the offending input** so the agent sees what it sent.
- Opaque stack traces are a last resort, never the primary surface.

## Exit codes

Exit codes are the agent's control flow. Make them distinct, documented, and stable; surface the
full table in [`schema`](/self-description/). A reasonable base table:

| Code | Name | Meaning |
|---|---|---|
| 0 | ok | success |
| 1 | generic | unclassified error |
| 2 | usage | bad invocation / arguments |
| 3 | empty | no results (when distinct from success matters) |
| 4 | auth | authentication required/failed |
| 5 | not_found | named resource doesn't exist |
| 6 | permission | not allowed |
| 7 | rate_limited | back off and retry |
| 8 | retryable | transient; retry may succeed |
| 10 | config | misconfiguration |
| 11/12 | blocked | mutation/write refused (read-only gate) |
| 13 | input_required | needed input, `--no-input` set |
| 130 | cancelled | interrupted (SIGINT) |

Reserve a **dedicated code for a blocked mutation** so an agent can tell "blocked — ask for
permission" apart from "real failure." Reserve another for **partial success** when a tool fans
out over many targets (see [Safety](/safety/) and [Token economy](/economy/)).

Tie every code to a name in `schema` output so the agent can resolve a code without guessing.
