---
id: 09-move-contract-specification
title: "Move-owned accounting and payout protocol"
sidebar_position: 10
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Authority and scope

London is an Aptos Move protocol and dapp. The `porto_london` Move package is the authoritative state machine for funded budgets, accepted aggregate usage, allocation, unpaid obligations and payout completion. The Rust coordinator authenticates participants, issues playback and peer-fill grants, validates receipts and submits bounded accepted-usage batches. It cannot create an allocation, mark an obligation paid or change a settled amount outside Move.

The package uses a configured Aptos fungible asset for settlement. Testnet uses an explicitly configured test asset only. A testnet transfer proves integration behaviour, not revenue, real USDC settlement or Mainnet readiness. Before Mainnet, the release profile must pin the chain ID, native-USDC metadata, framework ABI, package address and administrative accounts.

Audio bytes, raw receipts, listener identities, payment-provider data, node diagnostics and indexed presentation data remain off-chain. They are private evidence or rebuildable projections, not a second financial ledger. The protocol exposes opaque identifiers and bounded public events only.

There is one streaming-node role. Whether an artist or another participant operates a node is an off-chain admission attribute, not a distinct Move role. PRT, a Porto chain, staking, a separate attestor network, an on-chain order book and a six-contract settlement stack are outside London 0.1.0.

## Package state

`ProtocolConfig` holds the immutable package version, settlement-asset binding, administrator, trusted coordinator, pause flag and configured limits. The administrator cannot rewrite accounting state or paid history. Replacing an irrecoverably compromised package requires a new immutable package and an explicit predecessor record.

Use `aptos_std::table::Table` as the baseline keyed collection for independently addressed records. `BigOrderedMap` remains a benchmarked alternative, not an additional production collection. Storage selection is not a scale certification. Every transition uses bounded inputs and must meet the current testnet limits before a Mainnet selection.

| State | Key | Required properties |
|---|---|---|
| Funding period | opaque period ID | Asset, funded amount, remaining amount, frozen policy snapshot, open or closed state |
| Rights snapshot | versioned work ID | Beneficiaries and basis points totalling 10,000, immutable once referenced |
| Usage bucket | opaque period and bucket ID | Accepted aggregate eligible units, source range and stable payload digest |
| Allocation page | period and page ID | Deterministic inputs, cursor, totals, remainder state and finalisation status |
| Payout obligation | opaque obligation ID | Recipient, exact asset amount, source allocation and unpaid or paid state |
| Replay guard | reporting lane and range | Non-overlapping accepted sequence range and payload digest |

The contract must never keep a listener address, email, track title, raw receipt or a per-listener listening timeline in publicly readable state or events.

## Entry points and invariants

The following semantic interface is normative. Concrete Move types and the selected fungible-asset ABI must be pinned and tested before deployment.

```text
initialize(publisher, administrator, coordinator, settlement_asset, limits)
open_funding_period(administrator, period_id, funded_amount, policy_hash)
register_rights_snapshot(administrator, work_id, version, beneficiaries, basis_points)
submit_usage_batch(coordinator, period_id, lane_id, sequence_start, sequence_end,
                   bucket_id, payload_digest, aggregate_usage)
begin_settlement(coordinator, period_id, settlement_id)
settle_page(coordinator, settlement_id, page_id, bounded_bucket_inputs)
finalize_settlement(coordinator, settlement_id)
pay_obligation(payer, obligation_id)
pause(administrator, paused)
```

`open_funding_period` escrows or otherwise proves the exact configured asset amount before the period becomes fundable. A policy snapshot contains the approved rights, operator and Porto split rules for that period. The package rejects an unfunded period, changed policy hash, non-positive funding, wrong asset and duplicate period ID.

`submit_usage_batch` accepts only the configured coordinator. It checks a stable batch ID and payload digest for exact-retry success, rejects conflicting reuse, and rejects overlapping reporting ranges for a lane. A closed period accepts no further usage. The batch contains bounded eligible aggregate units derived from private receipt evidence. It does not accept server-provided recipient amounts.

`begin_settlement` freezes the period's denominator and policy snapshot. `settle_page` calculates proportional allocation from the accepted aggregate units and frozen inputs with checked integer arithmetic. It carries numerator remainders and a cursor across pages, so paging cannot alter totals. The sum of allocation, unallocated reserve and prior settlements must equal the funded amount exactly. It creates deterministic unpaid obligations only once. `finalize_settlement` succeeds only when every frozen bucket is consumed, every remainder is assigned by the documented canonical-ID tie break and conservation holds.

`pay_obligation` atomically checks that the obligation is unpaid, transfers the pinned settlement asset to its registered recipient and marks the obligation paid in the same transaction. A failed transfer leaves the obligation unpaid. The coordinator cannot mark payment complete, and a projection cannot infer completion from a submitted transaction or lagging indexer.

Corrections are append-only compensating transitions before payout. They reference the original accepted batch or allocation, never overwrite settled state, and cannot silently retarget a paid obligation. A correction after payment is a new, explicitly authorised financial obligation or credit, subject to the release policy.

## Events, queries and projections

Emit compact events for funding, usage acceptance, settlement-page completion, settlement finalisation, obligation creation, payout completion, pause changes and corrections. Events include opaque IDs, version, amounts, source references and transaction context. They exclude private receipt content and listener data.

View functions return a keyed period, bucket, settlement or obligation only. Reporting, statements and the dapp read a Rust-maintained event indexer projection, which always displays its indexed ledger version. A lagging projection is not final financial state. The independent Rust verifier reads the Move state and relevant events, replays the published bounded calculation inputs and reports a proof verdict.

## Roles and key separation

The package publisher, administrator, coordinator and payout account are distinct accounts. The coordinator is a restricted operational signer and cannot alter configuration, drain a funding period or approve policy. Testnet may use test accounts with the same separation. Mainnet requires the review and release-profile evidence in [launch inputs](17-open-decisions-and-risk-register.md).

## Required testnet gates

Tests must cover initialisation takeover, unauthorised roles, test-asset binding, funding conservation, fixed rights snapshots, exact retry, conflicting retry, reporting-range overlap, closed-period rejection, bounded multi-page allocation, deterministic remainder assignment, duplicate payout, failed transfer, correction lineage and projection lag. Benchmark `Table` and `BigOrderedMap` with realistic bounded records, contention and persistent state before locking the production collection choice. A passing unit test or testnet transfer is not a Mainnet payout or pilot result.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
