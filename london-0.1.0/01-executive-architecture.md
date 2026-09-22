---
id: 01-executive-architecture
title: "Executive architecture"
sidebar_position: 2
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Proposed architecture

Porto owns the music experience, catalogue, private origin, delivery admission, fraud decisions and settlement application. Aptos supplies consensus, ordering, finality and Move execution. Permissioned delivery/cache operators provide a measurable service; they are not Porto validators. Porto's attestation service is the initially trusted authority that accepts signed delivery evidence and commits approved batches.

The proposed public description is:

> Porto operates a music delivery and settlement network. Initial real-money settlement uses proven Mainnet infrastructure while Porto builds toward its own app-chain.

This wording describes the intended model, not evidence of launch. Do not describe it as decentralised consensus, permissionless serving, trustless playback verification or a completed app-chain.

## Responsibilities and money

A listener pays GBP for access. Cleared revenue becomes Porto company revenue, subject to accounting adjustments, reserves and professional review. A selected provider converts treasury funds to native Aptos USDC. Porto allocates a funded portion to listener periods in its internal ledger. Accepted delivery determines rights-holder and operator accruals. Reviewed daily batches reserve funds on-chain; bounded transfers pay registered recipients. Dashboards distinguish pending evidence, accrual, settlement commitment and confirmed transfer.

Only salted commitments, opaque application identifiers, settlement amounts, states and payout addresses go on-chain. Detailed playback, listener identity, IP, device and provider data stay off-chain. Public addresses and amounts still permit correlation; privacy review is mandatory.

## Decisions and limits

70/25/5 is existing protocol context, not a London-approved allocation. Provider, custody, rights clearance, split, reserve, refund and jurisdiction decisions are launch blockers. Daily settlement is a processing cadence, not a promise to pay before revenue clears or holds end. Mainnet availability does not establish Porto's safety or legal position.

`CURRENT SOURCE`: whitepaper sections 3.2, 4.2, 6.2, 6.5, 7.2 and 9 describe a different Porto Chain/PRT rollout. See [compatibility](18-compatibility-with-existing-pips.md) for the explicit replacement candidates and [source register](23-source-register.md) for pinned evidence.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
