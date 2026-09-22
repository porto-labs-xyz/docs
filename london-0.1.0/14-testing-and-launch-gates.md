---
id: 14-testing-and-launch-gates
title: "Testing, proof levels and launch gates"
sidebar_position: 15
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Evidence levels

Use `SPECIFICATION` for these approved requirements; `FIXTURE PASS` for synthetic tests; `STAGING VERIFIED` for deployed sandbox behaviour; `MAINNET VERIFIED` for confirmed real-chain operations; `PILOT OBSERVED` for actual paid listening and independently controlled infrastructure. Never promote one level into another without evidence. All implementation tests below are required future work, not results of authoring these docs.

## Release gates

| Gate | Required evidence | Owner / prevents |
|---|---|---|
| G0 contracts | Schemas, fixtures, configuration validation and independent canonicalisation agree | Engineering; prevents incompatible implementations |
| G1 ledger and contract | RocksDB atomicity/durability, deterministic replay, checkpoint/restore, allocation properties, idempotence, access controls and immutable commitment tests pass | Backend/Move/QA; prevents lost/duplicated money and mutable proofs |
| G2 playback and nodes | Browser matrix, full long-form run, peer-fill integrity, restart, timeout and fallback tests pass | Frontend/node/QA; prevents a nominal network that cannot serve |
| G3 external integrations | Real selected-provider sandbox events, out-of-order replay, pinned asset/framework ABI, recipient ownership | Integration/finance/security; prevents fictional adapter assumptions |
| G4 recovery and security | Independent security review, restore drill, uncertain transaction drill, key rotation and signer separation | Security/operations; prevents unsafe recovery |
| G5 production authorisation | Complete release profile, licences, participant terms, provider approvals, finance/legal/privacy sign-offs and bounded funding | Product/finance/legal; prevents unintended real-money launch |
| G6 bounded Mainnet rehearsal | Approved minimal real transfer, commitment/readback, statement verification and exact reconciliation | Finance/QA; proves selected production path only |
| G7 pilot completion | Paid demand, independent serving, peer transfer, actual payouts, cost and retention evidence | Product; tests hypotheses without overstating conclusions |

An agent can implement G0-G4 using synthetic configuration. G5 requires real named inputs and human approvals, not guessed defaults. Product approval of the specification is already recorded and must not be relabelled DRAFT because launch inputs remain unfilled.

## Required test layers

Unit: schema validators, state transitions, grant token bucket, byte/chunk mapping, rights boundaries, timeouts, key intervals and integer allocation. Property: conservation, deterministic ordering, no double credit, no double allocation, no over-reservation, no duplicate payout after any retry/crash sequence, changed canonical byte changes digest. Integration: provider webhook replay, database/outbox atomicity, cache and receipt spool persistence, contract append/readback, statement export permissions and native-USDC reconciliation. Adversarial: IDOR, forged signatures, replay, cross-node/cross-purpose grants, content substitution, SSRF, future timestamps, mismatched addresses/assets and expired signed transaction recovery.

Run one real-time three-hour set in staging at 1x speed, plus accelerated boundary fixtures. Exercise a node failure mid-set, peer-filled cache, explicit pause/seek and midnight rollover. Record actual rebuffering and node-switch behaviour. For load rehearsal use 100 concurrent simulated sessions for 30 minutes; label them synthetic, exclude their receipts from production accounting and report resource usage rather than claiming production scale.

Browser matrix: current stable Chrome, Firefox and Safari desktop, Safari iOS and Chrome Android at release time. Record exact versions. Audio format support, explicit play gesture, reconnect, keyboard access and proof-download flows must pass. A failure requires a documented supported-browser restriction or format fix before inviting affected users.

## Go / no-go

Go requires all applicable acceptance cases passed with artifact links, no unexplained reconciliation difference, no unresolved critical/high security defect affecting funds or private data, tested backup recovery, approved profile, actual licence/participant coverage, and named operators/support contacts. A single successful payment does not waive replay/recovery tests. No-go if any receipt-to-allocation-to-payment link is missing, signing can bypass approval, node independence is unverified or evidence is unavailable.

## Pilot versus statistical proof

The pilot demonstrates feasibility and provides early demand/participation evidence. It does not establish market-wide demand, profitable decentralisation or adversarial network security. Report cohort size, paid versus subsidised use, renewal opportunities and participant ownership alongside outcomes. Do not invent target conversion/retention percentages after seeing results.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
