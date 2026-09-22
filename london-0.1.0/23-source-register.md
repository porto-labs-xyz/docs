---
id: 23-source-register
title: "Source register and authority"
sidebar_position: 24
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Current source

The pinned [source manifest](source-manifest.json) contains exact SHA-256 hashes and repository revisions for the canonical Porto sources reviewed. Those sources describe existing product/protocol intent, not evidence of this MVP running. Source authority: whitepaper for company/product intent; PIPs for their specified mechanisms; this approved directory for London-specific implementation departures.

| Source | Relevant exact sections | Use |
|---|---|---|
| [Whitepaper](https://github.com/porto-labs-xyz/whitepaper/blob/main/porto-whitepaper.md) | §§3.2 System overview, 3.3 Revenue split, 4.2 chain, 6.2-6.5 streaming, 7.2 user-centric model, 8 Governance, 9 Phased Rollout | Intent, trust transition and economic context |
| [PIP-2](https://github.com/porto-labs-xyz/PIPs/blob/main/PIP-2.md) | System overview, Revenue split, Node roles, Phased rollout | Original network model |
| [PIP-3](https://github.com/porto-labs-xyz/PIPs/blob/main/PIP-3.md) | §§1-7 token identity through staking interplay | Explicitly excluded token mechanics |
| [PIP-4](https://github.com/porto-labs-xyz/PIPs/blob/main/PIP-4.md) | §§1-8 streaming architecture through migration | Eligibility and central trust context; London changes documented |
| [PIP-5](https://github.com/porto-labs-xyz/PIPs/blob/main/PIP-5.md) | §§1-5 listener accrual through cost bounding; Security Considerations | Listener attribution and rights split context |
| [PIP-6](https://github.com/porto-labs-xyz/PIPs/blob/main/PIP-6.md) | §§1-5 node modes through Beta exemption | Distinguish delivery, attestation and validators |
| [PIP-7](https://github.com/porto-labs-xyz/PIPs/blob/main/PIP-7.md) | §§1-4 governed parameters through migration | Governance contrasts |
| [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785) | §3 canonicalisation, Appendix D large integers | Canonical signed and hashed bytes |
| [Aptos transaction management](https://aptos.dev/build/guides/transaction-management) | Sequence, submission and recovery guidance | Implementation must pin and test actual SDK/framework semantics |

External technical references inform implementation review; they are not provider agreements or proof of a deployed Porto integration. Pin actual framework/SDK/issuer asset references in L07 before Mainnet. Do not copy a native-USDC address from an example or assume any token named USDC is the approved asset.

## Storage-engine references

[RocksDB Transactions](https://github.com/facebook/rocksdb/wiki/Transactions) documents TransactionDB and explicit read/write conflict protection. [Basic Operations](https://github.com/facebook/rocksdb/wiki/Basic-Operations) documents synchronous writes and process ownership. [Backup guidance](https://github.com/facebook/rocksdb/wiki/How-to-backup-RocksDB) documents engine backup facilities. Porto's deterministic command protocol, single-owner policy, journal and migration boundary are approved design decisions specified in chapter 27, not capabilities supplied automatically by RocksDB.

## Approval and supersession evidence

On 22 September 2026 the product owner approved the reduced MVP after agreeing that it must retain artist/third-party-owned infrastructure and real peer participation. The owner requested this complete specification and status APPROVED. The new baseline supersedes the broader London draft, while preserving its navigable documentation structure. No supplied roadmap PDF was available in this authoring task, so none is cited as read or used.

This source register establishes where decisions came from. It does not establish implementation, regulatory status, licences, audits, deployment, real payments or observed demand. Those are captured separately in the release/pilot evidence record.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
