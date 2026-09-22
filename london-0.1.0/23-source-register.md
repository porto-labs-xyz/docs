---
id: 23-source-register
title: "Source register and evidence boundaries"
sidebar_position: 24
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Current source evidence

Reviewed 22 September 2026. Source hashes below pin local file bytes, with repository HEAD for navigation. A commit link describes that repository revision; where local bytes differ, the SHA-256 is the exact review identity. Existing sources are draft specifications, not implementation evidence. London algorithms and policy defaults are new proposals unless explicitly labelled CURRENT SOURCE. No historical marketing figures are adopted as verified current facts.

### whitepaper/porto-whitepaper.md

`CURRENT SOURCE`: [porto-whitepaper.md](https://github.com/porto-labs-xyz/whitepaper/blob/d902041c348b199d1dd2de5ab73de24ff5a26e67/porto-whitepaper.md). SHA-256 `87855bd3352335a843849681e90a30058c95ae68e5fc4181327e6e4ef23c394d`.

Exact reviewed sections:

- 3.2 System overview.
- 3.3 The revenue split.
- 4.2 Built on a stripped, detached fork of Aptos.
- 6.2 Beta architecture: trusted, region-co-located S3 origin storage.
- 6.3 What counts as a valid, billable play.
- 6.4 From a play to an on-chain record.
- 6.5 From one trusted attestor to a decentralized quorum.
- 7.2 The user-centric model.
- 8. Governance.
- 9. Phased Rollout.

### pips/PIP-2.md

`CURRENT SOURCE`: [PIP-2.md](https://github.com/porto-labs-xyz/PIPs/blob/f7211bb1df96a42be8001f3148df9b5be11c111b/PIP-2.md). SHA-256 `8278fcd18b9a6c6a38aff60ca913896e99b2f794d19bf1c2c4e3220251dfc9a7`.

Exact reviewed sections:

- System overview.
- Revenue split.
- Node roles.
- Phased rollout.

### pips/PIP-3.md

`CURRENT SOURCE`: [PIP-3.md](https://github.com/porto-labs-xyz/PIPs/blob/f7211bb1df96a42be8001f3148df9b5be11c111b/PIP-3.md). SHA-256 `6b03d6a1f3c15a09b3eeaae9edf13751c19a2e074cd3f3b53c1e571c2aa5cc94`.

Exact reviewed sections:

- 1. Token identity.
- 2. Issuance: mint-on-subscription.
- 3. Reserve backing (informational, not a peg).
- 4. Redemption: two-track payout.
- 5. Price oracle requirement.
- 6. Gas / fee model.
- 7. Staking interplay.

### pips/PIP-4.md

`CURRENT SOURCE`: [PIP-4.md](https://github.com/porto-labs-xyz/PIPs/blob/f7211bb1df96a42be8001f3148df9b5be11c111b/PIP-4.md). SHA-256 `f8ce0ff3419c4eaa375d5711aecb2607831ad0864637f79f57ca3296a8552121`.

Exact reviewed sections:

- 1. Beta streaming architecture : trusted-region, co-located S3 origin.
- 2. Play validity threshold.
- 3. Client heartbeat and session lifecycle.
- 4. On-chain schema.
- 5. Attestation submission and batching.
- 6. Attestation trust model: Beta vs. Mainnet V1.
- 7. Musical work registration.
- 8. Migration path.

### pips/PIP-5.md

`CURRENT SOURCE`: [PIP-5.md](https://github.com/porto-labs-xyz/PIPs/blob/f7211bb1df96a42be8001f3148df9b5be11c111b/PIP-5.md). SHA-256 `e73552a699a3fe0dddcccc330497e5a83e4dd8005cdbf8748192006eaf99c621`.

Exact reviewed sections:

- 1. Listener accrual.
- 2. Epoch settlement.
- 3. Multi-party rights-holder splits.
- 4. Interaction with redemption.
- 5. Settlement cost bounding.
- Security Considerations.

### pips/PIP-6.md

`CURRENT SOURCE`: [PIP-6.md](https://github.com/porto-labs-xyz/PIPs/blob/f7211bb1df96a42be8001f3148df9b5be11c111b/PIP-6.md). SHA-256 `c5bb3791ed70a217efa6ef4e40cb36de9ce0f934190bac9c9f0f4dd1f2b287fd`.

Exact reviewed sections:

- 1. Node modes.
- 2. Registration and staking.
- 3. Unbonding.
- 4. Slashing conditions.
- 5. Beta exemption.

### pips/PIP-7.md

`CURRENT SOURCE`: [PIP-7.md](https://github.com/porto-labs-xyz/PIPs/blob/f7211bb1df96a42be8001f3148df9b5be11c111b/PIP-7.md). SHA-256 `8f59c0c02258c4e58eab76b6781d16c0700323dfea6baeb686adc81e981e0f04`.

Exact reviewed sections:

- 1. Governed parameter registry.
- 2. Upgrade mechanism.
- 3. Beta: single-key governance.
- 4. Migration path.

## Engineering and orientation sources

`CURRENT SOURCE`: `porto-core/CLAUDE.md`, exact sections “Porto Labs Fork”, “What stays (do not remove or gut)”, “Naming and rebrand policy”, and “Current phase”, was read only because the brief explicitly requested it. It describes fork engineering, not London deployment. Private instructions are not reproduced or materialised in the public documentation graph.

Orientation consulted: `PORTO_AGENT_INSTRUCTIONS.md`, `PORTO_CONTEXT.md`, `design/design-notes.md`, docs README/config/sidebar, local semantic graph, and organisation graph search/traversal for PIP-4 and the whitepaper. The graph routes to evidence; INFERRED links do not ratify architecture. No approved presentation/design decision changed, so design notes require no new decision entry.

No roadmap PDF was supplied. The attached text brief is requirements input, not evidence of an approved roadmap, licence, provider agreement or deployment.

## External technical references

These references support only the narrow technical facts identified; they are not endorsement or legal/financial advice. Reverify platform details before implementation.

- [Circle native USDC address registry](https://developers.circle.com/stablecoins/usdc-contract-addresses), “Mainnet”, Aptos row: asset identity reference. No provider access or redemption eligibility inferred.
- [Aptos sponsored transactions](https://aptos.dev/build/guides/sponsored-transactions): fee-payer capability reference, not a deployed Porto sponsor.
- [AWS S3 presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html): reuse/expiry bearer-capability behaviour.
- [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785), §3.2: canonical JSON serialization. London adds NFC validation explicitly.

[Compatibility matrix](18-compatibility-with-existing-pips.md) · [London contents](index.mdx)
