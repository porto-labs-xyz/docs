---
id: index
title: Co-create architecture and development plan
slug: /co-create
sidebar_position: 1
---

**PROPOSAL FOR REVIEW · 13 October 2026 · Not an implemented or approved release specification**

Build Porto as a streaming app with voice and text editing: the listener selects a licensed original, describes a change, receives a playable variation, and can name, save and share it. Each variation preserves its source, parent and permission history. Eligible paid listening feeds the Porto Ledger and settlement on Aptos.

**The founder's current instruction is one shared audio model, conditioned on the original recording and the requested change. No artist-specific models, adapters, fine-tuning programme or training catalogue is required.** This instruction supersedes the bespoke-model assumption in the website and deck for this development proposal. Artist permission still governs which tracks and edits are available.

The smallest useful architecture is a frontend, one modular Porto backend, a durable job queue, an audio worker, one shared audio-generation model, PostgreSQL for product metadata, private S3 storage with CloudFront delivery, and an adapter to the existing Aptos Move contracts. Speech recognition and a small text-planning model translate the user's request into a validated edit plan. The music model produces music, rather than spoken narration.

[Open the interactive architecture](pathname:///architecture/porto-voice-audio.html). The diagram shows the principal service relationships; the detailed request and playback paths are in [Architecture](architecture.md).

| Read next | What it answers |
| --- | --- |
| [Architecture](architecture.md) | Components, request flow, storage, finance boundary and deployment |
| [Audio model research](audio-research.md) | Which models fit, what exact edits require, and how to select one |
| [Data, APIs and reliability](data-and-operations.md) | Track lineage, jobs, endpoints, permissions and failure handling |
| [Development plan](development-plan.md) | Work packages, estimates, ownership, dependencies and acceptance gates |
| [Decisions and evidence](decisions-and-evidence.md) | What is agreed, proposed, unverified or inconsistent with older sources |

## What exists and what must be built

The [current prototype](https://porto-prototype.vercel.app/) demonstrates a persistent player, speech/text input, browser audio effects, local drafts, naming, genealogy, creator feeds, following, search, comments, a listening-budget walkthrough and illustrative royalties. These flows provide the product reference. Browser-local state, fictional accounts and displayed demo money must be replaced with authenticated server state and verified financial records.

The website's example, “Remove the guitar. Slow it down. Make it dreamy.” requires several capabilities. Tempo change is a precise processing operation. Removing an instrument is reliable when the artist supplies its stem; separation from a mixed master is approximate. Mood or arrangement change uses the shared audio model. One coordinated job can combine these operations.

Treat the existing Aptos payment contracts as an integration dependency supplied by the founder. This research reads the current Move specification, not contract implementation. Deployment, ABI compatibility, security and support for the October commercial rules must be verified before claiming that the integration is ready.

## Recommended first release

Start with a small manually licensed catalogue, web playback, voice/text commands, deterministic edits, one benchmarked generative transformation, private drafts, lineage, explicit sharing, simple discovery and testnet accounting. Add real paid listening after tariff, budget-cap funding, rights and payment gates pass. The full plan includes the remaining prototype flows without delaying the first working audio loop.

The initial managed S3/CDN delivery proposal is a scoped change from the older independent-node pilot. It does not claim to implement node-to-node distribution. Older PRT, app-chain, subscription and operator-pool mechanics remain separately documented; they do not become requirements through this proposal.

Graph checked: 5 matches; source state: current; read cited sources before answering.

The graph check above records the initial research retrieval. Later direct source review and publication checks are recorded separately; a graph check does not prove a running system.
