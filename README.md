# Agent CLI Guidelines

> A living, versioned standard for command-line tools designed to be driven by LLM agents.

📖 **Read it: <https://rnwolfe.github.io/agent-cli-guidelines/>**

[![Deploy to Pages](https://github.com/rnwolfe/agent-cli-guidelines/actions/workflows/deploy.yml/badge.svg)](https://github.com/rnwolfe/agent-cli-guidelines/actions/workflows/deploy.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-5b5bd6.svg)](https://creativecommons.org/licenses/by/4.0/)

Most CLIs are built for a person at a terminal: they prompt, print prose, happily mutate state,
and expose nothing a machine can parse. An agent driving them flies blind. These guidelines
describe how to build a CLI an agent can **discover, drive, and trust** — while staying excellent
for humans — and pin each rule to the assumption about LLM capability behind it, so the standard
can evolve as the models do.

## What's inside

- **[Philosophy](https://rnwolfe.github.io/agent-cli-guidelines/philosophy/)** — why agent-native CLIs; the CLI ⇄ MCP boundary.
- **[Invariants](https://rnwolfe.github.io/agent-cli-guidelines/invariants/)** — the 10 non-negotiable MUSTs (Core conformance).
- **Patterns** — [Foundations](https://rnwolfe.github.io/agent-cli-guidelines/foundations/), [Safety](https://rnwolfe.github.io/agent-cli-guidelines/safety/), [Self-description](https://rnwolfe.github.io/agent-cli-guidelines/self-description/), [Token economy](https://rnwolfe.github.io/agent-cli-guidelines/economy/), [Auth](https://rnwolfe.github.io/agent-cli-guidelines/auth/).
- **[Antipatterns](https://rnwolfe.github.io/agent-cli-guidelines/antipatterns/)** — named failure modes from the real-world crop.
- **[Conformance](https://rnwolfe.github.io/agent-cli-guidelines/conformance/)** — a checklist + two levels (Core, Full).
- **[Evolution](https://rnwolfe.github.io/agent-cli-guidelines/evolution/)** — versioning, governance, and the capability-assumptions that will change.

An AI-readable corpus is published at `/llms.txt` and `/llms-full.txt`.

**Status:** v0.1 (draft). This is a living document — disagreement and proposals welcome via
[issues and PRs](https://github.com/rnwolfe/agent-cli-guidelines/issues).

## Develop

Astro Starlight site. `pnpm install`, then `pnpm dev --host 0.0.0.0`. `pnpm build` produces the
static site + `llms.txt`. Deployed to GitHub Pages on push to `main`.

## License

Prose and rationale: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code samples and
site tooling: MIT. See [LICENSE](LICENSE).
