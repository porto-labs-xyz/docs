---
id: 22-acceptance-test-catalogue
title: "Acceptance test catalogue"
sidebar_position: 23
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Required tests, not executed application evidence

| ID | Setup/action | Required result | Owner/gate |
|---|---|---|---|
| AT01 | Expired entitlement, active browser session, request play | 403, no grant, no payable evidence | Backend G2 |
| AT02 | Two devices race for one account lease | One succeeds; explicit takeover invalidates old generation | Backend G2 |
| AT03 | Replay nonce, wrong range/node, expired grant | No second consumption or reward, reason logged | Security G3 |
| AT04 | VBR set, overlapping ranges, partial chunks, retries | Only union of fully verified media intervals credited | Backend/QA G2 |
| AT05 | 60-second work at 29999 then 30000 accepted ms | First ineligible, second eligible; threshold time included once | QA G1 |
| AT06 | 20-second work at 9999 then 10000 ms | Half-duration threshold exact | QA G1 |
| AT07 | Two-hour set, seeks and repeated chapters | One session qualification, no chapter/reseek reward multiplication | QA G2 |
| AT08 | Midnight-crossing six-hour session | Session qualifies once, daily duration slices wait for closure and watermark | QA G2 |
| AT09 | Node outage after partial response, origin replacement | No double media credit; operator attribution deterministic | Infra/QA G5 |
| AT10 | Valid signature but invented operator delivery | Requires corroboration/review, demonstrates trusted-input residual risk | Security G3 |
| AT11 | 101 micro test budget, two equal days, day-one 1:2 works | 51/50, then 17/34; test split 6000/3000/1000 gives 10/5/2 | Finance/QA G1 |
| AT12 | No eligible plays or unresolved listener-day dispute | Budget remains unallocated/held, no redistributed windfall | Finance G2 |
| AT13 | Duplicate provider callback, ambiguous conversion retry | Single event/lot; query original instruction, no duplicate funds | Backend G2 |
| AT14 | GBP cleared, USDC wrong asset or not confirmed | No funded listener budget | Finance G2 |
| AT15 | Changed rights/address after root creation | Existing leaf unchanged; approved cancel/reissue for unpaid corrections | Move G3 |
| AT16 | Same payout twice across chunks/settlements | Exactly one transfer; conflicting payload aborts | Move G3 |
| AT17 | Random splits/durations/max integers | Sum conserved, no overflow/negative, stable tie ordering | Move/finance G3 |
| AT18 | Invalid proof, wrong domain/asset/package/chain | Abort without balance/state change | Move G3 |
| AT19 | One failed recipient in 20-leaf transaction | Entire tx aborts, retry healthy subset, hold failed leaf | Move G3 |
| AT20 | Submission timeout but tx committed | Lookup discovers committed payout; no respend | Backend G2 |
| AT21 | Indexer lag or conflicting RPC sources | Stale/uncertain status; not falsely paid | Frontend G2 |
| AT22 | Compromised attestor/executor | Attestor cannot spend; executor cannot alter root or withdraw | Security G3 |
| AT23 | Hold versus pay race, then cancel versus pay race | Serial execution resolves one state; no payment of held/cancelled leaf | Move G3 |
| AT24 | Chargeback after confirmed transfer | Separate recovery ledger, paid history preserved | Finance/legal G4 |
| AT25 | Raw PII export by unrelated artist/operator | Denied, no object existence leak, audit entry | Security/privacy G3 |
| AT26 | Restore pre-payment DB snapshot | Chain replay restores paid state before any executor resumes | Operations G5 |
| AT27 | Wrong upgrade digest/too-early timelock/hot signer | No upgrade or role change | Security G3 |
| AT28 | 2x pilot long-form load and 4x burst | Ratified SLOs, bounded queues/memory, no attribution loss | Infra G5 |
| AT29 | Bounded separately approved real transfer | Correct native asset/account/amount/version reconciled | Finance/security G6 |
| AT30 | Draft/public claims and all money UI states | No validator/trustless/paid-before-transfer claim | Product G7 |
| AT31 | Migration duplicate claim on source/destination | Global ID locked, no second claim, uncertain source held | Future migration |
| AT32 | Revoked/held evidence linked to payable root | Settlement blocked before further transfer | Move G3 |
| AT33 | Empty tree, odd-width proofs, NFC/duplicate JSON fields | Golden vectors agree; malformed inputs rejected | Backend/Move G1 |

For each execution record expected/observed result, fixture hash, environment, build/package hash, policy version, chain ID if applicable, logs/transaction proof and reviewer. Synthetic amounts and test assets are never real-settlement evidence.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
