---
id: 07-fraud-controls-and-disputes
title: "Basic integrity controls and manual exceptions"
sidebar_position: 8
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Small control set

This MVP implements deterministic validation, duplicate prevention, rate limits, suspension and manual payout holds. It does not implement a fraud scoring engine, operator reputation market, case-management dashboard, independent adjudication, automated clawback, staking or slashing.

| Condition | Required action | Accounting effect |
|---|---|---|
| Invalid schema/signature or unknown key | Reject receipt with stable reason | Zero credit |
| Grant not consumed, wrong node/purpose or expired | Reject; record security event | Zero credit |
| Incomplete bytes or failed response | Retain partial/error | Zero credit; retry permitted |
| Duplicate identical receipt ID | Return original disposition | No extra duration or money |
| Duplicate ID with changed body | Reject 409; alert | Hold affected session |
| Two complete attempts for a chunk | Earliest consume sequence wins | One duration, one serving operator |
| Missing or late receipt | Record missing/late explicitly | Zero until separately approved correction |
| Content mismatch | Quarantine chunk; suspend source pending investigation | Hold affected unpaid listener-days |
| Unexplained activity/collusion concern | Manual hold with reason and operator suspension if needed | No payout until resolution |

A hold applies to the whole listener-day because excluding a suspicious work could otherwise redistribute its share to other works. Valid evidence still gets committed while its allocation is held. Once resolved, allocate that listener-day once through a later accounting batch referencing the original evidence. Database uniqueness must prevent allocation in both the original and later batch.

## Manual exception record

Use an append-only admin command or small form with `exception_id`, target type/ID, reason enum, private note reference, actor, timestamp, status and predecessor event. Status is `open`, `released`, or `closed_no_credit`. Only authorised support/finance roles change it. The original decision remains present. Support communication can happen through existing channels; no new messaging product is required.

An unpaid allocation can be held. An unsigned payment run can be cancelled and rebuilt against a correction. A signed or submitted transaction must first be reconciled; a local hold cannot stop a transaction already accepted by the network. Confirmed transfers are never “reversed” in software. Any recovery payment or adjustment has a new ID, approval and link to the original.

## Automatic boundaries and operator reinstatement

One active session, ten-second listener-wide prebuffer, per-session rate limits and receipt deadlines are fixed implementation rules. Nodes with corrupted content stop serving that rendition immediately and report it. Porto suspension blocks grant issuance and consumption. Reinstatement requires key/content checks, successful probe and an admin event recording the reason. There is no score or probation algorithm.

Daily reports flag zero-receipt consumed grants, signature failures, duplicate conflicts, unusual repeated works, very high credited duration and operator concentration for human inspection. These reports are observations, not an automatic claim of fraud. A listener cannot receive more than 86400000 credited media milliseconds per UTC day; exceeding that cap holds the listener-day for investigation rather than silently trimming whichever artist comes last.

## Corrections and research boundary

Never edit a committed artifact. Publish a correction with a new batch ID, `supersedes_id` and explanation hash; retain the old artifact. Corrections before payout can change obligations through balancing ledger entries. Corrections after payout produce explicit liabilities/credits requiring finance review. They do not retroactively move assets.

ZK, independent attestations and stronger input-truth mechanisms are outside this release. A proof of computation cannot by itself establish that fabricated source inputs describe genuine listening. Keep the pilot funding cap and residual trust disclosure visible in the release record.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
