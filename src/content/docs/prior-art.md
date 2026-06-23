---
title: Prior art & credits
description: The work this standard builds on, and the evidence base behind it.
owner: rnwolfe
lastReviewed: 2026-06-23
---

These guidelines stand on a lot of prior work. They are the *agent-facing* complement to the
classic CLI canon, grounded in published guidance on building tools for LLMs and in a survey of
the real-world crop of agent CLIs.

## The CLI design canon (humans first)
- **[Command Line Interface Guidelines (clig.dev)](https://clig.dev/)** — the modern reference for
  human-facing CLI UX. Much of [Foundations](/foundations/) is its stream discipline, exit-code
  conventions, and "human-first but scriptable" stance, carried into the agent setting.
- **[12-Factor CLI Apps](https://jdxcode.medium.com/12-factor-cli-apps-dd3c227a0e46)** — great
  help, flags over args, stdout/stderr discipline, never *require* a prompt.
- **POSIX/GNU argument conventions** and the **Unix philosophy** — do one thing well; text streams
  as a universal interface; output of one program is input to the next.

## Building tools for LLM agents
- **Anthropic — [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)**
  and the tool-use docs: build few high-impact tools (don't mirror the API), return high-signal
  context, bound output, write actionable errors, namespace clearly.
- **Anthropic — [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)**
  — context as a finite, degrading resource; the basis for [Token economy](/economy/).
- **Simon Willison** on [Claude Skills and CLIs vs MCP](https://simonwillison.net/2025/Oct/16/claude-skills/)
  and **Armin Ronacher** on [code over tool-sprawl](https://lucumr.pocoo.org/2025/8/18/code-mcps/) —
  the argument behind [Philosophy](/philosophy/).
- **[Model Context Protocol](https://modelcontextprotocol.io/)** — the other side of the boundary;
  pagination-by-opaque-cursor and the identity/audit strengths referenced throughout.

## Safe-mutation prior art
- **Terraform** plan-then-apply (the saved-plan = approval model behind
  [reviewed-plan apply](/safety/#-dry-run-and-reviewed-plan-apply)); **kubectl** `--dry-run`
  tiers; **git** `--force-with-lease` (conditional override); **gh** (a bare `--yes` can't act on
  an implicit target).

## The empirical base
The [antipatterns](/antipatterns/) and the ranking behind these rules come from a survey of the
2025–2026 wave of agent CLIs (the tools that emerged around the "give every app a CLI for your
agent" moment). The recurring finding: these tools are strong on structured *output* and weak on
*safety, self-description, and token discipline* — and "read-only by default," the property
everyone talks about, is the one most of them don't actually implement. That gap is why this
standard leads with it.

## Credits
Authored and maintained by [Ryan Wolfe](https://github.com/rnwolfe). Prose and rationale are
licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — reuse and adapt with
attribution. Contributions and challenges welcome via
[GitHub](https://github.com/rnwolfe/agent-cli-guidelines) (see [Evolution](/evolution/#governance)).
