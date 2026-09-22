---
id: 13-operations-observability-and-incidents
title: "Operations, observability and incidents"
sidebar_position: 14
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Environment topology

Local: synthetic identity/payment adapters, local media fixtures and local chain or mocked chain adapter, always labelled simulation. Staging: isolated AWS account, private origin/evidence, test identities, provider sandbox, Aptos testnet and test assets. Mainnet: separate AWS account, reviewed custody, pinned Aptos Mainnet/asset/package and real provider account. No production customer records in lower environments.

A release manifest pins image/package hashes, schema/policy versions, chain and asset, signer roles, limits, migrations, review receipts and rollback action. Canary playback uses internal accounts and excluded synthetic evidence. Schema changes use expand/migrate/contract; do not remove old readers while queues still hold old-version events.

## Proposed SLOs and alerts

All numbers here are proposed test targets pending D11, not observed production metrics. Monthly entitlement/session availability target 99.9%; p95 session issuance below 500 ms excluding external login/payment, p95 regional first audio below 2 seconds, receipt durable-ingest p95 below 5 seconds. Daily settlement preparation target within 4 hours after the evidence watermark for funded unheld inputs. No payout-latency promise through provider/chain outages.

Metrics: grant/receipt rejection by code, unknown signature/key, nonce replay, origin fallback, operator health and integrity, unique credited duration, held value, reviewer age, queue lag, duplicate/out-of-order events, unallocated/held/reserved/paid totals, provider variance, vault free/reserved, sponsor APT runway, transaction abort rate, chain/indexer lag and export access. Labels must not contain listener IDs or IPs.

Page immediately on integrity failure, wrong asset, unbalanced journal, reserve invariant failure, unauthorised signing or paid-state mismatch. Page on chain/indexer lag over 5 minutes, ingestion lag over 5 minutes or unhealthy serving pool over 2 minutes. Alert finance on any reconciliation variance before funding release; never auto-tolerate monetary mismatch. Node probes every 30 seconds, three misses remove new routing, recovery requires three passing probes and no unresolved security hold. Tune and ratify thresholds before launch.

## Incident runbooks

| Incident | Immediate containment | Diagnose/recover | Evidence to resume |
|---|---|---|---|
| Payment failure/ambiguous conversion | Hold affected funding lot; stop duplicate instruction | Query immutable provider reference, reconcile statement/bank/chain | Finance reviewer signs exact matched amounts |
| Chain/RPC outage | Pause new reservations/transfers; persist queue | Compare independent endpoints, inspect known tx hashes and sequence numbers | Consistent committed versions and no duplicate business IDs |
| Operator outage | Stop new grants; reissue only missing intervals to origin | Verify evidence from old request, health probes and cache digest | Passing probes; no double duration credit |
| Content-integrity failure | Quarantine asset/node and stop serving rendition | Rehash master/manifests, inspect supply chain and keys | Clean verified assets, new version if bytes changed, security approval |
| Fraud spike | Hold affected listener-days/operators and cap intake | Compare pinned policy, independent receipts, collusion patterns | Reviewed case cohort and tested rule revision |
| Compromised key | Revoke grants/role, pause affected batch/payment path | Define compromise interval, enumerate transactions and evidence, rotate custody | Independent review, reconciliation, remediation drill |
| Bad deployment | Stop rollout; disable offending off-chain feature | Roll back image/config if schema compatible; repair via forward migration otherwise | Canary/contract tests and reconciled queues |
| Stablecoin freeze/depeg/provider insolvency | Pause new conversion and affected payouts | Finance/legal/provider review; do not substitute another asset silently | Approved recovery and recipient communications |

Incident commander records UTC timeline, affected IDs, containment actions and approvers. Security leads key/integrity incidents; finance leads money reconciliation; operations coordinates restoration. Keep raw evidence restricted. Communications disclose actual delayed/paid state, not speculation.

## Rollback boundary

Off-chain image/config can roll back if persisted schema/policy compatibility holds. Replaying workers uses business-ID deduplication. An on-chain committed transfer is irreversible by Porto; never label a compensating payment a rollback. Pause, audit and use a reviewed forward package upgrade or new settlement correction. A package upgrade cannot erase balances already transferred. Immutable source roots and paid tombstones survive all recovery paths.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
