---
id: 22-acceptance-test-catalogue
title: "Acceptance test catalogue"
sidebar_position: 23
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Execution contract

Every case below must have automated coverage where deterministic, or a retained observation/sign-off artifact where it concerns real participants. Record environment, commit/image/profile hashes, input fixtures, observed result, proof level and evidence link. All statuses start **NOT RUN** in an implementation tracker; this document defines acceptance, not execution results.

| ID | Scenario / stimulus | Required observable result |
|---|---|---|
| A01 | Parse every API and artifact example | Exact schemas pass; unknown keys, duplicate JSON keys and malformed quantities fail |
| A02 | Two independent canonicalisers process golden fixtures | Identical bytes/digests; NFC/domain changes rejected or change digest as specified |
| A03 | Sign grant/receipt/manifest/peer-result | Right domain/key verifies; cross-domain, wrong node and altered fields fail |
| A04 | Missing production profile, fixture provider or unapproved economics | Production startup refuses monetary/participant operations with named missing fields |
| A05 | Checkout return without verified provider event | No paid/active claim from browser redirect |
| A06 | Duplicate and out-of-order provider events | One entitlement/payment transition; ended period not revived by stale event |
| A07 | Authenticated user queries another user's statement/session | 404/403, no data disclosure; audit records denied access |
| A08 | Provider clearance delayed after active subscription | Playback may continue under verified access; allocation remains unfunded |
| A09 | Work has invalid rights/hash/intervals | Activation rejected; prior catalogue remains intact |
| A10 | First page load and catalogue navigation | No autoplay; explicit Play works; browsing does not restart playback |
| A11 | Second session, seek bursts, repeated session creation | One active session; listener-wide ten-second credit not reset; 429 when exceeded |
| A12 | Expired/replayed/cross-node grant and Range request | No new serving; 410/409/403/416 as appropriate; zero duplicate credit |
| A13 | Artist node A fills independent B, then B serves listener | Both ownership records, peer result, content digest and actual playback receipt linked |
| A14 | Peer sends corrupted chunk | Receiver rejects/quarantines before serving; source suspended/incident visible |
| A15 | Source peer unavailable | One retry then origin fill, with source/fallback recorded; no fill reward |
| A16 | Node fails after partial chunk | Bounded retry/fallback; partial earns zero; complete retry earns duration once |
| A17 | Two complete retry receipts in reverse arrival order | Lowest consume sequence wins; reward not determined by node clock or arrival order |
| A18 | Node restarts before receipt acknowledgement | Spool replays identical receipt; no extra serving, duration or money |
| A19 | Spool full, stale heartbeat, suspended key | Node excluded and new serving stopped; existing evidence retained |
| A20 | Session below/at threshold and init segment | Below earns zero; at threshold all unique media chunks count; init earns zero |
| A21 | Midnight/rights/entitlement boundary and late receipt | Session closes at boundary; deterministic day; late retained but absent from original allocation |
| A22 | Worked 101-unit example and arbitrary permutations | Exactly specified totals; input ordering cannot change result |
| A23 | Random budgets, recipients, weights and rounding ties | No loss/creation/overflow; total allocations bounded by funded budget |
| A24 | No listening, unresolved hold or no funding | Reserve remains explicit; no fabricated allocation or payment |
| A25 | Operator is also rights holder; Porto fallback serves | Separate roles, correct unique duration, retained origin share and no cache-fill reward |
| A26 | Resolve old hold/funding in later run | Original listener-day allocated exactly once; referenced evidence preserved |
| A27 | Append commitment twice; same ID different hash | Exact retry no-op; changed hash rejected; only one original record/event |
| A28 | Wrong signer, pause, rotation, malformed reference/correction branch | Contract rejects invalid mutation; old records byte-identical |
| A29 | Artist verifies own statement; tamper file/index/parent | Valid package passes; each alteration fails the corresponding verdict |
| A30 | Delete retained input; publish correction | Missing evidence is explicit failure; correction linked; old commitment still accessible |
| A31 | Execute reviewed run, then replay command/job | Exactly one successful transfer per obligation; correct asset/recipient/amount |
| A32 | Crash after signing or submit timeout | Durable signed bytes recovered; same hash retried; no new transfer while uncertain |
| A33 | Confirmed abort, expiry, wrong asset, frozen recipient | No false paid state; retry only after conclusive prior-attempt reconciliation |
| A34 | Restore database predating a submitted payment | External journal/chain recover attempt before signing resumes; no double payout |
| A35 | Browser matrix and real-time three-hour set | Explicit play, pauses, seek, midnight continuation and fallback behave; rebuffer measured |
| A36 | 100-session synthetic load and four concurrent fills/node | No unbounded backlog or phantom money; capacity metrics recorded |
| A37 | Full authorised audit recomputation | Eligibility, splits, funding conservation and payment journal reproduce exactly |
| A38 | Approved Mainnet rehearsal | Real native-USDC recipient receipt and commitment readback with no unexplained difference |
| A39 | Paid participant pilot | Real cleared payments, listener return/renewal observations, artist and independent-party serving |
| A40 | Participant economics and exit | Actual cost/reward/subsidy/time separated; willingness to continue and successful revocation recorded |

## Required monetary fault injection

For A31-A34 inject failure before DB commit, after reservation, after signature, after durable journal, after broadcast, after chain success before local acknowledgement, during approval cancellation and during backup restoration. Assert one paid obligation at most and a visible unresolved state wherever success cannot yet be established. The system must prefer a delayed payment over an unsupported second transfer.

## Human pilot evidence

A13/A39/A40 require real participant-owned hosts; Porto fixtures do not satisfy them. A38 requires specifically authorised real funds; testnet is insufficient. Paid renewal cannot be measured before renewal is offered. Record “not yet observed” rather than infer retention from initial sign-up. Product success thresholds must be pre-registered in the pilot plan; technical launch gates remain mandatory regardless of business outcome.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
