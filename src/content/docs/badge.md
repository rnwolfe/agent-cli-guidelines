---
title: Get the badge
description: Declare your CLI's conformance with a badge and a one-line statement that link back to the guidelines.
owner: rnwolfe
lastReviewed: 2026-06-23
---

If your CLI meets the standard, say so. Drop a badge in your README that links to the
[conformance checklist](/conformance/) and tells users (and their agents) what to expect.

Pick the level you actually meet — **Core** (all the [invariants](/invariants/)) or **Full**
(Core + the pattern SHOULDs). Be honest; conformance is a claim about behavior, not a logo.

## The badges

![Agent CLI Guidelines: Core](/badge/agent-cli-guidelines-core.svg)
&nbsp;
![Agent CLI Guidelines: Full](/badge/agent-cli-guidelines-full.svg)

## Copy-paste (Markdown)

Core:

```md
[![Agent CLI Guidelines: Core](https://aclig.dev/badge/agent-cli-guidelines-core.svg)](https://aclig.dev/conformance/)
```

Full:

```md
[![Agent CLI Guidelines: Full](https://aclig.dev/badge/agent-cli-guidelines-full.svg)](https://aclig.dev/conformance/)
```

## HTML

```html
<a href="https://aclig.dev/conformance/">
  <img alt="Agent CLI Guidelines: Full" src="https://aclig.dev/badge/agent-cli-guidelines-full.svg">
</a>
```

## Prefer shields.io?

A generated equivalent, if you'd rather not hotlink the SVG:

```md
[![Agent CLI Guidelines](https://img.shields.io/badge/Agent_CLI_Guidelines-Full-5b5bd6?labelColor=16162a)](https://aclig.dev/conformance/)
```

## A one-line conformance statement

Plain text for a README line, release notes, or a tool's `--help`/`agent` output:

```text
Follows the Agent CLI Guidelines (v0.3, Full) — read-only by default, structured,
self-describing, stable exit codes. https://aclig.dev
```

## Cite the version

The standard is versioned (currently **v0.3**) — see [Evolution](/evolution/). When you claim
conformance, name the version and level you targeted (e.g. "Agent CLI Guidelines v0.3, Core") so
the claim stays meaningful as the standard evolves.

## Worked examples

Two read-only CLIs built to **Full** conformance, in different domains — useful references for what
the checklist looks like in real code:

- [`nxstate`](https://github.com/rnwolfe/nxstate) — a read-only Cisco Nexus state CLI. A clean read
  surface over a network device.
- [`gfly`](https://github.com/rnwolfe/gfly) ([docs](https://docs.gfly.sh)) — a read-only Google
  Flights CLI for agents. A useful reference for conforming over an **untrusted, reverse-engineered
  upstream**: parse breakage surfaces as a `SCHEMA_DRIFT` exit code, rate-limits/CAPTCHA as a
  `BLOCKED` code with `retryAfterSeconds`, a swappable backend sits behind one stable
  `schemaVersion` envelope, and a persistent cross-process throttle keeps the read path polite
  without hanging an agent loop.

Both wear the badge in their READMEs.
