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
Follows the Agent CLI Guidelines (v0.1, Full) — read-only by default, structured,
self-describing, stable exit codes. https://aclig.dev
```

## Cite the version

The standard is versioned (currently **v0.1**) — see [Evolution](/evolution/). When you claim
conformance, name the version and level you targeted (e.g. "Agent CLI Guidelines v0.1, Core") so
the claim stays meaningful as the standard evolves.

## A worked example

[`nxstate`](https://github.com/rnwolfe/nxstate) — a read-only Cisco Nexus state CLI — is built to
**Full** conformance and wears the badge in its README. It's a useful reference for what the
checklist looks like in real code.
