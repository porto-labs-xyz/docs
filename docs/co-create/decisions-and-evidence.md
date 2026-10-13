---
title: Decisions, open questions and evidence
sidebar_position: 6
---

**PROPOSAL FOR REVIEW · 13 October 2026**

## Recorded direction and recommendations

| Decision | Status | Consequence |
| --- | --- | --- |
| Anyone with an account can upload audio | Founder instruction, 13 October | Self-service upload and publishing; no artist partnership, curated admission or payout-wallet prerequisite |
| One shared source-conditioned music model | Founder instruction, 13 October | No per-artist model, adapter, training dataset or fine-tuning workstream |
| Existing Aptos smart contracts handle payment | Founder-supplied dependency | Verify exact ABI/deployment and accounting support before implementation claims |
| Frontend + backend + S3 | Requested architecture | Add queue/worker, metadata database, rights gate and delivery layer to make it operable |
| Modular Rust backend; Python audio worker; TypeScript frontend | Recommendation consistent with current London language boundary | Keep orchestration cohesive and isolate audio compute |
| S3 and CloudFront first delivery | Proposed scope change | Managed pilot delivery; does not satisfy independent-node/cache-transfer acceptance |
| ACE-Step 1.5 primary shared music model | Founder selection, 13 October | Implement ACE-Step first; exact checkpoint, settings and deployment readiness remain evaluation gates |
| Asynchronous stored audio, explicit playback | Recommendation informed by prototype | Honest progress, retries and mobile behaviour; no promised real-time neural effects |
| Voice/text only for transformation | Current prototype interaction direction | Preserve simple input; technical controls remain internal |
| Original/variation 90%/70% rights pools and optional £10 cap | October public proposal, not confirmed tariff | Contract/commercial review required; creator credit is not royalty entitlement |

## Decisions that must be closed

| Question | Proposed default | Blocks |
| --- | --- | --- |
| Which edit capabilities launch? | Precise edits, supplied-stem removal and one generative mood/section edit that passes evaluation | Model/capability selection |
| Whole songs or previews first? | 30-second private preview, then explicitly requested full rendition; four-minute starting ceiling | UX, worker sizing and pricing |
| How is generation funded? | Bounded pilot allowance with tracked cost; choose paid quota/price before public billing | Unit economics and public access |
| How do listeners pay? | Select one route: direct USDC or GBP provider with treasury conversion | Budget funding, refunds and reconciliation |
| How is original listening funded after the cap? | Explicit bounded subsidy or agreed free-access rule | Cap behaviour and real-money rollout |
| What may be changed and shared? | Uploader-selected per-track permissions and declaration; flagged cases reviewed | Transformation and publishing |
| Which upload formats/quotas launch? | MP3/WAV/FLAC/AAC/Ogg; proposed 500 MB/file and 60-minute source limit; account storage/ingestion limits to approve | Upload capacity and abuse controls |
| How are disputed uploads handled? | Reporting, auditable holds/takedown/appeals and payout holds; no manual approval of ordinary tracks | Public rollout operations |
| Which ACE-Step checkpoint and deployment configuration? | Compare base/SFT/Turbo on required edits; self-host behind the adapter and pin a successful version | Production generation |
| What counts as paid listening? | Review bounded server-validated duration and tariff rules against Move | Usage evidence and allocation |
| Can the supplied ABI express October rules and reservations? | Compatibility report before any contract modifications | Accounting integration estimate |
| Are independent artist/operator nodes part of this release? | Managed S3/CDN delivery for this proposal | Reconciliation with the approved older London pilot |
| How long are drafts, evidence and provider inputs retained? | Short microphone retention; separately approved media/finance schedules | Production privacy and storage policy |
| Who reviews audio, rights and payment security? | Named reviewers before pilot, with distinct acceptance records | Release sign-off |

## Conflicting source scopes

The founder's ACE-Step selection supersedes the earlier Stable Audio-first benchmark recommendation in this proposal. Stable Audio and Eleven Music remain documented alternatives; neither is a simultaneous production dependency. ACE-Step family selection is a product/implementation decision, not a completed benchmark.

The founder's later open-upload instruction replaces this plan's original small manually licensed catalogue as the product admission model. Anyone with an account can upload and publish eligible audio. A permission-cleared sample set remains necessary for model testing, and individual upload declarations remain distinct from verified monetization rights. Public website/deck copy and the older curated London pilot have not been revised by this change.

The website and private October deck describe bespoke artist models. The founder's later instruction in this architecture task removes that implementation requirement. This plan records that change without silently revising the website or investor deck.

The canonical whitepaper and PIPs describe earlier subscription, PRT, Porto Chain and operator-pool concepts. The current October website instead proposes metered listening, variation sharing, 10%/30% Porto fees and Aptos/USDC settlement. These are distinct source scopes; this proposal does not amend the canonical protocol or turn public commercial percentages into implemented contract behaviour.

The current London [Move chapter](/london-0.1.0/09-move-contract-specification) and overview supersede the earlier RocksDB/hash-only accounting direction. Some earlier London chapters still describe that preceding model. Use the current Move chapter for accounting boundaries and complete the coordinated specification review before implementation.

Independent node operation and real cache transfer are requirements of the older approved London pilot. A managed S3/CDN product alpha proves different capabilities. Decide whether the new product pilot replaces that delivery experiment or runs alongside it; do not claim both with one managed-hosting deployment.

## Source register and research limits

| Evidence | Use and boundary |
| --- | --- |
| [Porto homepage](https://www.portolabs.xyz/) and [homepage source](https://github.com/porto-labs-xyz/lander/blob/main/src/pages/index.jsx) | Direct local source review of October product copy, fees, cap and settlement target; concept disclosures remain applicable |
| [Prototype README](https://github.com/porto-labs-xyz/player-prototype/blob/main/README.md) and [architecture](https://github.com/porto-labs-xyz/player-prototype/blob/main/docs/ARCHITECTURE.md) | Current interaction and implementation boundaries; fictional accounts, browser effects and simulated finances |
| Porto-Deck October.pdf, 15 slides, reviewed 13 October | Internal deck reference for streaming, commands, creator sharing and Ledger; not published here and not protocol or runtime evidence |
| [Whitepaper](/whitepaper) and [PIPs](/pips) | Canonical historical/product and normative protocol sources; conflicts are explicitly scoped above |
| [London overview](/london-0.1.0/overview) and [Move accounting chapter](/london-0.1.0/09-move-contract-specification) | Current accounting authority and evidence gates; approved docs do not prove deployed code |
| Released Porto style guide and current design guidance | Interface tokens, accessible player controls and voice/text interaction; this work does not release a new design system |
| [Stable Audio 3 repository](https://github.com/Stability-AI/stable-audio-3), [model card](https://huggingface.co/stabilityai/stable-audio-3-medium) and [release](https://stability.ai/news-updates/meet-stable-audio-3-the-model-family-built-for-artistic-experimentation-with-open-weight-models) | Documented inference modes and deployment/licence distinctions; exact weight licence governs, separately from MIT inference code |
| [ACE-Step 1.5](https://github.com/ACE-Step/ACE-Step-1.5) | Checkpoint-specific editing features, not a Porto quality benchmark |
| [ElevenLabs inpainting](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/inpainting) and [reference admission](https://elevenlabs.io/docs/help-center/product/core-capabilities/music/what-is-audio-reference) | Hosted editing alternative with input limits and admission screening |
| [Demucs](https://github.com/facebookresearch/demucs) and [FFmpeg](https://www.ffmpeg.org/ffmpeg-filters.html) | Separation baseline/limitations and precise processing primitives; pinned build and dependency review required |
| [CloudFront private access](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-overview.html), [signed grants](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html) and [SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) | Delivery access and queue semantics, not proof of Porto deployment |
| [Aptos payments](https://aptos.dev/build/guides/payments) | Committed success and transaction finality; exact Porto ABI remains uninspected |
| [Deepgram streaming](https://developers.deepgram.com/docs/live-streaming-audio) and [structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Speech and constrained planning capabilities; no selected account/provider contract or runtime test |

External sources were checked on 13 October 2026. Capabilities, account access, pricing and licences can change, so recheck the pinned deployment before procurement. No credentials, original catalogue, contract implementation or real funds were used in this research. All duration, staffing, capacity, cost examples and performance thresholds are explicitly proposed until measured.

This document is review material. Publishing it does not authorize Mainnet launch, claim secured catalogue rights, guarantee instrument removal or establish earned royalties.
