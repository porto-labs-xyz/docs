---
id: glossary
title: "Glossary"
sidebar_position: 100
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

| Term | Exact meaning |
|---|---|
| Audio bytes served | Server-observed bytes written for authorised requests. Does not establish receipt, decoding or attention by a person. |
| Eligible stream | Closed session whose approved unique served duration reaches the configured threshold, before final attestation commitment. |
| Attested stream | Eligible session approved by Porto under a pinned fraud policy and included in a confirmed evidence-batch commitment. Not independently proven listening. |
| Accrued amount | Internal calculated recipient allocation against funded listener-day budgets. Can be held or adjusted; no transfer implied. |
| Settled amount | Obligation included in a confirmed on-chain settlement root with reserved USDC. Can remain unpaid. |
| Paid amount | Native USDC actually transferred to the committed recipient and confirmed/reconciled by chain version and event. Not a bank payout. |
| Cleared revenue | Provider-confirmed funds received by Porto under the selected clearing policy, still exposed to applicable reversals. |
| Listener allocation | Internal attribution budget, not listener-owned crypto or a withdrawable account. |
| Delivery operator | Approved cache/serving participant; no Porto consensus role in London. |
| Trusted attestor | Porto service authorised to accept evidence and commit approved roots. |
| Validator | Consensus participant of a blockchain. London delivery operators are not Porto validators. |
| Work | Immutable recording identity; rendition, rights version and artist profile are separate. |
| Epoch/service day | UTC calendar day used for allocation, with explicit evidence watermark and processing delay. |
| Mainnet | The real-value Aptos network for London, distinct from a future Porto app-chain and from Aptos testnet. |
| Commitment | Hash binding to defined data. Does not prove that the data is truthful or available. |
| Sponsored gas | Porto pays allowed transaction fees using a constrained APT gas budget. |
| Recovery | A separate correction/receivable/return workflow after error; cannot erase a completed transfer. |

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
