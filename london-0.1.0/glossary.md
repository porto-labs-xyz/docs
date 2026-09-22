---
id: glossary
title: "Glossary"
sidebar_position: 90
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

| Term | London meaning |
|---|---|
| Approved specification | Product-owner-authorised implementation baseline; not runtime or launch evidence |
| Independent operator | Participant controlling the host/account and operating decision |
| Peer fill | Authorised node-to-node content transfer; earns no listening reward |
| Delivery node | Cache/server for authorised audio; not a validator or independent attestor |
| Grant | Short-lived signed authorisation for one node, purpose and chunk |
| Consumption | Atomic coordinator record admitting one request against a grant |
| Receipt | Node-signed assertion of bytes served and outcome |
| Eligible session | Closed session whose valid unique complete chunks meet the threshold |
| Accepted duration | Sum of eligible unique manifest media intervals, not verified attention |
| Evidence batch | Frozen inventory of grants, receipts and dispositions |
| Commitment | On-chain digest/reference fixing the published artifact bytes |
| Immutable / tamper-evident | Prior chain record is retained; changed off-chain bytes fail digest verification |
| Accounting allocation | Funded listener-attributed amount assigned under a frozen policy |
| Statement | Recipient-private allocation detail with a public hash-index proof |
| Payment run | Exact approved set of transfer instructions and total cap |
| Paid | Successful native-USDC transfer reconciled to asset, recipient and amount |
| Uncertain | A transaction outcome cannot yet be established; do not retry as a new payment |
| Correction | New linked artifact/ledger event preserving earlier evidence |
| Porto fallback | Porto-controlled serving when participant delivery is unavailable |
| Subsidy | Separate pilot support, excluded from earned-reward economics |
| Full audit | Authorised recomputation from private evidence/funding/rights inputs |
| Artist verification | Checking own statement inclusion/arithmetic and transfer evidence, not all private inputs |
| App-chain migration | Future separately approved work, not a London implementation dependency |

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
