---
id: 21-wire-and-commitment-contracts
title: "Wire encoding and commitment contracts"
sidebar_position: 22
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Canonical signed input

Receipt schema v1 fields, all required: `schema_version`, `receipt_id`, `operator_id`, `key_version`, `session_id`, `grant_id`, `request_id`, `lease_generation`, `work_id`, `rights_version`, `rendition_id`, `chunk_index`, `byte_start`, `byte_end_exclusive`, `bytes_written`, `chunk_sha256`, `request_started_ms`, `response_ended_ms`, `http_status`, `nonce_digest`, `key_id`, `signature`. Identifiers are strings, integer fields are canonical unsigned decimal strings except `http_status` (integer 200 or 206). Hashes are lowercase 64-character SHA-256 hex. Signature is base64url without padding, exactly 64 decoded bytes. Ed25519 public keys are 32 bytes.

For signing remove `signature`, normalize strings to NFC and encode RFC 8785 JSON Canonicalization Scheme (JCS), rejecting noncanonical numbers, duplicate JSON keys and unknown fields. Sign UTF-8 `porto:london:receipt:v1\n` followed by canonical bytes. Grant uses the same procedure with domain `porto:london:grant:v1\n`. A key cannot be reused across grant and receipt roles. Receipt ingestion verifies signature against registered key version at service time, not merely current key. Key compromise can still invalidate the interval after review.

Intervals are half-open `[start,end)` everywhere. `bytes_written <= end-start`, start nonnegative, end within rendition size. Completion is measured by union of observed written subranges mapped to a full verified chunk. Clients never report authoritative bytes. Require `response_ended_ms >= request_started_ms`; gateway request ID and nonce must exist. A receipt submitted after deadline is held, never auto-included. Per-request record must describe contiguous bytes from the requested start; arbitrary partial holes require separate records.

## Evidence commitment

Freeze records sorted by receipt ID bytes, excluding rejected/held records. Each leaf is `SHA256(0x00 || UTF8("porto:london:evidence:v1") || salt32 || JCS(record))`. Each record includes decision revision and policy hash plus receipt hash. Root does not expose record content or salts. Merkle branch is `SHA256(0x01 || left32 || right32)`. Duplicate the last hash for odd widths; forbid empty trees. Proof contains sibling hashes and leaf index, with direction inferred from index bits least-significant first. A verifier checks depth equals `ceil(log2(nextPowerOfTwo(count)))` and count/index bounds. Never sort branch children.

## Payout commitment

Payout leaf encoding is fixed binary, not JSON or compiler-dependent struct order:

```text
0x00 || UTF8("porto:london:payout:v1") ||
chain_id_u8 || package_address_32 || asset_metadata_address_32 ||
settlement_id_32 || leaf_index_u32_le || payout_id_32 ||
recipient_address_32 || amount_u64_le || policy_hash_32 || salt_32
```

Hash with SHA-256, use the same branch algorithm above. Addresses are decoded to 32 bytes with left zero padding; human display uses 0x-prefixed 64 hex digits. Settlement/payout IDs are SHA-256 of respective domain strings plus canonical internal ID bytes. Salt protects commitments before claims; execution reveals payout fields and salt but no listener data. Distinct leaf domains prevent evidence/payout substitution.

Manifest records additionally include off-chain contribution IDs, rights snapshots, operator attribution, source budget IDs, evidence batch list, input/policy/algorithm version and reviewer records. Only the payout fields/root and aggregate state go on-chain. Independent recomputation checks every input approved, budgets unspent, amounts conserved, recipient/rights versions correct, payout IDs unique and manifest count/total exact.

## Golden vectors required

Before G1, two independent implementations must agree on canonical grant/receipt bytes, signatures, work identity, payout binary encoding, 1/2/3/5-leaf roots and proofs, amounts 0/1/u64-max, invalid negative/overflow, NFC strings, duplicate fields and altered domain. All byte sequences and expected digests must be frozen as fixtures. These are required implementation tests, not a claim that cryptographic interop has already been executed in this documentation task.

`CURRENT SOURCE`: [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785) defines JCS. RFC 8785 does not itself apply Unicode normalization; this contract requires NFC before canonicalization and rejects received non-NFC strings rather than changing signed content silently.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
