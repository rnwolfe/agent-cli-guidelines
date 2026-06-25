---
title: Adopters
description: Real CLIs built to the Agent CLI Guidelines — read-only by default, structured, self-describing, injection-fenced.
owner: rnwolfe
lastReviewed: 2026-06-25
---

Tools built to the standard. Each conforms at **Full** and **declares its conformed version in
`schema`** (`<tool> schema | jq .conformance`), so an agent can verify the contract at runtime — not
just trust a README badge.

Built one? If it [conforms](/conformance/) and wears the [badge](/badge/), open a PR or an issue to
get it listed.

## Install them as agent skills

Companion skills bootstrap the binary if it's missing and then defer to each tool's `agent` /
`schema` output — so an agent can discover and drive any of these with no setup:

```text
# Claude Code
/plugin marketplace add rnwolfe/agent-cli-skills
/plugin install agent-cli-skills@agent-cli-skills

# or, generically
npx skills add rnwolfe/agent-cli-skills
```

## Built to the standard

### [rivr](https://github.com/rnwolfe/rivr) — Amazon shopping
Read-only Amazon shopping for AI agents — one normalized schema over four backends.
`brew install rnwolfe/tap/rivr` · [rivr.sh](https://rivr.sh)

### [gfly](https://github.com/rnwolfe/gfly) — Google Flights
Google Flights from your terminal — JSON-first, no API key.
`uvx gfly` · [gfly.sh](https://gfly.sh)

### [knit](https://github.com/rnwolfe/knit) — Threads
Agent-safe CLI for Instagram's Threads — posting gated *in the binary*, prompt-injection-fenced.
`brew install rnwolfe/tap/knit`

### [vabc](https://github.com/rnwolfe/vabc) — Virginia ABC
Virginia ABC catalog & live store stock as clean JSON.
`brew install rnwolfe/tap/vabc`

### [nxstate](https://github.com/rnwolfe/nxstate) — Cisco Nexus
Read-only Cisco Nexus (NX-OS) state as clean JSON — fleet fan-out; physically cannot configure a switch.
`uvx nxstate`

---

Every one is read-only by default, speaks `--json`, self-describes via `schema` + an embedded
`agent` guide, and bounds its output — the [invariants](/invariants/) in practice.
