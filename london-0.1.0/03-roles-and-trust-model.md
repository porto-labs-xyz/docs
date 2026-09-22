---
id: 03-roles-and-trust-model
title: "Roles and trust model"
sidebar_position: 4
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Roles

| Principal | Allowed actions | Forbidden actions |
|---|---|---|
| Listener | Pay, see own access status, create/close own session, request authorised chunks | Supply settlement-critical duration, access other accounts |
| Artist / rights recipient | Read own works, allocations, statements and transfers; request address change through support | Edit historical rights or approve own allocation |
| Operator | Run approved node, report health, submit own receipts, read own delivery/reward statement | Admit nodes, issue grants, approve receipts, access listener identity |
| Catalogue/admin operator | Import approved works/rights, admit/suspend nodes, record holds | Sign payout transactions |
| Accounting worker | Validate evidence, freeze artifacts, prepare allocations | Approve its own payment run |
| Finance approver | Recompute frozen input, approve exact run hash and funding | Alter a signed/submitted transfer |
| Restricted payment worker | Execute approved bounded native-USDC transfers | Change approved amount, asset or recipient |
| Commitment writer | Append artifact commitments | Delete or change earlier records; hold payout funds |
| Contract administrator | Pause append, rotate writer through controlled account | Modify prior commitments or erase events |

At pilot scale the same human may handle catalogue and support. Finance approval must be independent of the automated preparer, and signer credentials must be inaccessible to the ordinary API process. Rights-holder and operator roles may belong to the same person, but their allocation lines and cost reports remain separate.

## Trust boundaries

An operator signature proves control of a registered key. Server bytes written indicate delivery attempted by that server, not remote decoding or human attention. A recipient hash check establishes content integrity, not paid demand. Porto's acceptance decision is trusted. An Aptos commitment fixes the published digest at an observable ledger position; it does not validate the private evidence or ensure completeness. A USDC transfer demonstrates delivery of that asset to an address, not GBP withdrawal or an economic profit.

The coordinator records every issued/consumed grant and every receipt disposition. An auditor can compare the grant inventory with included, rejected, held and missing receipts. This reveals gaps inside the recorded inventory but cannot prove Porto recorded every real-world event. Colluding nodes and Porto can still fabricate usage. Bound the pilot and report this limitation.

## Approval versus runtime authority

Product-owner approval authorises implementation of this architecture. It does not supply production signing keys, licensing rights or provider approval. The production profile identifies the actual legal entity, approved recipients, economics and budget caps. Its hash is part of accounting evidence; secrets are never included.

Use separate keys for node receipts, gateway grants, chain commitments and treasury payouts. Public-key history and effective intervals are retained. Suspend a compromised node, reject new grants and hold unpaid allocations from the affected interval. Do not retroactively replace signatures or erase records.

## Who controls infrastructure

Count a node as independent only when a participant controls the host/provider account, operating cost and decision to keep it running. Document onboarding assistance separately. Porto-funded credits, Porto-managed machines and internal test nodes must be labelled in results and excluded from independent-participation counts. At least one artist-controlled node and one unrelated-party-controlled node are mandatory for completion of the pilot.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
