---
id: 13-operations-observability-and-incidents
title: "Operations, recovery and incidents"
sidebar_position: 14
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Environments

Local uses fixture identity/billing, object-storage emulator, local database and Aptos localnet/testnet. Staging uses separate provider sandbox accounts, buckets, keys, database and testnet assets with persistent visible TEST labels. Production uses the approved profile, native Aptos Mainnet USDC and independently controlled nodes. Never let a test environment write Mainnet, reuse production keys or claim a test payment is revenue.

Pin application/node image digests, migrations, schema versions, profile hash, contract package address, asset metadata and RPC endpoints in the release record. Keep the docs deployment separate from application deployment. Release one backend plus workers and a node container; orchestrator choice must not add a new product subsystem.

## Pilot targets, not measured results

| Signal | Target / action |
|---|---|
| Node heartbeat | Every 20s; ineligible after 60s stale |
| Node probe | Every 20s; remove after three failures; probe bytes never payable |
| Playback first byte | 3s per attempt before fallback |
| Receipt delivery | Retry immediately then backoff; accepted only within 10min of consumption |
| Evidence closure | Start at 00:10 UTC for previous day; alert if uncommitted after 1h |
| Accounting | Prepare within 1h of funding and evidence becoming available; holds explicit |
| Payout | Attempt approved run within one business day; alert any uncertain transfer immediately |
| Pilot availability | Measure end-to-end successful chunk delivery, fallback rate and rebuffer time; no unsupported SLA promise |
| Backup target | Database RPO at most 5min, restore target 4h; verify in staging |

Metrics partition real paid playback, free/test playback, peer fills, probes and Porto fallback. Record independent-node share, receipt rejection reasons, chain delays, unpaid obligations, funding mismatch, node costs and participant support time. Avoid account-level PII in metrics labels. Alerts go to the configured internal operations channel; no public fraud accusation is generated automatically.

## Node durability

Before serving, persist the consumed grant/request in a local journal. After finishing, fsync the signed receipt to the spool before accepting more work that could exhaust reserved spool space. Retry until the coordinator acknowledges durable storage. A crash mid-transfer creates a failed/missing receipt, not invented full credit. A restart must not re-serve a consumed grant. Disk-full stops accepting new grants and reports unhealthy. Cache is disposable; receipt spool is not.

## Backup and financial recovery

Use automated PostgreSQL backups plus point-in-time recovery, retained object versions and separately recoverable secrets. Run a staged restore before launch. Record every signed payout attempt in a second encrypted durable journal before broadcast, so database RPO does not become permission to double-pay. The payment worker must refuse broadcast unless both stores acknowledge the signed payload/hash. Restoring the database starts with all signing disabled; compare the external journal, sender sequence, transaction history and confirmed chain balances, reconstruct missing attempts and reservations, then obtain finance approval to resume. A backup restore never just resets a payment to prepared.

Commitment recovery compares each frozen artifact/hash with contract storage; retry identical payload or mark confirmed. Never publish a different hash under the old batch ID. Missing artifact bytes are an incident even if their commitment survives on-chain.

## Runbooks

| Incident | Immediate action | Resume condition |
|---|---|---|
| Provider failure | Keep verified existing entitlement until its expiry; stop new uncertain clearance/funding | Verified event replay and reconciliation |
| Aptos/RPC outage | Queue commitments/payments; show delayed state; preserve playback evidence | Consistent ledger observations and all uncertain attempts resolved |
| Operator outage | Remove from routing; bounded fallback | Fresh health, verified cache and successful probe |
| Content mismatch | Quarantine chunk, suspend source, hold affected unpaid days | Manifest comparison, clean refetch, documented admin release |
| Suspicious usage | Hold affected listener-days and optionally suspend node | Recorded manual decision with evidence |
| Node/gateway key compromise | Revoke key, stop new consumption, rotate and identify affected interval | New keys, expired old grants and reviewed unpaid evidence |
| Treasury key compromise | Disable signing, revoke custody access, preserve evidence, reconcile outgoing transfers | New approved custody and finance/security incident clearance |
| Bad off-chain release | Stop writers/signers; roll back compatible code | Migration compatibility and replay/invariant checks |
| Bad immutable contract | Stop append, preserve old references, publish corrected package only after review | New release record and explicit chain/package boundary |
| Lost evidence or database | Stop accounting/signing, restore and reconcile | Recovery checklist complete; no unexplained missing attempts |

## Rollback and support

Use expand/contract database migrations; do not remove a field while an old worker can write it. Rollback must not delete posted entries, rewind chain history or retry unknown transfers. Refunds and corrections are new events. Maintain a named support contact for listener access, artist statement questions and operator onboarding; one existing support channel is enough.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
