# Changelog

Versioning follows the scheme in [Evolution & governance](https://aclig.dev/evolution/):
MAJOR = breaking normative change, MINOR = new non-breaking guidance, PATCH = clarifications.

## v0.2.0 — 2026-06-24

New non-breaking guidance for tools built on unofficial / scraped backends.

- **Backpressure on unofficial / scraped backends** (SHOULD, Safety): self-throttle, persist
  throttle state across processes, circuit-break on a block/CAPTCHA rather than retrying into it.
- **State the legitimacy boundary** (SHOULD, Auth): disclose ToS/breakage risk + intended
  personal/legitimate scale in the README and `agent` output.
- **Evasion as a feature** antipattern: UA-spoofing, CAPTCHA-solving, and proxy rotation to defeat
  provider controls are out of scope — reduce volume, don't disguise it.

## v0.1.0 — 2026-06-23

Initial draft.

- 10 invariants (the normative Core).
- Pattern pages: Foundations (output/errors/exit codes), Safety & mutation control,
  Self-description, Token & context economy, Auth & secrets.
- Antipattern catalogue drawn from the 2025–2026 agent-CLI crop.
- Two conformance levels (Core, Full) with a checklist.
- Evolution model: capability-assumptions table + open questions + governance.
