---
title: Full development plan
sidebar_position: 5
---

**PROPOSAL FOR REVIEW · 13 October 2026 · Estimates, not a committed launch date**

## Staffing and assumptions

Plan for 14 to 18 calendar weeks with two experienced engineers, one primarily frontend/product and one backend/Aptos, plus fractional ML/audio, rights and security support. ACE-Step 1.5 checkpoint evaluation overlaps foundation work. A solo build is approximately 24 to 32 weeks, with concentrated ML/security help; these are planning estimates with significant audio-quality and contract-compatibility uncertainty. The open-upload revision adds roughly two weeks to the earlier planning range for self-service ingestion, quotas and content/report workflows. Week numbers begin when access, sample-set permission and engineering availability exist, not on publication of this document.

The first vertical slice should arrive in weeks 4 to 6: self-service upload of one real permitted track, processing and publication, text request, asynchronous rendering, signed playback and persisted lineage. Voice and the shared generative edit follow as their tests pass. Do not begin a broad social build before this loop works.

The supplied Aptos package is assumed available, but integration readiness is unverified. Work below includes ABI/deployment validation, not a replacement payment protocol. The existing Rust coordinator and TypeScript frontend direction are retained; Python stays inside the audio worker. Repository placement must follow the current product checkout instructions when implementation starts.

## Phases and acceptance gates

| Phase | Estimate / dependencies | Deliverable | Exit evidence |
| --- | --- | --- | --- |
| 0. Scope and contracts | Week 1; founder, rights owner and backend engineer | Open-upload account policy, uploader declarations/remix permissions, supported formats/quotas, content/report policy, funding route, pricing, exact Aptos chain/package/ABI/asset | Source assets available; permissions cover edits and sharing; contract capability matrix completed; unresolved real-money gates identified |
| 1. Audio evaluation | Weeks 1 to 2; permission-cleared tracks | ACE-Step base/SFT/Turbo editing comparison, source-conditioning/repainting adapter spike, stem/DSP baselines, warm/cold latency and cost report | [Model gate](audio-research.md) reviewed; ACE-Step checkpoint/revision/hashes pinned or generative scope reduced |
| 2. Foundations | Weeks 2 to 4; phase 0 basics | Environment/IAM, database, public signup, self-service/resumable uploads, quotas, validation/transcoding, S3/CloudFront, ingestion queue and deployment pipeline | Any account can upload without partner approval; interrupted upload resumes; invalid/oversize media fails; one admitted track plays; basic reporting/holds work |
| 3. First audio loop | Weeks 4 to 6; phases 1 and 2 | Original-track metadata/publication and remix controls, text plan, quote/reservation, async edits, result manifests, native playback and lineage | One permitted real track completes end to end; repeated submit and duplicate queue messages create one visible result and one allowance finalization |
| 4. Voice and product persistence | Weeks 6 to 8; phase 3 | Speech transcript, same text pipeline, progress/cancel, names, saved tracks, private drafts, keyboard/mobile behaviour | Voice under playing music tested; text fallback works; stale completion never changes selected playback; accounts persist across devices |
| 5. Discovery and sharing | Weeks 8 to 11; publication rights | Uploaded originals and variations on profiles/feed, follows, search/tags, lineage, comments, content reports/review/appeals and withdrawal | Explicit publication only; private drafts absent from search; withdrawal blocks discovery and grants; title/parent attribution consistent |
| 6. Accounting integration | Weeks 6 to 12; ABI and commercial decisions | Bounded listening sessions, accepted-usage batches, testnet funded state, settlement/indexer projection, budget and Ledger UI | No overspend across tabs; event replay matches statements; failures/retries reconcile; refunds and holds have defined handling |
| 7. Hardening | Weeks 12 to 14; integrated scope | Load/device/audio QA, threat review, monitoring, cost caps, signer controls, restore and incident drills | Proposed release gates below pass; measured operational limits published internally |
| 8. Controlled pilot | Weeks 14 to 18; all applicable funding/rights gates | Staged open-signup rollout with capacity limits, measured uploads/listening/sharing, cost report and verified payout evidence if real money is authorized | Review quality, return listening, unit economics and recipient confirmation before expansion |

Payments can be developed alongside voice/social features; billing must not be enabled just because a testnet transfer passed. If model preservation fails, ship the deterministic/stem slice with clear capability wording and extend research time. If the contracts cannot express required reservations or revenue rules, phase 6 needs an additional separately scoped contract review and implementation estimate.

## Work packages suitable for tickets

| Package | Suggested owner | Concrete work |
| --- | --- | --- |
| Product and rights | Founder + rights lead | Define allowed requests, source/derivative permissions, visibility, withdrawal, downloads, territory and revenue policy |
| Open-upload ingestion | Frontend + backend + audio specialist | Upload UI/status/resume, multipart sessions, byte quotas, validation/transcoding, waveforms, metadata and permission binding |
| Content operations | Backend + product/rights lead | Report/hold/takedown/appeal tools, notifications, disputed-recipient holds, account abuse controls and orphan cleanup |
| API and identity | Backend | Auth/session management, user/creator IDs, ownership checks, role boundaries, schema validation and migrations |
| Command planning | Backend + audio specialist | Intent router, structured plan, ambiguity/rejection policy, deterministic executor mapping and adversarial input suite |
| Render pipeline | Backend + audio specialist | Model adapter, SQS/outbox, leases, CPU/GPU processing, quality checks, codecs, cache and cancellation |
| Player and voice | Frontend | Persistent native player, seek, transcript sheet, permission/error states, progress, audio gesture and accessibility checks |
| Drafts and genealogy | Frontend + backend | Save/rename/refine, immutable parent/root linkage, bounded graph API, artwork metadata and cross-device persistence |
| Social surfaces | Frontend + backend | Profiles, follow/unfollow, chronological discovery, library/search, publish permissions, comments and report/remove tools |
| Usage and finance | Backend/Aptos | Allowance, evidence validation, accepted-batch submission, wallet/funding route, event indexing, payout reconciliation and Ledger |
| Operations | Backend + security reviewer | Infrastructure as code, secrets, alerting, backups, spend limits, privacy/withdrawal drills, release and rollback |

Use small vertical increments with a reviewable acceptance example. Infrastructure, database schemas and a mocked model interface are insufficient evidence of the complete product. Every ticket should link its relevant decision and state whether it proves unit behaviour, staging integration or real pilot evidence.

## Meaningful test plan

| Area | Required evidence |
| --- | --- |
| Command correctness | Supported/unsupported mixtures, relative refinement, wrong-track references, ambiguous intent, prompt injection and parameter limits |
| Uploads | Public signup without partnership/payout-wallet requirements, multipart retry/resume, expired grants, checksum/size mismatch, corrupt/spoofed codec, quota races, duplicate completion and orphan cleanup |
| Publishing and reports | Public/private access, metadata/tag search, remix/download opt-in, blocked media pending processing, report/hold/appeal flow and withdrawal propagation |
| Audio | Numerical DSP checks, supplied-stem reconstruction, audible before/after comparison, clipping/silence, vocal corruption, chunk transitions and full-track duration |
| Job reliability | Duplicate submit/delivery, worker crash during render/upload/commit, provider timeout, fenced completion, cancellation race and spend-release reconciliation |
| Authorization | Other user's draft/job/media access denied; territory/revoked rights enforced in generation, publication and grants |
| Browser/device | Real Safari/iPhone and Android Chrome, voice with speaker/headphone playback, denied microphone, backgrounding, offline/reconnect, seek and stale render completion |
| Money | Concurrent sessions, budget exhaustion, duplicate funding webhooks, failed/expired transactions, indexing lag, integer rounding, tariff/rights-version boundaries and daily reconciliation |
| Operations | Restore product database/media references, rebuild chain projection, rotate credentials, recover dead-letter jobs and exercise model/CDN/chain outage |
| Accessibility | Keyboard controls, visible focus, screen-reader status, reduced motion, 320px layout and enlarged text |

Use contract integration tests against the exact configured testnet package and test asset. Keep their result distinct from Mainnet funding, auditing and recipient-confirmed payout. Server delivery evidence limits fraud; it does not prove that a human listened.

## Capacity and cost model

Start with a bounded invite pilot. Illustrative sizing: 100 daily active listeners, two generation requests each per day, and ten minutes of listening per listener. At 192 kbit/s, 1,000 listening minutes deliver approximately 1.44 GB/day before overhead; audio storage is roughly 5.76 MB per four-minute playback rendition. Stereo 48 kHz, 24-bit PCM masters consume about 69 MB per four-minute track. These are arithmetic scenarios, not measured demand or provider bills.

Calculate cost from actual workload:

```text
accepted_generation_cost =
  (speech + planner + model/GPU + processing + failed_attempts + storage_IO)
  / accepted_results

monthly_operating_cost =
  API + database + backups + monitoring + queue + retained_storage
  + uploaded_minutes * measured_ingestion_cost_per_minute
  + content_review_cases * measured_review_cost_per_case
  + CDN_GB * contracted_delivery_rate
  + generation_attempts * measured_attempt_cost
  + payment_provider_fees + sponsored_gas + FX_costs

effective_GPU_cost_per_job =
  GPU_hour_rate * service_seconds / (3600 * achieved_utilization)

required_worker_concurrency =
  peak_jobs_per_second * p95_service_seconds / target_utilization
```

Obtain current quotes for the selected region, instance/model, provider plan and payment route; no vendor price is assumed here. Include cold starts and idle capacity. A GPU that scales to zero saves idle cost but increases wait time. Separate preview, full render, replay and original-listening costs. Cache identical authorized deterministic renders by source, plan, rights and renderer version; cache stochastic results only for exact replay, not by loosely matching prompts.

As a sensitivity example, a £10 listening allocation on variations yields a proposed £3 Porto share. Fifty generations at an assumed £0.10 each would cost £5 before delivery or operations. These assumed numbers demonstrate why listening revenue alone cannot justify unlimited generation. Choose a generation quota, separate price or explicit pilot subsidy before enabling it. Do not reduce rights-holder allocations to cover an unapproved compute cost.

## Release gates

Private/testnet alpha requires a permission-cleared evaluation set, working self-service uploads, supported-operation evidence, authenticated storage/playback, recoverable jobs, tested budgets and clear test money. Public open-upload rollout additionally requires tested quotas/cleanup, content/report/review/appeal operations and separate remix permissions. Uploading does not require monetization or a payout wallet. A real-money pilot additionally requires reviewed contract/security evidence, chosen funding and FX route, approved revenue rules and cap subsidy, bounded treasury exposure, recipient verification, refund/chargeback policy and monitored reconciliation.

Initial targets for review are API availability 99.5% during the pilot, signed playback startup p95 under two seconds on the agreed test network, and no unreconciled accepted charge after the daily close window. Instrument them before claiming them. Missed generation targets reduce admitted load or capability; they do not become invisible failures.

Pilot measures: completed/failed uploads, processing time, creator publication rate, storage and review cost, report-resolution time, accepted transformation rate, time to playable preview, cancellation/error rates, cost per accepted version, repeated listening, explicit sharing, source-original listening, and actual net artist receipts where applicable. Set the review period and sample size before interpreting outcomes. Expansion requires satisfactory evidence, not a more elaborate architecture diagram.
