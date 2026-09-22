---
id: 04-listener-and-artist-journeys
title: "Listener, artist and operator journeys"
sidebar_position: 5
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Listener journey

1. Authenticate through the selected identity provider using authorization code with PKCE. Backend validates issuer, audience, state and nonce, then sets a secure HttpOnly session cookie. No wallet is required.
2. Purchase a GBP subscription through hosted provider checkout. The signed payment event updates access according to the approved access policy. Show payment pending until the provider confirms the relevant state. Authorisation may grant trial access only under a separately approved rule; it cannot fund allocations.
3. Select an available licensed work. Gateway checks identity, current entitlement, territory, rights window and the account's exclusive playback lease. A second session returns `SESSION_CONFLICT`; explicit takeover closes the old lease.
4. Press Play. No first-load autoplay. Receive short-lived grants, refresh while playing, show buffering/fallback transparently. Pause stops new grants. Resume preserves the session if its lease remains live. After expiry create a new session, subject to daily limits.
5. Support view shows provisional activity and its settlement state, never a spendable customer balance or a fixed per-stream price. Cancellation stops renewal, with access until paid-through unless a refund policy revokes it.

## Rights-holder journey

Onboard the person/entity; complete necessary checks, agreements, territory and licence review. Upload through a quarantined workflow. Catalogue staff approve a rights version only when all claimed splits and included works are cleared. The system hashes the master and rendition manifests before publication. A rights-holder account and an artist display profile are separate concepts.

Register an Aptos payout address with a domain-separated possession challenge, chain identity and expiry. Require step-up authentication, out-of-band notification and finance review for replacement. Changes have a proposed 48-hour cooling period and apply only to future uncommitted payouts. Show pending change and the current effective address.

For self-custody, user creates/controls the account and recovery mechanism; demonstrate a small approved test transfer before activation. For embedded custody, provider selection, export/recovery, account portability and incident obligations are `OPEN DECISION D03`. No implementation may invent a custodial recovery promise. Lost access freezes future payouts pending re-verification. Already paid USDC is not reversed; committed unpaid leaves need the cancellation/reissue protocol, never silent redirection.

Dashboard separates eligible duration, attested duration, provisional accrual, held amount, settled obligation and paid USDC. Every paid row links to chain ID, transaction hash, version and asset. A dispute opens a case without exposing listener identities.

## Operator journey

Submit endpoint, region, receipt public key and verified payout account. Admission requires agreement, identity review, security inspection and challenge delivery of a known asset. Pending nodes receive no traffic. Active nodes poll short-lived grants, validate content before serving and submit receipts. Health loss routes new grants to fallback. Suspension revokes issuance and quarantines unresolved receipts from the effective incident time; valid historical rewards are reviewed, not automatically confiscated. Reinstatement needs remediation, key rotation where relevant, new probes and a second reviewer.

Frontend acceptance: keyboard-accessible controls, explicit pending/error/stale states, no false paid badge on submission, no private listener data in artist/operator views. Use the released design system during later UI implementation. This document does not change the prototype or approve new presentation copy.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
