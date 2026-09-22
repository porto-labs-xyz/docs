---
id: 18-compatibility-with-existing-pips
title: "Compatibility with existing Porto sources"
sidebar_position: 19
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Status

**APPROVED FOR LONDON 0.1.0** describes this implementation baseline. **CURRENT SOURCE** describes the unchanged whitepaper/PIPs, which retain their own status and scope. London does not globally amend those sources. Their historical Beta/Mainnet names must not cause agents to reintroduce excluded systems.

| Current source and exact section | Existing description | London implementation rule |
|---|---|---|
| Whitepaper §§3.2, 4.2, 9; PIP-2 System overview / Phased rollout | Porto chain and staged network rollout | Existing Aptos Mainnet; no Porto consensus or chain implementation |
| PIP-3 §§1-7 | PRT issuance, reserve/redemption, oracle, gas and staking | No PRT/customer crypto balance/redemption; company treasury funds native USDC |
| PIP-4 §1 Beta streaming architecture | Porto trusted-region S3 and gateway serving | Private Porto origin plus invited independently operated HTTPS nodes |
| PIP-4 §§2-3 Play validity / Session lifecycle | Threshold, byte-based duration and heartbeats | Retain minimum threshold; use exact complete chunk durations; client heartbeats never monetary proof |
| PIP-4 §§4-6 On-chain schema / Batching / Trust model | StreamEvent batches and single trusted Beta signer, future quorum | Private usage files plus public digest commitments; Porto acceptance within the backend; no separate attestor network |
| PIP-4 §7 Musical work registration | On-chain work metadata/rights | Private versioned catalogue/rights included in accounting evidence |
| PIP-5 §§1-3 Listener accrual / Epoch settlement / Rights splits | PRT listener-attributed allocation and 70/25/5 split | Funded company-USDC period budgets; deterministic daily weights; production split is L04, not inherited by default |
| PIP-5 §2 rounding / §4 Redemption | Dust treatment and token redemption | Largest remainder conserves every unit; ordinary USDC transfers; no redemption product |
| PIP-6 §§1-5 Node modes / Registration / Unbonding / Slashing / Beta exemption | Node/attestor duties and stake model | Invite-only delivery and peer cache transfer; no staking, slashing or validators |
| PIP-7 §§1-4 Registry / Upgrades / Beta governance / Migration | Parameter governance and upgrade path | Private versioned release profile, immutable commitment code and controlled writer rotation |
| Whitepaper §6.5; PIP-4 §8 | Future decentralised attestation transition | Document portability only; independent verification is future work |

Canonical sources are pinned in [source manifest](source-manifest.json) and linked by section in [source register](23-source-register.md). PIP-8 remains existing economic context; this revision makes no amendment to it and does not import its token flow into London.

## Superseded London draft

The previous draft's separate fraud/attestation boundaries, six Move modules, Merkle payout claims, automated dispute lifecycle and executable migration planning are replaced, not optional parallel implementation paths. Preserve daily accounting, private evidence, real USDC, permissioned delivery and proof boundaries. Existing route/file names remain stable where useful for links, even when their chapter title now reflects a smaller scope.

## Storage decision supersession

The approved RocksDB deterministic ledger supersedes PostgreSQL references in the preceding London revision. This is an internal implementation architecture change, not a canonical PIP amendment or a claim that RocksDB provides consensus. The engine, journal and portable state boundary are first-priority work; sovereign-chain deployment remains deferred.

## Impact on messaging and design

Public statements must distinguish approved specification, implemented software and observed pilot results. Do not relabel prototype node badges or simulated payouts as live because this document is approved. The approved pilot includes actual participant control and actual node-to-node transfer, but it does not demonstrate independent attestation, permissionless serving or Porto consensus.

Marketing, whitepaper and PIP changes require their own scoped edits and review. This task updates London and its knowledge representation; canonical source text is preserved. The design notes record the approved scope and human-facing state terminology, not a claim that the pilot has already run.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
