# Agent CLI Guidelines

> A living, versioned standard for command-line tools designed to be driven by LLM agents.

📖 **Read it: <https://aclig.dev/>**

[![Site](https://img.shields.io/badge/site-aclig.dev-5b5bd6.svg)](https://aclig.dev/)
[![License: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-5b5bd6.svg)](https://creativecommons.org/licenses/by/4.0/)

Most CLIs are built for a person at a terminal: they prompt, print prose, happily mutate state,
and expose nothing a machine can parse. An agent driving them flies blind. These guidelines
describe how to build a CLI an agent can **discover, drive, and trust** — while staying excellent
for humans — and pin each rule to the assumption about LLM capability behind it, so the standard
can evolve as the models do.

## What's inside

- **[Philosophy](https://aclig.dev/philosophy/)** — why agent-native CLIs; the CLI ⇄ MCP boundary.
- **[Invariants](https://aclig.dev/invariants/)** — the 10 non-negotiable MUSTs (Core conformance).
- **Patterns** — [Foundations](https://aclig.dev/foundations/), [Safety](https://aclig.dev/safety/), [Self-description](https://aclig.dev/self-description/), [Token economy](https://aclig.dev/economy/), [Auth](https://aclig.dev/auth/).
- **[Antipatterns](https://aclig.dev/antipatterns/)** — named failure modes from the real-world crop.
- **[Conformance](https://aclig.dev/conformance/)** — a checklist + two levels (Core, Full).
- **[Evolution](https://aclig.dev/evolution/)** — versioning, governance, and the capability-assumptions that will change.

An AI-readable corpus is published at `/llms.txt` and `/llms-full.txt`.

**Status:** v0.4 (draft). This is a living document — disagreement and proposals welcome via
[issues and PRs](https://github.com/rnwolfe/agent-cli-guidelines/issues).

## Develop

Astro Starlight site (landing in `src/pages/index.astro`, docs in `src/content/docs/`).
`pnpm install`, then `pnpm dev --host 0.0.0.0`. `pnpm build` produces the static site + `llms.txt`.
Deployed to **Vercel** (auto on push to `main`) at **[aclig.dev](https://aclig.dev/)**.

## License

Prose and rationale: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Code samples and
site tooling: MIT. See [LICENSE](LICENSE).
