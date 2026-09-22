---
id: 03-roles-and-trust-model
title: "Roles and trust model"
sidebar_position: 4
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Authority matrix

| Role | Allowed | Forbidden |
|---|---|---|
| Listener | Own access, sessions and support/disputes | Set settlement duration, submit payable receipts, control treasury |
| Rights holder | Propose own works/splits, verify payout account, inspect own accrual | Assert third-party rights without clearance, alter closed snapshots |
| Delivery operator | Register pending node, serve scoped grants, sign own receipts | Admit itself, issue grants, attest batches, settle funds |
| Catalogue reviewer | Approve rights and immutable versions | Treasury release or unilateral payout address change |
| Fraud reviewer | Hold/reject/release evidence with reason | Rewrite raw evidence or alone approve own appeal |
| Trusted attestor | Commit validated evidence batches | Spend or withdraw USDC |
| Finance preparer | Reconcile inputs, build funding/allocation proposal | Approve own funding or recipient replacement |
| Finance approver | Approve independent recomputation and bounded reserve | Manufacture delivery evidence |
| Settlement executor | Execute committed payout leaves | Change amount, address or root |
| Emergency guardian | Pause scoped writes/transfers | Unpause, upgrade, seize recipient assets |
| Admin quorum | Timelocked policies, role changes and upgrades | Rewrite confirmed historical payments |
| Aptos network | Ledger consensus and Move execution | Verify licences, GBP clearance or human attention |

`SECURITY REVIEW REQUIRED`: proposed Mainnet admin is 2-of-3 independent hardware-backed signers with 48-hour upgrade/role-change timelock. Emergency pause is immediate; unpause needs the quorum and incident evidence. These are proposed defaults, not installed controls. Custody solution must demonstrate that separation is actually enforced.

## Trust boundaries

An operator signature proves possession of a registered key, not truthful delivery. A Porto-reviewed commitment proves Porto approved bytes of input, not real human listening. Contracts enforce payout commitments, balances and replay rules; they do not inspect private evidence or prove the allocation manifest was computed honestly. Finance approval independent of attestation bounds a single-key compromise. Porto plus colluding operators can still fabricate eligible delivery; disclose this residual risk.

Clients, operator clocks, cache contents, webhooks before signature verification, RPC responses before validation, and downloaded audit bundles before hash verification are untrusted. Entitlement checks do not establish cleared revenue. A self-custody account's controller can lose its key; Porto cannot promise recovery of transferred funds.

Aptos consensus governance is outside Porto's administrative authority. Porto application administration does not create a Porto validator network. `CURRENT SOURCE`: PIP-6 §§1,2,5 and PIP-7 §§2,3 are supersession candidates, not London permissions.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
