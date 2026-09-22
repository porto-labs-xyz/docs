---
id: 09-move-contract-specification
title: "One append-only commitment contract"
sidebar_position: 10
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Scope

Implement exactly one custom module, `london_commitments`. It stores artifact digests and links, accepts no USDC, calculates no royalties and executes no payouts. Work/operator registries, claim proofs, reserve contracts and on-chain fraud state are outside this release. The following is normative pseudocode, not tested or deployable Move.

Deploy the package under an immutable upgrade policy after staging review. Package publisher/admin is an externally controlled administrative account requiring two human approvals; the concrete account mechanism is pinned in the release profile and reviewed before Mainnet. Runtime writer is a separate restricted account. Immutable code is intentional: a defect requires a new deployment and explicit predecessor link, not rewriting prior state.

## Storage and interface

```text
Registry {
  admin: address, writer: address, paused: bool,
  count: u64,
  records: Table<vector<u8>, Record>
}
Record {
  batch_id: bytes32, kind: u8,
  artifact_hash: bytes32, item_count: u64,
  window_start_ms: u64, window_end_ms: u64,
  parent_id: bytes32, supersedes_id: bytes32,
  schema_version: u16, submitted_by: address,
  committed_at_seconds: u64
}
initialize(publisher, admin, writer) // exactly once, publisher account only
append(writer, batch_id, kind, artifact_hash, item_count,
       window_start_ms, window_end_ms, parent_id, supersedes_id, schema_version)
set_writer(admin, new_writer)
set_paused(admin, paused)
get(batch_id) -> Record
configuration() -> (admin, writer, paused, count)
```

`kind`: 1 evidence, 2 accounting, 3 statement-index, 4 payment-journal, 5 correction. All hashes and IDs are exactly 32 bytes. IDs are the domain-separated UUID digest defined in [wire contracts](21-wire-and-commitment-contracts.md). All-zero bytes mean absent optional parent/supersedes reference; a batch ID or artifact hash cannot be zero. Schema version is exactly 1. Empty evidence days are valid with item count zero; no fake receipt is needed. Require start less than end; end cannot be later than current chain time plus 60 seconds. Daily windows are UTC; later correction/payment records carry the covered original window.

The local contract view returns stored records directly; SDK callers compare exact fields, not event text.

Evidence has no parent. Accounting's parent is its evidence batch. Statement-index's parent is accounting. Payment-journal's parent is accounting and can cover successive payment runs. Correction has both an existing superseded record and its original parent (or zero if correcting root evidence). Parent references must already exist in this package; no cyclic reference or self-reference. Only kind 5 accepts a nonzero supersedes reference. Multiple corrections form a linear chain: off-chain publication checks and verifier enforce lineage; the contract must also keep `latest_correction: Table<bytes32,bytes32>` and reject a correction whose target already has a correction. A correction's parent equals its target's parent. Kind 5 never replaces stored target bytes.

## Append algorithm

```text
require signer == registry.writer
payload = all caller fields except signer and chain-generated timestamp
if batch_id exists:
    require all payload fields exactly match stored record
    return existing record without new event
require not paused
validate lengths, kind, schema, window and reference types
require new batch_id is nonzero and count will not overflow
if correction: require superseded record exists and has no later correction
store immutable Record with signer and chain timestamp
if correction: record latest_correction[target] = batch_id
increment count
emit CommitmentAppended(all Record fields)
```

The exact duplicate check is allowed while paused to support uncertain-submit recovery; it never creates a new record. Signer authorisation still applies. `set_writer` rejects zero/admin collisions as defined by key-separation policy; runtime writer cannot be admin. `set_paused` can be repeated idempotently. Neither admin entry may change a record or delete a correction link. Administrator cannot rotate itself in this release; losing administrative control requires a documented new deployment, preserving old proofs.

Events: `RegistryInitialized(admin,writer)`, `CommitmentAppended(record)`, `WriterChanged(old,new)`, `PauseChanged(paused)`. No listener ID, email, work title, raw receipt, private reason or payment-provider reference appears on-chain. Item count and covered window are public metadata.

## Failure contract

| Abort | Meaning |
|---|---|
| E_UNAUTHORIZED | Wrong publisher/admin/writer |
| E_ALREADY_INITIALIZED | Registry already exists |
| E_PAUSED | New append disabled |
| E_ID_CONFLICT | Same batch ID, different payload |
| E_FORMAT | Wrong length, zero ID/hash, kind or version |
| E_WINDOW | Invalid/future time window |
| E_REFERENCE | Missing/wrong-type parent, invalid correction target or branch |
| E_OVERFLOW | Count arithmetic overflow |

No friend entry points or transfer capabilities are required. All append storage mutation occurs atomically with the event. Off-chain publisher persists intended payload and signed transaction before submission, resolves uncertain hashes and verifies stored bytes after confirmation. An event without matching expected stored record does not pass verification.

## Required tests and limits

Unit/adversarial tests cover initialisation takeover, wrong signer, writer rotation, pause, duplicate success without extra event, conflicting duplicate abort, invalid references, branching correction, future window, empty batch and immutable historical reads after admin operations. Golden digest fixtures verify exact record fields across backend/Move/verifier. Confirm immutable package policy and actual ABI on staging before recording the package address in a signed release profile. `SECURITY REVIEW REQUIRED` applies to implementation and framework API selection, not to adding the five removed modules.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
