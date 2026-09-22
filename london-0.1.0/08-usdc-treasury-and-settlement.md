---
id: 08-usdc-treasury-and-settlement
title: "Funding, accounting and real payouts"
sidebar_position: 9
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Money states and ownership

GBP subscriptions are Porto company revenue. Listeners purchase access, receive no USDC balance and own no treasury crypto. A selected provider clears payments; Porto converts approved net revenue in batches to native Aptos USDC. A funded subscription-period budget is an internal allocation record, not a customer wallet. Real provider selection, tax treatment, deductions, reserve and percentage values are required launch inputs in [configuration](26-configuration-and-release-profile.md).

```mermaid
flowchart TB
  A[Authorised payment] --> B[Verified clearance]
  B --> C[Approved net GBP]
  C --> D[Confirmed treasury USDC]
  D --> E[Funded period budget]
  E --> F[Daily allocation]
  F --> G[Accounting commitment]
  G --> H[Approved payment run]
  H --> I[Confirmed artist and operator transfers]
```

Store gross GBP pence, tax/fee/refund/reserve deductions separately, approved net pence, conversion lot reference, actual net USDC received and chain evidence. Do not infer conversion from a displayed FX rate. Allocate a shared conversion lot among eligible subscription periods proportional to their approved net GBP using the largest-remainder algorithm below. Funding requires both verified clearance and a reconciled USDC receipt. Evidence can accrue before funding; monetary allocation waits and remains labelled unfunded.

## Deterministic allocation

All amounts are unsigned integer micro-USDC in storage/wire; use checked wide intermediates. GBP uses integer pence. Never float. For amount `A` and nonnegative weights `w_i`, compute `q_i=floor(A*w_i/sum(w))`; assign remaining units to descending fractional numerator remainder, ties by ascending canonical ID bytes. If all weights are zero, allocate nothing and preserve the reserve. The sum must equal A whenever positive weights exist.

1. Freeze the period's funded budget B. Allocate B across UTC service days proportional to exact covered milliseconds, ties by UTC date. This spends the monthly budget once, not once per day.
2. For each closed, unheld listener-day, sum eligible unique chunk durations per `(work_id, rights_version)`. Allocate that day's budget across those weights. Zero listening leaves that day's budget in a separately tracked unallocated reserve. It does not become Porto profit by default.
3. Split each work allocation into rights, operator and Porto shares using release-profile basis points summing to 10000, ties in order `rights`, `operator`, `porto`. Production percentages have no default. Existing protocol 70/25/5 is context, not silently ratified here.
4. Split the rights pool using the snapshotted beneficiary basis points, ties by beneficiary ID. Split the operator pool by eligible duration attributable to each serving node, ties by operator ID. A peer fill earns zero. Porto origin fallback is an explicit operator ID; its portion is recorded as Porto delivery income, not external participation.
5. Preserve listener-day/work/role contribution lines before aggregating recipient statements. A person earning both roles receives distinct statement lines even if a payment groups them to one address. Porto and origin portions remain in treasury with explicit postings, not self-transfers. No silent redistribution occurs when an operator is suspended.

Each listener-day has at most one successful allocation revision active; corrections append reversal/replacement ledger entries without deleting the prior record. A held listener-day retains its own budget until resolved. Late funding can allocate a previously closed evidence day in a later accounting run, referenced once by its original day ID.

## Worked example, synthetic economics only

A 101-unit funded budget covering two equal service days yields 51 and 50. On day one, two works have durations 1:2, yielding 17 and 34. Test-only basis points 6000/3000/1000 split 17 into 10/5/2 and 34 into 21/10/3. Work A's two equal rights holders receive 5 and 5. Its two operators with duration ratio 1:2 receive 2 and 3. Work B's sole artist receives 21 and sole operator 10. Artist totals 31, operator totals 15 and Porto 5 sum to 51. The second day's 50 remains unallocated when nobody listens. None of these test percentages are production terms.

## Daily closure and approval

Close D's sessions at midnight UTC, receive evidence until 00:10, freeze evidence, then prepare funded unheld accounting. Commit evidence and accounting as separate immutable records so missing funding cannot prevent recording usage. A finance approver independently runs the verifier over full private inputs and checks funding, rights, operator attribution, totals, holds and recipient ownership. Approval binds the exact accounting hash and payment-run hash. Changed bytes invalidate approval.

```mermaid
sequenceDiagram
  participant W as Daily worker
  participant C as Aptos commitments
  participant F as Finance approver
  participant S as Restricted signer
  participant R as Recipients
  W->>W: Freeze evidence and compute funded allocations
  W->>C: Append artifact hashes
  C-->>W: Confirmed commitment
  W->>F: Frozen run and reconciliation
  F->>S: Approve exact run hash and cap
  S->>R: Ordinary native USDC transfers
  S->>W: Reconcile each confirmed transaction
  W->>C: Append payment journal hash
```

Run payment preparation daily. Require human approval for each run; do not promise instant automatic payouts. Attempt approved runs within one business day. No minimum payout threshold in the pilot: zero lines create no transfer; positive lines remain payable. A failed recipient does not block other recipients, but the dedicated sender lane must resolve its current transaction before advancing.

## Safe transfer execution

Use one dedicated payout account and one serial transaction lane. No manual transfers from that account outside this system. Reserve the run's amount in the local ledger under lock after checking the confirmed balance minus unpaid reservations; gas is funded separately in APT. Contract commitments hold no funds. The payment worker validates the pinned native USDC metadata address, chain ID, approved recipient, amount and cumulative run cap before signing an ordinary framework transfer.

Persist immutable payment ID, allocated contribution IDs, recipient snapshot, sender sequence, expiry, exact signed transaction bytes and derived transaction hash durably before network submission. On timeout retry only those identical signed bytes. Query the hash and sender sequence. Never create a fresh transfer because a response was lost. If success is confirmed, reconcile asset, amount and recipient and mark paid exactly once. If confirmed abort, retain the failed attempt, account for gas and create a new attempt for the same obligation after correcting the cause. If absent, do not re-sign until ledger time exceeds expiry and trustworthy chain queries establish that the prior transaction did not succeed. Conflicting or unavailable evidence leaves the lane uncertain and blocked for manual reconciliation. Recovery must survive database restoration; see operations.

A reconciliation record includes chain ID, transaction hash, ledger version, success status, asset metadata, sender, recipient, amount and observed timestamp. Pending/aborted/wrong-asset transactions are not paid. Attach payment confirmations to a separate append-only journal, anchored after each run; never mutate the previously committed allocation statement.

## Exceptions

Refund before conversion reduces unfunded budget availability according to approved terms. Refund/chargeback after funding holds unallocated funds and unpaid affected obligations pending finance review. After payment, Porto bears the immediate reserve/recovery responsibility; transfers are not reversible. No negative payment amounts, customer crypto balances or invented clawback contract. Stablecoin freeze, provider outage and address loss result in a held payable and support record, not an alternate asset chosen by an agent.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
