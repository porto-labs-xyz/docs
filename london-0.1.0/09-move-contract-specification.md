---
id: 09-move-contract-specification
title: "Move contract specification"
sidebar_position: 10
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Shared contract rules

All interfaces below are **pseudocode only**, not compilable Move. `SECURITY REVIEW REQUIRED`: exact framework API, resource-account or object custody and upgrade compatibility must be pinned and audited before coding/deployment. Six modules share a package address and private capability boundaries. No module mints USDC, controls Aptos consensus or evaluates playback truth.

Types: `Id=32 bytes`, `Hash=32 bytes`, `Amount=u64 micro-USDC`, `Timestamp=u64 UTC seconds`, `Version=u64`, `Bps=u16`, `Address=32-byte Aptos address`. Every entry receives authenticated signer(s), validates chain-bound package context and emits an operation ID. Array bounds and checked arithmetic are mandatory. `friend` below means package-private capability-restricted access; do not expose signer/custody capabilities to callers.

Role checks read the admin module. Upgrade authority is the admin quorum with a proposed 48-hour timelock for all six modules, pinned code hash and pre/post invariant checks. No hot service key has publishing capability. Application upgrades do not imply control of Aptos protocol governance. All modules permit read-only inspection while paused. Emergency pause blocks affected mutations but never alters history.

Business duplicate calls with identical payload return the existing result/no new event. The same ID with different canonical payload aborts `E_ID_CONFLICT`. Persist tombstones permanently on-chain. Transaction sequence numbers are additional transport protection, not business idempotency. Off-chain retry after timeout queries by operation ID and transaction hash before submitting again.

On-chain records do not store an assumed current transaction hash. Indexers bind emitted events to transaction hash, ledger version and event index. Every event includes `schema_version:u16=1`, `op_id:Id`, and `actor:Address`; registry events add object ID and version, commitment events add root/count/policy, and monetary events add settlement ID, pinned asset and exact u64 amount. `PayoutTransferred` additionally carries global payout ID, leaf index and recipient. Event fields never include private reason text or listener data.

## work_registry

Purpose: immutable work/rights commitments and effective availability. Non-goals: licence enforcement, audio storage and personal metadata.

Storage: `Works: Table<Id, Work {master_commitment:Hash, versions:Table<Version,Rights>, active_version:Version, disabled:bool}>`; `Rights {rights_commitment:Hash, effective_at:Timestamp, recipient_snapshot_root:Hash}`. Store no title, listener data or legal agreement. Private catalogue retains disclosed beneficiary mapping.

Public entries: `register(catalogue, op_id, work_id, master_commitment, rights_version, rights_commitment, recipients_root, effective_at)`; `append_rights(catalogue, op_id, work_id, next_version, commitment, recipients_root, effective_at)`; `disable(guardian_or_catalogue, op_id, work_id)`. Views: `get(work_id,version)`. Friend: `assert_known(work_id,version)` only to batch registry. Effective time is non-retroactive, versions increase by one, master commitment never changes. Duplicate register must match exactly.

Events: `WorkRegistered`, `RightsVersionAdded`, `WorkDisabled`, each with operation ID, work, version and commitment. Registration/appends obey catalogue pause. Disable remains available under pause. Re-enable requires admin quorum and catalogue clearance through a new version, not an override of old rights.

Failures: unknown work, changed master, retroactive version, unauthorised role, invalid hash/empty root, disabled work at new batch preparation. Disable does not delete existing valid obligations. Tests: duplicate/conflicting ID; out-of-order version; unauthorized caller; boundary effective time; pause; no mutation of historical roots.

## operator_registry

Purpose: approved operator/key history and reward-account version references. Non-goals: staking, slashing, validator membership or adjudicating performance.

Storage: `Operators: Table<Id, Operator {status, key_versions:Table<Version, Key {digest, valid_from, valid_until}>, account_versions:Table<Version, Address>, suspension_at}>`. Registration is permissioned; receipt key material may remain off-chain with digest on-chain. Key validity history is append-only.

Entries: `approve(admission, op_id, operator_id, key_digest, account, effective_at)`; `rotate_key(admission, op_id, operator_id, key_digest, next_version, effective_at)`; `suspend(guardian_or_admission, op_id, operator_id, effective_at)`; `reinstate(admin, op_id, operator_id, review_commitment)`; `append_account(admin, op_id, operator_id, account, next_version, effective_at)`. Friend: `assert_registered(operator_id,key_version)` to batch registry. Views expose status and version history.

Events: `OperatorApproved`, `OperatorKeyRotated`, `OperatorSuspended`, `OperatorReinstated`, `OperatorAccountAdded`. Invariants: no self-admission, version monotonicity, no overlapping active key intervals except explicitly bounded rotation grace, no retroactive account rewrite. Suspension blocks new approved delivery batches involving the affected interval off-chain; it does not confiscate paid funds. On-chain batch hold is separate.

Pause: new admissions/rotations/account activation blocked; suspension remains possible. Failure cases: unknown ID, invalid interval/address, missing review, self-admission, expired key version. Tests: compromised-key window, rotation crossing a receipt, suspension race, reinstatement quorum and historical account immutability.

## stream_batch_registry

Purpose: commit Porto-approved evidence roots and policy versions. Non-goals: receiving raw receipts, validating human attention or recomputing private fraud decisions.

Storage: `Batches: Table<Id, EvidenceBatch {root, count:u32, policy_hash, window_start, window_end, attestor_version, state:committed|held|revoked, payload_hash}>`. Unique evidence assignment is enforced in the private ledger; the chain cannot discover duplicate private receipts across different roots. Independent manifest review is therefore necessary.

Entries: `commit(attestor, op_id, batch_id, root, count, policy_hash, window_start, window_end)`; `hold(guardian_or_reviewer, op_id, batch_id)`; `release(admin, op_id, batch_id, review_commitment)`; `revoke(admin, op_id, batch_id, reason_commitment)`. Friend `assert_usable(batch_id)` only to settlement. Empty/count-out-of-bound batches abort. No mutable root. Commit does not move money.

Events: `EvidenceBatchCommitted`, `EvidenceBatchHeld`, `EvidenceBatchReleased`, `EvidenceBatchRevoked`. Invariants: window start less than end, count positive and bounded, policy version registered, signer active, root immutability. Pause blocks commit/release; hold/revoke permitted. Every hold/revoke entry atomically invokes a package-private admin capability to pause all settlement transfers before changing evidence state. This capability can only pause, never unpause. Unpause requires admin review of all affected settlement references and revalidation of their usable evidence. A runbook-only asynchronous assumption is insufficient.

Failures: stale signer, reused conflicting ID, future window, invalid policy, held source. Tests: revoked batch cannot fund settlement, multiple-batch root manifest references, payload replay, atomic hold propagation, no direct transfer capability.

## settlement

Purpose: bounded reservation and exact committed-leaf USDC transfers. Non-goals: pricing fiat, selecting economics, autonomous rights adjudication and clawbacks.

Storage: `Settlements: Table<Id, Settlement {manifest_root, evidence_set_root, policy_hash, leaf_count:u32, total:Amount, remaining:Amount, paid_count:u32, state:open|held|closed, recipient_snapshot_root}>`; `Leaves: Table<(Id,u32), LeafState {payload_hash, status:paid|held|cancelled}>`; `PayoutIds: Table<Id, Hash>`. Store evidence batch IDs in a bounded list, or an approved grouping commitment with deterministic off-chain review and explicit trust disclosure. London proposes at most 100 referenced evidence batches per settlement; partition larger runs by stable IDs.

Entries: `create(finance_approver, op_id, settlement_id, manifest_root, evidence_ids, policy_hash, count, total, recipient_snapshot_root)`; `pay(executor, op_id, settlement_id, leaves, proofs)`; `hold(guardian, op_id, settlement_id)`; `hold_leaf(reviewer, op_id, settlement_id, index)`; `release(admin, op_id, settlement_id, review_commitment)`; `cancel_unpaid(admin_and_finance, op_id, settlement_id, index, leaf, proof, case_commitment)`; `close(executor, op_id, settlement_id)`; `release_leaf(admin, op_id, settlement_id, index, review_commitment)`. Friend calls only `treasury_controls.reserve`, `transfer_reserved`, `release_cancelled`. Views expose totals, leaf status and payout ID.

`create` verifies each evidence batch usable, policy active, all bounds, unique settlement ID, and reserves total atomically. Roots are approved inputs; the module cannot prove the root's leaf amounts sum to declared total before execution. Independent recomputation plus on-chain remaining-budget enforcement prevents overspend, but a bad root can strand funds or underpay. Cancellation/reissue is the remedy, never silently changing the root.

```text
pay(settlement_id, leaves[1..MAX_PAY_LEAVES], proofs):
  assert not transfer_paused and settlement.state == open
  assert all referenced evidence batches remain usable
  for each leaf:
    verify fixed binary encoding, Merkle path and index within leaf_count
    assert leaf.chain/package/asset/settlement match deployment and root
    assert payout_id unused OR recorded with exactly same payload and paid
    if already identically paid: continue
    assert leaf status neither held nor cancelled
    assert recipient equals committed address, amount > 0
    assert amount <= remaining; checked_sub remaining
    record global payout_id and leaf paid status
    treasury.transfer_reserved(settlement_id, recipient, amount)
    emit PayoutTransferred(payout_id, index, recipient, asset, amount)
  commit all state and transfers atomically, or abort all
```

Proposed `MAX_PAY_LEAVES=20`, manifest leaf count maximum 10000 and proof depth maximum 14. These are conservative test bounds, not benchmark claims. Frozen/invalid recipient failure aborts the transaction; retry unaffected leaves separately, hold the failed leaf, keep its reservation. Repeated execution of an already paid identical leaf is a no-op; no extra transfer/event. A conflicting global payout ID aborts even in another settlement. `close` requires every index paid or cancelled and remaining zero; an unclaimed remainder cannot be swept by an executor.

Cancellation requires a valid unpaid leaf proof and releases exactly its amount, recording permanent tombstone and recovery case. Reissue needs a new payout ID linked in the private ledger and new approved settlement; no payment path exists for the cancelled leaf. Held leaves must first be cancelled or independently released. `release_leaf` is admin-only with review commitment and explicit restoration to unpaid status; it never clears paid/cancelled tombstones.

Events: `SettlementCreated`, `SettlementHeld`, `LeafHeld`, `LeafReleased`, `LeafCancelled`, `PayoutTransferred`, `SettlementClosed`. Invariants: total equals remaining plus transferred plus cancelled amounts; no double pay; wrong asset impossible; package never possesses issuer mint/freeze powers; admin cannot rewrite paid leaf. Tests: reordered/forged proofs, duplicate leaves in one call, overlapping chunks, wrong domain, overflow, underfunded root, frozen asset, pause race, crash after submission and cancel/pay race. Include `release_leaf` in the audited ABI.

## treasury_controls

Purpose: segregated company settlement vault and limits. Non-goals: fiat custody, provider conversion, stablecoin issuance or recipient recovery.

Storage: `Vault {asset_metadata:Address, store_capability, reserved:Amount, per_epoch_cap, epoch_used, min_buffer, allowed_withdraw_destinations}`; `Reservations: Table<Id,Amount>`; permanent operation IDs. Asset identity is fixed at initialization and cannot change through ordinary policy update.

Entries: `deposit(treasury_funder, op_id, amount)` transfers the pinned native asset from Porto's account; `withdraw(admin_and_finance, op_id, destination, amount, approval_id)` only to pre-approved Porto custody destination after timelock, and only free balance above buffer. Friend `reserve(id,amount)`, `transfer_reserved(id,to,amount)`, `release_cancelled(id,amount)` callable only by settlement. Views: actual vault balance, reserved, free and epoch usage.

Events: `TreasuryFunded`, `BudgetReserved`, `ReservationSpent`, `ReservationReleased`, `TreasuryWithdrawn`. Invariants: actual vault balance >= sum reservations; free balance checked at execution; cap enforced on reservation and not reset by replay/cancellation within epoch; only pinned asset enters accounting. Deposit may remain enabled during emergency pause to restore liquidity; withdraw/reserve/transfer are blocked under respective pause. Admin cannot withdraw reserved funds.

Failures: wrong asset, insufficient free funds, exceeded cap, destination not allowlisted, changed reservation ID. Tests: concurrent reserve, cap exhaustion, cancellation cap behaviour, recipient transfer abort, actual/store accounting reconciliation and compromised executor cannot withdraw.

## admin_and_emergency_controls

Purpose: narrow role, policy and emergency authority. Non-goals: a DAO, stake voting or Aptos governance.

Storage: `Roles {role -> approved address/version/validity}`; `Policies {version -> hash/effective_epoch/bounds}`; `Pauses {catalogue,batches,reservations,transfers}`; `Proposals {id,payload_hash,ready_at,executed,cancelled}`. Signer separation enforced by disjoint role addresses; custody review verifies separate human/device control.

Entries: `propose(admin_quorum, id, payload_hash, ready_at)`; `execute(admin_quorum, id, exact_payload)`; `cancel(admin_quorum, id)`; `pause(guardian, op_id, scope, incident_commitment)`; `unpause(admin_quorum, op_id, scope, review_commitment)`. Friend `assert_role`, `assert_unpaused`, `policy` are read-only. No public capability extraction.

Events: `ChangeProposed`, `ChangeExecuted`, `ChangeCancelled`, `Paused`, `Unpaused`. Bounds: split sum 10000, cap positive within reviewed ceiling, delay at least 48 hours except pause, policy effective after current economic epoch, immutable past policy hashes. Upgrade authority uses the same quorum/timelock with framework-supported compatible upgrades only; incompatible storage needs new package plus migration review.

Tests: timelock edge time, changed payload, repeated execute, revoked signer, hot-key upgrade attempt, unpause without review, policy change mid-epoch, incompatible upgrade and role overlap. Governance changes cannot retroactively alter allocation snapshots.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
