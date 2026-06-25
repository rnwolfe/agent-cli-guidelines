---
title: Auth & secrets
description: Authentication an agent can actually complete, and credential handling that never leaks.
owner: rnwolfe
lastReviewed: 2026-06-23
---

A tool an agent cannot authenticate is dead on arrival. This refines invariant
[I5](/invariants/#i5--never-require-interaction-never-take-secrets-on-argv).

## A feasible path to usability

Don't just name an auth mechanism — **trace at least one path an agent can complete end-to-end**,
with no human required after onboarding. A browser-only flow **MUST NOT** be the sole path. Ranked
roughly best→worst for agents:

1. **`--token-stdin`** — the user provisions a token once (dashboard or a one-time exchange);
   fully headless thereafter. Always works; the safest default.
2. **Paste-the-callback-URL (manual / OOB)** — a `redirect_uri` only needs to be *registered and
   matched*, not *served*: the user approves in-browser and pastes the redirected URL (the `code`
   is in the address bar) on stdin. No local server, no cert — sidesteps HTTPS-only callbacks. Use
   `state` for CSRF; the code is single-use and short-lived.
3. **Loopback capture** — a local server auto-catches the redirect; needs an *accepted* localhost
   redirect (HTTPS-only providers force a self-signed/mkcert cert — friction).
4. **Device flow** — clean when the provider supports it (many consumer APIs don't).
5. **Cookie/session extraction** — last resort for unofficial APIs; brittle, and never via argv.

If **no** path is agent-completable, say so loudly — it can be a reason not to build the tool at all.

## Credential handling

- **Never on argv.** Command-line arguments leak via `ps`, `/proc`, and shell history. Read secrets
  from `--password-stdin`, an environment variable, or the OS keyring — in that order.
- **Store in the OS keyring** (Keychain / libsecret / Credential Manager), keyed `user@host`. A
  `0600` XDG-path file is an acceptable fallback; **warn** when a credential file's permissions are
  looser than that.
- **Never in the inventory/config file.** Connection metadata (host, user, transport) is fine to
  commit; secrets are not.

## The auth command surface

- `auth login | status | logout | refresh`:
  - `status` actively **tests** the credential, shows the account/scopes, **redacts the token by
    default**, and exits non-zero on a problem (a usable CI/agent health gate).
  - `logout` removes the *local* credential only; say so, and link the provider's revocation page —
    local logout is not server-side revocation.
- A missing/expired credential **MUST** surface as a structured `AUTH_REQUIRED` error (exit code
  for auth) whose remediation names the exact login command.
- Ship a **`doctor`** that probes reachability, credential presence/validity, and (where relevant)
  OS-permission state, with a scannable pass/warn/fail per check and the literal fix under each
  failure.

## Least privilege

Request the **narrowest** scope/role that does the job, and prefer fine-grained, expiring
credentials. For read-only tools, document the read-only role the target offers (and any gotchas,
e.g. a stock role that can't see certain resources).

## Using unofficial backends responsibly

If the tool rides an **unofficial or ToS-encumbered backend**, it **SHOULD state its legitimacy
boundary plainly** — the breakage/ToS risk and the intended **personal / legitimate scale** — in the
README and the embedded `agent` output, so neither a human nor an agent unknowingly drives it at
prohibited bulk or commercial scale. Pair that disclosure with
[backpressure](/safety/#backpressure-on-unofficial--scraped-backends) (respect the infrastructure),
never with [evasion](/antipatterns/#evasion-as-a-feature) (defeating its controls).

*Capability assumption:* the *mechanics* here are durable. The open hard problem — **per-user
identity, audit, and revocation for a tool an autonomous agent invokes** — is unsolved for CLIs in
multi-user settings and is tracked in [Evolution](/evolution/#open-questions).
