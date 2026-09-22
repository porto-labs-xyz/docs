---
id: 17-open-decisions-and-risk-register
title: "Required launch inputs and residual risks"
sidebar_position: 18
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Architecture is approved

The product owner has approved the reduced scope. There is no open decision about whether to build peer delivery, a separate attestation service or six settlement modules: peer delivery is required, the latter two are excluded. This register holds external facts and release authorisations that documentation cannot manufacture. Implement the specified interfaces now; fail closed on production operations until their required inputs are supplied.

| Input | Owner | Required evidence / configuration | Blocks |
|---|---|---|---|
| L01 entity, territory and terms | Product/legal | Legal entity, offered territory, listener/artist/operator agreements and licensed caching/serving | Real customer/operator participation |
| L02 identity and billing provider | Product/integration | Selected accounts, provider-supported access/clearance/refund semantics and tested adapter | Live checkout and entitlement |
| L03 conversion and custody | Finance/security | Approved provider, custody model, actual native-USDC rail and recovery procedure | Funding/signing |
| L04 economic profile | Product/finance | Price, net-revenue deductions, reserve, rights/operator/Porto basis points, unused-budget/refund treatment | Non-fixture monetary allocation |
| L05 recipients and catalogue | Catalogue/finance | Rights agreements, all recipient snapshots, ownership evidence and territory availability | Work activation and payment |
| L06 privacy and retention | Legal/security | Notice covering nodes/client IPs, retention periods, access/export/deletion procedure | Personal-data collection and retained evidence |
| L07 deployment pins | Engineering/security | Chain ID, native-USDC metadata from issuer, reviewed framework transfer ABI, immutable package, RPC/custody versions | Mainnet execution |
| L08 operational limits | Finance/operations | Total pilot funding cap, max run/recipient amount, signer control, incident contacts and recovery drill | Mainnet signing |
| L09 independent participant cohort | Product/operations | Artist and unrelated-party host control, terms, cost collection, observation period | Claiming independent participation |
| L10 release sign-offs | Product/security/finance | G0-G6 evidence, review findings disposition and signed launch record | Inviting paying production users |

No agent may fill these fields by copying test fixtures, adopting old protocol economics silently or declaring a provider compliant without evidence. Record selected values in a private production release profile, with a public non-secret hash and appropriate public terms. Changing economic policy applies prospectively to a new subscription period; never mutate a funded period's policy snapshot.

## Residual risks accepted by the design, not proven absent

| Risk | Bound/control | What remains true |
|---|---|---|
| Fabricated/colluding receipts | Scoped grants, deduplication, inventory audit, manual holds, bounded funding | Porto and nodes remain trusted for input truth |
| Under-recording before commitment | Recorded grant/receipt reconciliation and external timestamped commitments | Unrecorded real-world events cannot be inferred from a digest |
| Artist/operator self-listening | Listener budgets and fixed funded totals; manual concentration review | Incentive gaming is possible; do not call it solved |
| Operator unavailable or expensive | Origin fallback and measured cost/effort | Pilot might not support viable independent economics |
| Lost evidence | Protected objects and restore drills | A surviving chain hash cannot recreate missing bytes |
| Wrong recipient or signing error | Ownership proof, frozen run approval, caps, restricted signer | Confirmed transfers may be unrecoverable |
| Chargeback or asset/provider failure | Company reserves, holds and reconciliation | No promise of risk-free or reversible settlement |
| Central coordination failure | Backup/recovery and disclosed trust | This is not a permissionless network |

`LEGAL/COMPLIANCE REVIEW REQUIRED` and `SECURITY REVIEW REQUIRED` identify launch evidence owners. They do not retract the product-owner's specification approval, nor do they imply any legal conclusion has been reached.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
