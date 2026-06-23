---
title: Philosophy
description: Why agent-native CLIs exist, and where a CLI ends and an MCP server begins.
owner: rnwolfe
lastReviewed: 2026-06-23
---

## The moment

Coding agents changed what a CLI is *for*. An agent with shell access doesn't need a bespoke
integration protocol to use your tool — it can run the command, the way it already runs `git` and
`ls`. As Simon Willison put it, *"almost everything I might achieve with an MCP can be handled by a
CLI tool instead,"* and Armin Ronacher's argument is that piling tools into a context is "context
rot": the more you preload, the worse the agent gets.

So a new design target appeared: the same binary should serve **humans, scripts, CI, and agents**
from one well-behaved interface. These guidelines are about the *agent* half of that contract —
the part most CLIs get wrong because they were built for a person at a terminal.

## Why a CLI (the case for)

- **Token economy.** A CLI costs the agent nothing until it's called. Tool schemas that are
  preloaded into context (the MCP model) are paid for on every turn, whether used or not. The gap
  is large and repeatedly measured in the 30×+ range for high-frequency tasks.
- **Models already know CLIs.** Decades of man pages, READMEs, and `--help` output are in the
  training data. `gh pr list` is closer to "known" than any runtime-injected schema.
- **Composability and availability.** A binary is stateless and always there; it pipes into the
  rest of the system the agent already understands.

## Why not always a CLI (the honest case for MCP)

A CLI is not a universal answer. MCP (or an API) is the better tool when:

- **The target has no CLI and never will** — most SaaS (Figma, Notion, …). You can't shell into it.
- **Identity, audit, and least-privilege matter** — MCP carries a per-call, scoped, revocable
  identity; "whose credentials did that shell command use?" is a real, unsolved CLI problem in
  multi-user/enterprise settings.
- **The call is infrequent and correctness-critical** — the context tax buys schema validation and
  a typed contract.

## The synthesis

Don't pick a tribe. The durable framing the field is converging on: **a Skill is the abstraction
over the transport, and it routes to a CLI or an MCP server underneath.** A rough rule of thumb:

- **High-frequency loops, local data, things a model already knows → CLI wins on physics.**
- **Infrequent, high-reliability SaaS calls with no CLI → MCP.**

These guidelines apply whenever you choose the CLI side of that line. They assume your tool *is* a
CLI; they make it one an agent can actually use.

## What "good" means here

Throughout, "good for an agent" is concrete, not vibes. An agent:

- cannot see your colors or your spinner; it parses your **stdout**.
- cannot type `y` at a prompt; it needs **flags** and a guarantee you won't block.
- cannot remember your flags between sessions; it reads your **`--help`** and your
  **`schema`** at runtime.
- will faithfully act on whatever you return — including instructions hidden in **untrusted**
  device or API output — unless you fence them.
- pays for every token you emit; **verbosity is a cost**, not a courtesy.

Everything that follows is downstream of those five facts. Start with the
[Invariants](/invariants/).
