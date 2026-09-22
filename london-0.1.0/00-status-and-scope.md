---
id: 00-status-and-scope
title: "Status, approval and exact scope"
sidebar_position: 1
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Approval record

The product owner approved this reduced MVP specification on 22 September 2026 in the authoring conversation. This revision replaces the broader London draft introduced by documentation commit `fdb5d3f`. Approval covers the implementation scope and normative behaviour in this directory. It is not evidence of implemented software, independent audit, commercial agreements, regulatory clearance or permission to move real funds. Those require the launch evidence in [launch gates](14-testing-and-launch-gates.md).

Use **APPROVED** for this specification. Use **NOT IMPLEMENTED / NOT VERIFIED** for runtime capabilities until corresponding evidence exists. Existing whitepaper and PIPs remain unchanged. London-specific departures are explicit in [compatibility](18-compatibility-with-existing-pips.md); this approval does not amend those documents globally.

## The experiment

A listener buys access, plays licensed music delivered by an independently operated node, and generates server-side usage evidence. Porto commits evidence and accounting hashes to Aptos Mainnet, allocates the listener's funded budget, and sends real USDC to rights holders and delivery operators. An artist-operated node must transfer cached content to another independently operated node under Porto-issued authorisation. The receiving node then serves that content to a real listener.

This tests four hypotheses: paid demand, explainable and reproducible accounting, actual payout delivery, and willingness and ability to operate third-party music infrastructure. Cryptographic commitments test resistance to undetected rewriting after publication. They do not prove truthful inputs or human attention.

## Required scope

| Capability | Required boundary |
|---|---|
| Music product | Responsive web player, curated catalogue, explicit Play, paid access, account and subscription status |
| Catalogue | Manually onboarded licensed works, immutable rendition/chunk manifests, versioned rights and recipients |
| Participation | Invite-only operators controlling their own hosting, installable node, health, authenticated peer cache fill, listener serving, receipt outbox |
| Accounting | One GBP subscription plan, one funded listener-period budget, daily usage and allocation, deterministic integer arithmetic |
| Evidence | Server receipts, immutable retained files, daily public chain commitments, append-only corrections, downloadable verifier inputs |
| Payments | Native Aptos USDC only, Porto-funded gas, reviewed payout runs, confirmed transfer reconciliation |
| Human views | Listener entitlement; artist and operator statements; node status; internal holds and payout review through a small admin interface or CLI |
| Operations | Backups, key separation, bounded pilot funding, failure recovery and measured pilot results |

## Explicit exclusions

Do not implement PRT, listener crypto balances, redemption, a Porto chain, bridges, validators, staking, slashing, independent attestor quorum, ZK, permissionless discovery, public operator registration, reputation scores, fraud case management, formal appeals portal, custom custody, Merkle payout claims, six-module on-chain settlement, multi-currency plans, algorithmic recommendations, social features, native mobile apps or automatic app-chain migration. Do not pay for peer cache fills. Do not convert cache traffic into listening royalties.

There is one commitment module, not on-chain work/operator/treasury registries. The backend has modules in one deployable codebase, not a microservice programme. Node-to-node content transfer is required, but decentralised coordination and consensus are not.

## Normative conventions and precedence

MUST and MUST NOT are release requirements. SHOULD permits a documented equivalent only where explicitly stated. All documents are normative except labelled examples, research and evidence reports. For wire shape, `openapi.json` and [wire contracts](21-wire-and-commitment-contracts.md) prevail; for economic computation, [accounting](08-usdc-treasury-and-settlement.md) prevails. A conflict is a specification defect: stop the affected implementation and resolve it in the docs, never silently choose a favourable interpretation.

Technical defaults in [configuration](26-configuration-and-release-profile.md) are approved implementation choices, not measured performance or approved commercial terms. Required commercial/provider fields deliberately have no production defaults. Agents can build and test against the complete synthetic profile; production startup must refuse incomplete configuration.

## Definition of complete

The acceptance catalogue passes, real pilot evidence is collected, every production gate has an identified sign-off, and every claimed capability has its correct proof label. A deployed page, mock transfer, Porto-owned test node or testnet token is insufficient evidence for real demand, independent participation or Mainnet payout.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
