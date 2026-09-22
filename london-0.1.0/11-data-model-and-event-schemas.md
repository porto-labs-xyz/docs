---
id: 11-data-model-and-event-schemas
title: "Data model and event schemas"
sidebar_position: 12
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Persistent records

| Entity | Key and constraints | Source of truth |
|---|---|---|
| Identity | random listener ID; provider subject unique | Restricted identity store |
| Subscription | subscription ID; service interval; provider payment references | Finance plus entitlement projection |
| PaymentEvent | `(provider,event_id)` unique, signed payload digest | Encrypted provider evidence |
| ConversionLot | instruction ID unique, GBP debit, USDC receipt, state | Reconciled finance ledger |
| ListenerPeriodBudget | `(subscription_id,day,allocation_version)` unique; no duplicate spent budget | Append-only finance postings |
| Work/rights/rendition | immutable content identity and version | Catalogue with encrypted clearance evidence |
| Session | random ID, listener, work, lease generation, expiry | Gateway DB |
| Grant | random ID, unique nonce digest, exact range, assigned node | Gateway DB, single consume |
| Receipt | `(operator_id,key_version,receipt_id)` and grant/request uniqueness | Immutable evidence object plus index |
| Decision | decision ID/revision, input hash, rule hits, approved/held/rejected | Fraud store |
| EvidenceBatch | batch ID, root, policy, counts, source membership unique | Frozen private manifest and chain commitment |
| Accrual | allocation ID, listener-day/work/rights/operator attribution | Deterministic private ledger |
| Settlement/leaf | settlement/index and global payout ID unique | Manifest and on-chain state |
| Dispute | case ID, revision, actor, affected allocations | Append-only case events |
| AuditExport | export ID, scope, digest, access expiry | Restricted export store |

Debit/credit journal is append-only and balanced per currency, with `journal_id`, `posting_id`, `account`, signed integer amount, currency, source business ID, reversal link and effective/recorded time. Cross-currency conversion uses linked balanced journals and explicit FX/fee accounts, not a mixed-currency sum. Balances are projections, recomputable from postings. SQL constraints enforce uniqueness; a worker lease does not substitute for a database constraint.

## Event envelope

```json
{
  "schema_version": "london.v1",
  "event_id": "evt_0001",
  "event_type": "receipt.accepted.v1",
  "aggregate_id": "rcpt_0001",
  "aggregate_version": "1",
  "occurred_at": "2026-09-22T12:00:00Z",
  "recorded_at": "2026-09-22T12:00:01Z",
  "correlation_id": "corr_0001",
  "causation_id": "req_0001",
  "payload": {"receipt_id":"rcpt_0001","evidence_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}
}
```

Example values are synthetic. Schema validation rejects unknown required-version fields; additive optional fields require compatibility fixtures. Decimal strings contain only canonical digits, no sign/leading zero except zero. Money cannot be a JSON float. IDs in examples are illustrative; production IDs use CSPRNG 128-bit minimum; nonces/salts use 256 bits. Contract IDs are 32-byte domain-separated digests of internal IDs.

## Domain events

| Event | Required payload beyond envelope | Consequence |
|---|---|---|
| `payment.cleared.v1` | payment_id, gross_gbp_minor, provider_record_hash | Reconciliation pending, not funded |
| `treasury.confirmed.v1` | lot_id, usdc_micro, chain_id, tx_hash, ledger_version | Lot available subject to finance approval |
| `session.closed.v1` | session_id, closure_reason, manifest_hash | Eligible for evidence evaluation |
| `fraud.decided.v1` | decision_id, revision, state, policy_hash, evidence_hash | Hold/reject/approve allocation inputs |
| `batch.committed.v1` | batch_id, evidence_root, transaction/version | Attestation commitment confirmed |
| `allocation.accrued.v1` | allocation_id, budget_id, usdc_micro, policy_hash | Internal liability only |
| `settlement.created.v1` | settlement_id, root, total_micro, transaction/version | Reserved on-chain obligation |
| `payout.confirmed.v1` | payout_id, recipient, asset, amount_micro, tx_hash, ledger_version, event_index | May show paid |
| `dispute.resolved.v1` | case_id, revision, outcome, adjustment_ids | Correction, not historical overwrite |

Consumers enforce per-aggregate monotonically increasing revision. Out-of-order events park until gaps are fetched. Duplicate event IDs do not trigger effects. A contradictory duplicate is a security/reconciliation incident. Store schema/policy version with every output; reprocessing is deterministic under pinned input and policy.

See [wire contracts](21-wire-and-commitment-contracts.md) for receipt fields, signed bytes and commitment encoding; see `openapi.json` for endpoint request/response validation.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
