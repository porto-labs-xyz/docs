---
id: 21-wire-and-commitment-contracts
title: "Canonical wire formats, artifacts and verification"
sidebar_position: 22
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Primitive encoding

Schema identifier is `london.v1`. Internal IDs are lowercase UUIDv4 strings; all cryptographic hashes are 64 lowercase hexadecimal characters. Aptos addresses are `0x` plus 64 lowercase hex digits. Integer wire quantities are canonical decimal strings (`0` or a nonzero digit followed by digits), bounded to their declared u64 range. Small enum/status values can be JSON integers where the schema says so. No floats, exponent forms, negative amounts, duplicate JSON keys, unknown properties or lone Unicode surrogates are accepted.

Use RFC 8785 JCS for canonical JSON bytes. Require input strings to be NFC and reject non-NFC rather than silently normalising signed content. JCS itself does not normalise Unicode. Signatures use Ed25519, 32-byte public keys and 64-byte signatures encoded base64url without padding. Reject invalid length/encoding. Independent implementations must agree on canonical bytes and signature verification before G0.

Signed object domains: UTF-8 `porto:london:grant:v1\n`, `porto:london:receipt:v1\n`, `porto:london:manifest:v1\n`, `porto:london:peer-result:v1\n`, `porto:london:peer-request:v1\n`. Append JCS of the object with `signature` removed, keeping key ID/version in the signed object. A signature is never valid across domains. Wire grants contain no listener ID, email or payment identifier; session IDs remain restricted pseudonymous data.

The manifest hash is SHA-256 over JCS of the complete signed Manifest object, including its signature. Chunk hashes are SHA-256 over exact audio bytes. Retained raw receipt hashes are SHA-256 over JCS of the complete signed Receipt. Signed key-challenge objects use domain `porto:london:node-registration:v1\n`.

A chain batch ID is `SHA256(UTF8("porto:london:batch-id:v1\n") || UTF8(batch_uuid))`. The artifact digest is `SHA256(UTF8("porto:london:artifact:v1\n") || JCS(artifact))`. Artifacts contain `schema_version`, `kind`, `batch_uuid`, `window_start_ms`, `window_end_ms`, `salt` (32 random bytes as hex), and kind-specific payload. Persist the randomly selected salt before freezing; a retry reuses it. Hash raw canonical bytes, never pretty-printed export bytes or compressed object bytes. Download endpoints return the exact canonical bytes used for hashing.

## Artifact schemas

| Kind | Required payload | Ordering |
|---|---|---|
| evidence | grant inventory; signed receipts or retained hashes/references; decision revisions; session summaries; manifest/rights/policy hashes; missing/rejected/late dispositions | Grants by consume sequence then ID; receipts by receipt ID; sessions by session ID |
| accounting | evidence batch IDs; funded budget/day inputs; rights and economics snapshots; accepted duration contributions; allocation lines; reserve balances; correction links | Budget/day, then work/rights, then role and recipient ID |
| statement | beneficiary private ID; accounting batch; role-separated work/day/duration/amount lines; totals; asset/chain; immutable recipient snapshot | Day, work, role, allocation-line ID |
| statement-index | accounting batch ID; entries of random proof ID and statement artifact hash | Proof ID ascending |
| payment-journal | accounting batch; approved run hash; payment IDs, contribution IDs, recipient, amount, asset, confirmed hash/version or outstanding state | Payment ID then attempt index |
| correction | target batch; prior correction if any; reason code; replacement/additional artifacts; balancing ledger references; approver reference | Related IDs ascending |

Machine-readable artifact schemas are in [artifact schemas](artifact-schemas.json). Evidence artifacts retain hashes and object references to raw receipt files; the full audit bundle must include all referenced bytes and schemas. A pointer without available content does not pass full audit verification. Accounting may reference several earlier evidence days for delayed funding; the on-chain parent is the primary evidence batch and the artifact lists all additional confirmed IDs. The verifier checks every reference exists and matches its digest. Parent metadata does not replace artifact validation.

## Bounds and item counts

Bound each artifact to 64 MiB canonical bytes and each response chunk to 2 MiB. A day exceeding the artifact bound stops preparation with an explicit capacity alert; do not silently truncate, repartition accounting or change schema. Increase the limit only after review and tests. `item_count` is grant inventory count for evidence, allocation-line count for accounting, entry count for statement-index and payment-journal, and replacement-reference count for correction. Contract storage cannot inspect those private files; the verifier checks the count against bytes. Raw ObjectRef SHA-256 is over exact stored file bytes without the artifact domain; artifact hashes always use the domain above.

PeerProof uses the peer-request domain and signs its full object without signature. The coordinator fetches the registered destination key itself; the caller cannot supply a substitute public key. Decimal/UUID sorting is lexical ASCII except numeric consume sequence, which sorts by integer value. Private artifact object IDs are retrieval references for authorised exports, not public storage URLs.

## Publication order and immutability

1. Freeze evidence artifact and persist protected canonical bytes; confirm its on-chain commitment.
2. Freeze accounting inputs/results and persist bytes; confirm its commitment referencing evidence. Evidence commitment does not wait for funds.
3. Generate per-recipient private statements, freeze a public index of salted hashes and random proof IDs, and commit the index referencing accounting. Confirm it before run approval.
4. Execute approved payments. Publish a separate payment-journal commitment after run reconciliation, including unresolved lines if necessary. Further confirmations append a new journal; old statements/journals remain unchanged.
5. Correct with new kind-5 records linking prior commitments. A correction never removes an earlier artifact or transaction.

A SQL append-only table alone is not the public immutability proof. The external chain commitment makes a changed retained file detectable after publication. It cannot recover lost files, establish unrecorded activity or prove honest listening. Publishing a later correction is visible, not silent rewriting.

## Artist verification

The artist downloads their statement bytes, the public index and chain/package/batch locator. The verifier computes the statement hash, checks exactly one matching proof ID/hash in the canonical index, verifies the index's committed digest and parent accounting reference, checks statement totals and compares claimed confirmed payments against the actual asset/recipient/amount on chain. No other recipient's statement or listener identity is disclosed. A public index is a complete small list, not a Merkle proof.

Full audit mode additionally receives authorised evidence, signed receipts, grant inventory, funding/rights snapshots and all accounting lines. It verifies signatures/content hashes, classifies gaps, recomputes eligibility and allocations, and reconciles total obligations and transfers. An individual artist export cannot prove global allocation correctness without those private inputs. Output separate verdicts: `bytes_match`, `references_match`, `statement_arithmetic_valid`, `full_accounting_reproduced`, `transfers_confirmed`, with `not_checked` where inputs are absent. Never collapse those into “verified listening”.

## Golden fixtures

Freeze test vectors for domains, canonical JSON, non-ASCII/NFC rejection, zero/u64 maximum, changed salt/field, empty evidence, one/many statement entries, altered signature, correction lineage, deterministic ties, midnight boundaries and duplicate receipt. [Fixtures](fixtures.json) provides documentation examples and expected hashing/allocation results; implementation must extend them with independently generated real signature vectors and backend/Move/verifier agreement. Documentation fixture validation is not cryptographic runtime certification.

Primary encoding reference: [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785). Transaction recovery must follow the pinned implementation's actual Aptos sequence/expiry semantics and be tested against [Aptos transaction management](https://aptos.dev/build/guides/transaction-management), rather than assuming an HTTP timeout means failure.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
