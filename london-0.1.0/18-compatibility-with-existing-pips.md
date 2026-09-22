---
id: 18-compatibility-with-existing-pips
title: "Compatibility with existing PIPs"
sidebar_position: 19
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Status

All source rows are `CURRENT SOURCE`, meaning static draft text as pinned in [source register](23-source-register.md). All London replacements are `PROPOSED FOR LONDON 0.1.0`, pending D12 governance acceptance. Nothing in this directory edits or supersedes an existing canonical file by itself. PIP-2 is informational despite graph metadata categorising the PIP corpus as normative.

| Source file and exact section | Existing model | London departure / disposition | Decision |
|---|---|---|---|
| `whitepaper/porto-whitepaper.md` §§1.1,3.2,4.2,9,10; `pips/PIP-2.md` “System overview”, “Phased rollout” | Porto Chain app-chain, testnet Beta then PRT Mainnet | Aptos Mainnet real-money application, no Porto L1 at MVP; rewrite rollout only after approval | D12 |
| Whitepaper §§3.3,7.2; PIP-2 “Revenue split”; `pips/PIP-5.md` §2 | 70/25/5 network split | Context only; explicit stablecoin economics ratification/replacement | D05 |
| Whitepaper §§5.1-5.5; `pips/PIP-3.md` §§1-8 | PRT mint, redemption preference, price oracle, PRT gas and staking | No PRT, mint, PRT oracle or redemption preference; company conversion then direct USDC; APT gas separately funded | D02,D04,D07 |
| Whitepaper §3.4; PIP-2 “Node roles”; `pips/PIP-6.md` §§1-5 | CDN/Validator/Full, Full default; PRT stake/slash/unbond | Permissioned delivery operators only, no Porto consensus, no PRT stake/slash. Contractual suspension/review replaces economic slashing | D06,D09 |
| Whitepaper §6.2; `pips/PIP-4.md` §1 | Porto S3 origin, 60-second scoped presigned URLs, co-location | Preserve private regional origin; browser grants enforced at serving endpoint. S3 URLs are reusable bearer capabilities and do not themselves enforce listener nonce consumption | D07,D09 |
| Whitepaper §6.3; PIP-4 §§2,3 | Minimum threshold and bytes/known bitrate duration | Preserve threshold proposal; use complete hashed media chunks, union/dedup, server pacing and explicit VBR mapping | D09 |
| Whitepaper §§6.1,6.4; PIP-4 §4 | Per-play listener/work/session StreamEvent on-chain | Salted batch commitments and payout state, detailed evidence stays private; breaking schema change | D07,D08 |
| Whitepaper §6.5; PIP-4 §§5,6,8 | Single trusted Beta then m-of-n Mainnet with unchanged schema/interfaces | Mainnet can remain Porto-trusted; no quorum claim. Batch transport cadence not payment latency. Future schema adapters required, compatibility not guaranteed | D09,D12 |
| PIP-4 §7 | Hash master plus core metadata; on-chain title/rights split | Precisely canonical work hash, versioned private metadata and rights commitments | D06,D07 |
| Whitepaper §§7.2,7.3; PIP-5 §§1,2 | Listener accrual, daily epoch and PRT balances | Preserve listener attribution; explicit monthly-to-day budget proration avoids repeated spend, with delayed watermark and holds | D04,D05 |
| PIP-5 §§2,3 and “Security Considerations” | Dust to treasury, per-work rights/operator split | Largest remainder conserving budget; origin reward decision; internal allocation evidence remains auditable off-chain | D05,D06 |
| PIP-5 §4; PIP-3 §§4,5 | Atomic PRT stable/volatile redemption | Direct USDC transfer only; paid requires confirmed transfer, no stable/volatile preference | D02,D07 |
| PIP-5 §5 | 200-work chunked settle call | Bounded committed payout leaves, global payout IDs and cancellation tombstones; no accrual reset loop | D07 |
| Whitepaper §8; `pips/PIP-7.md` §§1-4 | Porto governance, single-key Beta then stake voting; token/stake parameters | Application admin quorum/timelock; separate attestor, finance, executor and guardian. Aptos protocol governance remains external | D10,D12 |
| `porto-core/CLAUDE.md` “Porto Labs Fork”, “What stays (do not remove or gut)”, “Current phase” | Fork-based Porto Chain engineering scope | Reference only; no fork/consensus implementation or changes in London | D12 |

## Unresolved cross-document claims

Source wording about every stream being on-chain conflicts with privacy-preserving roots. Source “unchanged schema” migration claims cannot apply to this new schema. Source minute-scale attestation language must not imply daily budgets or held/unfunded money is already paid. Source single-validator/testnet proof cannot establish London Mainnet security. “Full node at launch” and “permissionless Mainnet” cannot describe London delivery admission.

## Governance and review impact

If London is accepted, propose amendments through the PIP process to PIP-2 rollout, a separate non-PRT settlement specification or explicit PIP-3 applicability boundary, PIP-4 evidence/privacy/schema, PIP-5 economics/budgeting, PIP-6 operator role separation, and PIP-7 administration. Update whitepaper narrative and public site only after approval. PIP-8, referenced by current sources, also requires economic consistency review before publication; this task does not adopt or amend it.

Review connected public copy, design routes, diagrams, dashboards and economic claims. This draft is not authority to alter approved deck or site copy. Do not silently merge proposal facts into current-state graph concepts; proposal nodes carry draft temporal scope and separate source relationships.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
