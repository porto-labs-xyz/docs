---
title: High-level architecture
sidebar_position: 2
---

**PROPOSAL FOR REVIEW · 13 October 2026**

## Components and responsibilities

| Component | Responsibility | Recommended starting point |
| --- | --- | --- |
| Frontend app | Self-service signup and uploads, title/artwork/tags, visibility and remix controls, player, voice/text, drafts, feed, search, lineage and Ledger | Responsive TypeScript web app; reuse Porto's design and prototype interaction patterns |
| Porto backend | Authentication, upload sessions/quotas, content processing and reports, catalogue, rights, edit planning, jobs, publication, budgets and chain integration | Modular Rust service, consistent with the current London coordinator direction; one deployable API, no initial microservice programme |
| Speech service | Convert captured speech to text | Managed streaming transcription, proxied by the backend; typed input uses the same command path |
| Text planner | Classify playback versus edit requests and emit a constrained plan | Small hosted model supporting schema-constrained output; provider chosen by accuracy and latency tests |
| Job queue | Buffer rendering work and redeliver interrupted jobs | SQS plus dead-letter queue; database outbox prevents lost enqueue events |
| Audio worker | Validate uploaded media, generate waveforms/renditions, then run approved processing/model operations and check output | Python container with pinned audio libraries and model adapter; separate CPU ingestion and GPU generation queues/pools |
| Shared audio model: ACE-Step 1.5 | Transform uploaded original/parent audio using the validated edit instruction | Selected pretrained model family, self-hosted behind the Python worker adapter; pin the checkpoint after editing tests; no artist training |
| Product database | Users, upload sessions, track metadata/permissions, reports, genealogy, jobs, social data and indexed chain events | Managed PostgreSQL; a financial display projection, not a second authoritative royalty ledger |
| Object storage | Immutable source masters, permitted stems, renders, artwork and private evidence | Private S3 buckets separated by data class and environment |
| Delivery | Serve granted audio efficiently and support seeking | CloudFront over private S3, using origin access control and expiring grants |
| Aptos integration | Read funded state, submit accepted usage, observe allocation and reconcile payouts | Adapter to the supplied Move package; pin network, ABI, asset metadata and package version |

Operational modules inside the API remain independently testable, but share deployment and product database. The worker is a separate process because music rendering has different hardware, latency and failure characteristics. The initial infrastructure can use ECS/Fargate for the API and CPU jobs, and EC2 GPU instances managed through ECS for a self-hosted model. Fargate is not the proposed GPU execution environment. A hosted model adapter avoids owning GPU capacity if it passes the same tests and catalogue terms.

## Anyone can upload and publish audio

The product is open to anyone with an account, including independent musicians and people uploading recordings or other audio. A manually negotiated artist relationship is optional. Initial alpha access may be operationally limited while the service is tested, but the intended product does not gate uploading on partner status, invitation or a payout wallet.

1. The uploader chooses a file and supplies title, description, artwork, tags and attribution. They confirm their authority to upload and select public or private visibility. Public is available to any eligible account; publication is an explicit action after processing.
2. The API reserves the account's storage allowance, creates an upload session and issues short-lived signed S3 upload grants to an owner-specific quarantine key. Large files use resumable multipart upload. The browser sends bytes directly to S3, while the API tracks authorization and completion. AWS documents [multipart completion and cleanup](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) and [presigned uploads](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html).
3. On completion, the server checks the recorded object, checksum and claimed size, then queues ingestion. Never trust a client-only success event. Inspect actual media format, decodability, duration and channels; run malware/content checks and bounded decoding. Reject invalid files with a clear retry path.
4. A CPU worker produces a playback rendition, duration, loudness metadata and waveform. Keep the admitted source immutable. Processing failure leaves the track unavailable; the original uploaded bytes cannot bypass admission through a public URL.
5. After required checks pass, the owner can publish to their profile and discovery feed or retain a private track. Ordinary uploads do not need manual catalogue approval. Flagged or disputed items enter an administrative review/hold workflow. Index only published, eligible renditions.
6. The owner controls permissions for others to create AI variations and download audio independently from visibility. Other-user remixing is off unless explicitly enabled; the owner can request a private transformation after confirming the relevant source rights. Sending audio to a model for inference is disclosed separately from model training. No training programme is authorized by uploading.

Choose initial supported formats and limits before implementation. Suggested ingestion scope is MP3, WAV, FLAC, AAC/M4A and Ogg, with a 500 MB per-file and 60-minute source-duration ceiling, subject to codec and load tests. These are review defaults, not paid plan terms. Generation retains its separate four-minute starting limit; longer uploads remain listenable, with selected excerpts eligible for transformation. Content need not be music to upload, but the shared music model only transforms supported audio types that pass evaluation.

## Voice or text to a playable version

1. The app binds the request to the selected track and parent variation, with a stable client request ID. Playback continues while the listener opens the command sheet.
2. After an explicit microphone gesture, send bounded microphone audio to the backend speech endpoint. Show an editable transcript. Finalized text enters the same endpoint as typed text. Do not automatically submit interim recognition or react to lyrics leaking through speakers.
3. Resolve an explicit named track, or use the bound current track. Distinguish `play`, `pause`, `seek`, `search` and `transform`. Playback commands do not enqueue generation jobs.
4. The text planner emits a typed plan. It cannot select storage URLs, change rights, invent prices, execute shell commands or invoke payment transfers. Server code resolves asset IDs, checks operation support and parameters, and asks a brief clarification when intent is ambiguous.
5. Check the track's effective permissions, territory, licence expiry, visibility rules and parent restrictions. Obtain a server quote where applicable. Reserve the bounded generation allowance atomically before accepting a job. Return the existing result for a repeated idempotency key.
6. Commit the job and an outbox event in PostgreSQL; the outbox dispatcher sends the job ID to SQS. Return `202` with a status URL. The request connection never stays open for the entire render.
7. The worker leases the job, rechecks permission and allowance, loads server-resolved audio from S3, applies precise edits and/or calls the shared audio model. It uses the parent audio as the edit input and preserves the original root as attribution. Store operation order explicitly.
8. Validate decoded output, duration, sample rate, clipping, channel count, silence and edit-specific constraints. Store a lossless render and a playback rendition with an immutable manifest and hash. Commit the result and final usage once. Failed or cancelled jobs release the unused reservation.
9. Notify the app through server-sent events, with polling fallback. The app presents the new version for explicit playback, naming and sharing. A completed stale request cannot replace a newer selected track. Playback follows browser gesture requirements, especially on iOS.
10. A separate publish action checks permission again and exposes the version in the feed. Creating a private draft is not publication or proof of a royalty-generating stream.

Music generation is asynchronous file production. The first release plays validated stored audio through the native media element, matching the prototype's current prepared-audio direction. Streaming partial model output, live neural effects and native mobile packaging are later experiments.

## The combined request

For “Remove the guitar. Slow it down. Make it dreamy”, resolve a permitted guitar stem if available, mute it, apply a bounded tempo change with pitch preservation, then generate a source-conditioned mood transformation if that operation has passed evaluation. A generative pass might reintroduce guitar or change melody. Validate the final output against the whole request; do not declare success merely because all three stages returned files. If preservation is essential, offer a deterministic dreamy effects rendition instead, with the user's understanding of the supported outcome.

Artist-supplied aligned stems are optional catalogue assets, not a training dataset. If only the stereo master exists, instrument removal is supported only after a separation benchmark passes for that track and target instrument. Unsupported clauses reject the whole plan before spending allowance; never silently apply half a request.

## Storage and playback

Use opaque IDs and versioned content keys, such as `uploads/{user_id}/{upload_id}/source`, `originals/{track_id}/{asset_version}/source` and `variations/{variation_id}/{render_version}/playback.mp3`. Keep admitted source files immutable and preserve their actual format. Store object keys and hashes in the database; do not use expiring URLs as permanent identifiers. Quarantined objects, unfinished multipart uploads, separation intermediates and expired drafts have explicit lifecycle rules.

Separate catalogue originals/stems, rendered drafts/publications, private usage evidence and short-lived microphone recordings into buckets with distinct IAM and retention policies. Enable encryption, TLS, block public access, object versioning where useful and tightly scoped worker roles. A browser can upload only through a short-lived grant to a predetermined object key; verify size, codec and content before admission.

The app requests a playback session from the API. The API validates the track's public or private access rule, rights, publication status and budget policy, then issues a short-lived CloudFront URL or cookie. CloudFront reads from S3 through origin access control. Range requests enable seeking without downloading the whole track. AWS documents [signed access](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html) and [private origins](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-overview.html). Expiring grants reduce exposure; they do not prevent recording or instantly revoke a file already downloaded.

Start with progressive MP3/AAC delivery and measured waveform data. Evaluate HLS if segment evidence or delivery behaviour requires it. Private stems and masters never receive listener playback grants. CDN requests, seeks, buffer prefetch and generation previews do not automatically become billable listening.

## Payment and accounting boundary

The current [Move specification](/london-0.1.0/09-move-contract-specification) makes Move authoritative for funded budgets, accepted aggregate usage, allocation, unpaid obligations and payout completion. Preserve that boundary. PostgreSQL holds account mappings, short-lived job reservations, private receipt validation and rebuildable financial projections. A job reservation limits compute spend; it cannot invent funded money or finalize a royalty obligation.

For paid listening, issue bounded session allowance so concurrent tabs cannot overspend. Authenticate and deduplicate playback evidence, reject seeks/prefetch as extra duration, then submit accepted usage in bounded batches. Derive Owed, Sent and Confirmed from protocol events and successful transactions. With delayed indexing, display pending reconciliation and the projection's last indexed ledger version.

An accepted transaction hash is not payment success. Verify the configured chain and package, wait for commit, inspect success and expected events, and reconcile obligations by stable IDs. Aptos explains [transaction completion and finality](https://aptos.dev/build/guides/payments). The application still trusts Porto's acceptance of usage; chain settlement does not prove human attention.

The October proposed 90% original and 70% variation rights pools, metering and cap behaviour require compatibility review against the supplied contracts. Never emulate unsupported financial rules in SQL while presenting them as Move settlement. Contract changes, if needed, become a separately reviewed implementation package.

## Deployment and trust

Use development, testnet staging and production environments with separate buckets, databases, provider keys and Aptos configuration. Start in one selected UK/EU region after checking model/provider availability and data terms. Put the API behind TLS and request limits; keep database and worker access private. Use infrastructure as code, managed backups, structured monitoring and repeatable releases.

The frontend holds no persistent model secret, S3 credential or payout signing key. A dedicated signer with limited permissions submits authorized protocol transactions; the text planner never accesses it. Pin worker images, dependency licences and model versions, and keep enough provenance to reproduce precise edits and investigate stochastic ones. Server authentication determines creator identity, never an `@username` supplied by the client.
