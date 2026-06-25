---
title: Antipatterns
description: Named failure modes drawn from the real-world crop of agent CLIs — each an invariant stated as the mistake it prevents.
owner: rnwolfe
lastReviewed: 2026-06-23
---

These are real, observed failures from the 2025–2026 wave of agent CLIs. Each maps to an
[invariant](/invariants/) it violates. If you recognize one in your tool, that's the fix list.

## Safety in the wrapper, not the binary
Confirmation/safety implemented only in a wrapper or "skill" layer, while the binary itself will
mutate on one command. An agent that shells out directly bypasses the wrapper entirely. **Fix:**
put the read-only gate in the binary ([I2](/invariants/#i2--read-only-by-default-mutations-are-gated)).

## No mutation gate at all
Destructive/outward actions fire immediately with no opt-in — and, worse, some default to fanning
out to *every* target (e.g. changing settings for an entire household/fleet). **Fix:** read-only
default + explicit gate + per-target scoping ([Safety](/safety/)).

## A confirmation prompt an agent can't answer
Guarding a mutation with an interactive `y/N` prompt. An agent has no TTY; off-TTY this either
hangs forever or is auto-answered. **Fix:** a scriptable flag gate + `--no-input` that hard-fails
([I5](/invariants/#i5--never-require-interaction-never-take-secrets-on-argv)).

## The JSON envelope that swallows your own flags
Wrapping results in a hand-built envelope emitted directly (`{command, data, …}`) so that
`--select` / `--limit` / `--format` silently stop applying. **Fix:** route parsed data through the
one output writer; bound and project *before* emitting ([Foundations](/foundations/),
[I8](/invariants/#i8--output-is-bounded-by-default)).

## Unbounded output
Dumping a 10,000-row table (or a full `show tech-support`) by default, blowing the agent's context.
**Fix:** default limit + pagination + projection ([Token economy](/economy/)).

## Device/API errors returned as success
A failed upstream command whose error text is returned as ordinary stdout with exit 0, so the agent
"succeeds" with garbage. **Fix:** detect the failure signal and raise a structured error with a
non-zero code ([I7](/invariants/#i7--errors-are-structured-and-actionable)).

## Secrets on the command line
Accepting `--password …` / `--token …` as arguments, leaking them to `ps`, `/proc`, and shell
history. **Fix:** stdin / env / keyring only ([Auth](/auth/)).

## Human-only help, machine-blind tool
No `--json`, no `schema`, no machine-readable surface — the agent must scrape prose. **Fix:**
structured output + self-description ([I3](/invariants/#i3--output-is-structured-and-stable),
[I6](/invariants/#i6--the-tool-describes-itself-to-machines)).

## Unstable / renamed output fields
Renaming or repurposing a JSON field (or a command/flag) in a minor release, silently breaking
every agent script that depended on it. **Fix:** append-only surface; major-bump breaking changes
([I10](/invariants/#i10--the-surface-is-an-append-only-contract)).

## Unfenced untrusted content
Returning attacker-influenceable free text (messages, logs, descriptions) without marking it,
letting injected instructions reach the agent as if trusted. **Fix:** fence untrusted output by
default ([I9](/invariants/#i9--untrusted-content-is-fenced)).

## Mirroring the API instead of the task
One CLI command per upstream endpoint, forcing the agent to orchestrate many low-level calls and
filter the results itself. **Fix:** few task-shaped commands that return the high-signal result
([Token economy](/economy/#consolidate-dont-mirror-the-api)).

## Safety story that depends on the model behaving
Relying on a prompt ("the agent will ask first") instead of a structural guarantee. Prompts are
not security. **Fix:** make the safe behavior structural — the default, enforced by the binary.

## Evasion as a feature
Building in techniques whose purpose is to **defeat a provider's controls** — User-Agent spoofing to
look human, CAPTCHA-solving, residential-proxy rotation — so the tool can keep scraping after it's
been blocked. This is an abuse arms-race, not a property of a good CLI, and it contradicts respecting
the backend. **Fix:** identify the client honestly, reduce request *volume*
([backpressure](/safety/#backpressure-on-unofficial--scraped-backends)), back off when blocked, and
treat a persistent block as a stop signal — not something to engineer around.
