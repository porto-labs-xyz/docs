---
id: 19-architecture-decisions
title: "Architecture decision records"
sidebar_position: 20
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Proposed ADRs

Each ADR is `PROPOSED FOR LONDON 0.1.0`, unaccepted pending listed decisions.

| ADR | Context and choice | Consequences and rejected alternative | Gate |
|---|---|---|---|
| ADR-001 Mainnet application | Use Aptos consensus and native USDC settlement | External chain dependency; avoid launching PRT/L1/bridge before proving music operations | D07,D12 |
| ADR-002 Company treasury | GBP subscription is company revenue, company batches conversion | Listener has no crypto balance; legal/accounting assessment still required | D01-D04 |
| ADR-003 Permissioned serving | Admit cache operators; Porto controls attestation | Faster reviewable trust boundary, residual collusion; no permissionless/validator claim | D06,D09 |
| ADR-004 Private evidence | Keep receipts private, put salted roots and payout state on-chain | Audits need controlled evidence access; chain cannot prove allocation truth | D07,D08 |
| ADR-005 Deterministic daily budget | Prorate funded subscription by service day then listener duration | No monthly double spend; unused-day and late-evidence policy must be approved | D05 |
| ADR-006 Reserve then pay | Root approval reserves funds; bounded leaves transfer | Honest partial/failed payment states and retry safety; no ambiguous paid-on-submit badge | D07,D10 |
| ADR-007 Paced range grants | Serving layer consumes nonce and maps hashed chunks | More gateway dependence; S3-only presigning insufficient for session/replay controls | D09,D11 |
| ADR-008 Future migration boundary | Stable business IDs with chain-specific address/transaction adapters | Future rails require reconciliation and explicit asset plan, not automatic portability | D12, future F01-F04 |

Acceptance records must include rationale, reviewers, affected policy/schema version and dissent/risks. Do not mark accepted merely because implementation begins.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
