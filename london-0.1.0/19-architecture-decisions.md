---
id: 19-architecture-decisions
title: "Architecture decision records"
sidebar_position: 20
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Accepted decisions

All ADRs below are APPROVED as part of this specification on 22 September 2026. They replace conflicting choices in the earlier London draft.

| ADR | Decision | Reason and consequence |
|---|---|---|
| ADR-01 | Aptos Mainnet with native USDC; no PRT or new chain | Test real recording/payment without implementing consensus or token economics |
| ADR-02 | Artist and unrelated-party infrastructure is mandatory | A wholly Porto-hosted product cannot test external operation or participation |
| ADR-03 | One required node-to-node cache-fill path | Demonstrates actual peer content transfer; coordinator remains central |
| ADR-04 | Invite-only public HTTPS nodes | Avoid NAT traversal, public discovery and Sybil admission in the first release |
| ADR-05 | Complete short media chunks; no arbitrary Range accounting | Makes duration and duplicate handling exact across peers and retries |
| ADR-06 | One backend with restricted signing worker | Preserve credential boundaries without a microservice programme |
| ADR-07 | Deterministic checks and manual holds | Protect accounting integrity without building a fraud product |
| ADR-08 | One immutable append-only commitment module | External tamper evidence with no custom fund custody or claim contract |
| ADR-09 | Full canonical-file hashes and public statement index | Simple verification at pilot scale; no Merkle tree required |
| ADR-10 | Private raw evidence and salted statement artifacts | Avoid putting listener history and financial source documents on-chain |
| ADR-11 | Funded listener-period budgets and daily allocation | Preserve listener attribution and avoid overspending monthly revenue |
| ADR-12 | Reviewed ordinary transfers through one serial sender lane | Real payouts with durable replay protection; no instant-payout promise |
| ADR-13 | Peer fills earn no reward; eligible listener delivery does | Prevent paid cache-warming loops and keep the economics interpretable |
| ADR-14 | Origin fallback has an explicit retained operator share | Preserve accounting conservation and disclose central fallback income |
| ADR-15 | Technical defaults fixed; external commercial values required | Agents can implement the mechanics without fabricating business approval |
| ADR-16 | Migration portability only | Avoid building a future chain before the participation hypothesis is tested |
| ADR-17 | RocksDB TransactionDB replaces PostgreSQL as authoritative store | Build a strict deterministic ledger API and portable logical state now; speed requires measurement |
| ADR-18 | One active storage owner and serial command executor | Explicit ordering and atomic journal/state/outbox; no multi-writer database or custom replication |
| ADR-19 | Core execution has no clock, random generation, network or signing | All external observations enter as explicit admitted inputs; replay cannot repeat payments |
| ADR-20 | W0/W1 ledger is the first implementation target | Require replay, recovery and checkpoint equivalence before real integrations |

## Change procedure

Change normative behaviour only through a documented specification revision, updated API/fixtures/tests, impact review and product-owner acceptance for scope/economics changes. A production release profile can fill required values and lower operational risk limits within the specified bounds. It cannot introduce excluded capabilities, weaken replay controls or change past budget/rights snapshots. Configuration changes are effective prospectively and produce a new profile hash.

Retain historic commits and published commitments. “Revert the last draft” means replace its content with this coherent baseline while preserving working documentation integration, not erase Git history or remove Mermaid/site configuration required by the approved docs.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
