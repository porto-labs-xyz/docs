---
title: Data, APIs and reliability
sidebar_position: 4
---

**PROPOSAL FOR REVIEW · 13 October 2026**

## Minimum product records

| Record | Essential fields and invariant |
| --- | --- |
| User / creator | Server identity, handle, profile, consent and optional wallet mapping; handle changes do not change ownership |
| Upload session / quota | Owner, reserved bytes, S3 multipart ID, expected size/checksum, grant expiry, parts, processing job and quota finalization; no cross-account writes |
| Original uploaded track | Uploader, title, description, artwork, tags, source credit, audio type, optional work identifiers, processing state, visibility and immutable asset manifest |
| Report / content case | Reporter, track, reason, evidence reference, reviewer, hold/takedown/appeal status and audit trail; uploader declaration remains distinct from verified rights |
| Rights version | Effective dates, rights-holder splits, permitted edits, private preview/publication/download permissions and revocation; immutable historical versions |
| Audio asset | Object key, hash, codec, sample rate, channels, duration, lineage and validated status; immutable once admitted |
| Variation | Original root, direct parent, creator, chosen title, permission version, edit plan, model/render version, asset manifest and visibility |
| Generation job | Request ID, owner, source hash, quote version, reservation, state, lease, attempts, provider request ID and terminal result |
| Library / follow / comment | Authenticated owner and target, cursor pagination, moderation/deletion state; independently persistent from playback |
| Playback session / receipt | Granted asset, user/account mapping, server session ID, incremental eligible duration, sequence and deduplication keys |
| Chain projection | Network/package, committed ledger version, event identity, obligation/transfer IDs and indexer cursor; rebuildable from protocol events |
| Audit / outbox | Authorized action, stable event ID, subject/version and delivery state; no raw secrets or microphone audio in logs |

Genealogy is a directed acyclic graph. A variation has one immediate parent for the MVP and one immutable original root. Create children rather than modifying a parent's audio. Renaming changes display metadata, not identity, credit, rights or financial classification. Do not grant a creator a royalty share just because they created a version. Downloads require their own permission, independent of saving a track to the library.

Keep user data and media off chain. Use opaque protocol identifiers when mapping to public financial records. Model and prompt provenance remain private by default. A source-to-variation link is attribution, not a legal conclusion that a licence exists.

## Proposed API surface

These endpoints are an implementation planning contract. Existing London OpenAPI and Move ABIs remain authoritative for the established protocol integration until explicitly revised.

| Endpoint | Behaviour |
| --- | --- |
| `POST /v1/uploads` | Any authenticated account creates an upload session and atomically reserves storage quota |
| `POST /v1/uploads/{id}/parts` | Issue or renew bounded signed grants for specified parts of the owner's upload |
| `GET /v1/uploads/{id}` | Owner reads received parts, processing status, errors and result track ID |
| `POST /v1/uploads/{id}/complete` | Idempotent completion; verify object/parts/checksum server-side and queue one ingestion job |
| `DELETE /v1/uploads/{id}` | Abort unfinished upload, clean parts and release unused storage allowance |
| `PATCH /v1/tracks/{id}` | Owner updates title, description, tags, artwork and versioned visibility/remix/download permissions |
| `POST /v1/tracks/{id}/publish` | Publish a processed eligible original to profile/feed; ordinary tracks require no manual partnership approval |
| `DELETE /v1/tracks/{id}` | Owner withdraws original; stop new access and resolve linked variations under the applicable permission policy |
| `POST /v1/tracks/{id}/reports` | Submit bounded abuse or rights report into an auditable moderation case |
| `POST /v1/voice/sessions` | Create bounded authorized microphone stream; return transcript events |
| `POST /v1/commands/plan` | Resolve target and return validated intent, clarification or unsupported response; no charged side effect |
| `POST /v1/generation-quotes` | Return expiry, operation scope, maximum charge/allowance and tariff version |
| `POST /v1/variations` | Accept quote, source/parent and idempotency key; create one reserved asynchronous job |
| `GET /v1/jobs/{id}` / `/events` | Authorized status, progress and result; polling or server-sent events |
| `POST /v1/jobs/{id}/cancel` | Request cancellation idempotently; stop publication and settle reservation according to policy |
| `PATCH /v1/variations/{id}` | Owner changes title or other permitted metadata |
| `POST /v1/variations/{id}/publish` | Recheck rights, sharing policy and output eligibility before feed exposure |
| `GET /v1/tracks/{id}/lineage` | Root, ancestry and bounded descendant page; no unbounded whole-catalogue graph |
| `POST /v1/playback-sessions` | Verify permissions and allowance; return expiring media grant and evidence session |
| `POST /v1/playback-sessions/{id}/receipts` | Validate sequenced duration claims against granted delivery evidence; deduplicate |
| `GET /v1/feed`, `/search`, `/creators/{id}` | Stable cursor results filtered for territory and visibility |
| `PUT /v1/library/{id}`, `PUT /v1/follows/{id}` | Idempotent account state; delete reverses the action |
| `POST /v1/tracks/{id}/comments` | Authenticated bounded text, report/delete controls and spam limits |
| `GET /v1/budget`, `/ledger` | Funded state and indexed obligations, with freshness and evidence labels |
| `POST /v1/top-ups` | Explicit funding intent for a selected payment route; never a silent extra charge |
| `/v1/admin/catalogue`, `/rights`, `/holds` | Restricted onboarding, rights control, revocation and investigation |

Example server-validated plan, not executable shell text:

```json
{
  "schema_version": 1,
  "intent": "transform",
  "source_track_id": "track_example",
  "parent_variation_id": null,
  "source_range": {"start_ms": 0, "end_ms": 30000},
  "operations": [
    {"type": "mute_stem", "stem_id": "guitar_aligned"},
    {"type": "tempo", "ratio": 0.8, "preserve_pitch": true},
    {"type": "audio_transform", "instruction": "dreamy", "preserve": ["melody", "lyrics"]}
  ],
  "output_scope": "preview",
  "publish": false
}
```

Source ID, stems, permission, model and price are resolved by trusted code. Reject absent stems, invalid source intervals, unknown fields, unsupported operations, out-of-range numbers and conflicts such as contradictory speed instructions. Quote separately for preview and full rendition; preview permission does not grant sharing.

## Upload states and content controls

Upload sessions follow `created → uploading → uploaded → inspecting → transcoding → ready`, with `failed`, `rejected`, `aborted` and `expired` terminal states. Track visibility follows a separate private/public state. A report may put a previously ready track on hold; ordinary processing does not imply manual curation. Show upload progress separately from server processing, and give a retry path without silently duplicating tracks.

Reserve storage against the declared maximum before granting upload access; enforce actual bytes on completion and safely finalize the reservation once. Limit active sessions, daily ingestion minutes and total retained bytes per account. Abort orphaned multipart uploads on expiry and release reservations through a reconciler. Client part ETags help complete the upload but are not assumed to be whole-file content hashes. A reupload gets a new source version; it cannot replace audio beneath an existing variation or royalty record.

Require an uploader rights declaration, with explicit permissions for public playback, owner transformation, other-user remixing, downloads and monetization. Public visibility alone enables none of the latter three. Do not gate ordinary uploading on signed artist contracts or payout onboarding. Publishing and other-user remix permissions are independently selectable; exact policy for derivatives after a permission change must be disclosed before publication.

Build reporting, disputed-content holds, reviewer tools, notification and an appeal workflow before public open-upload rollout. Checks should flag suspicious files and cases for review, not require staff to approve every normal track. A fingerprint match, if an approved provider is used, is a review signal rather than proof of ownership. Prevent user-selected royalty recipients and disputed claims from triggering irreversible payouts without the required verification/hold policy. Choose and approve content rules, complaint handling and retention separately from software implementation.

## Job state and cost control

The state path is `received → validated → reserved → queued → running → validating_output → ready`, with terminal `failed`, `cancelled` or `expired`. Publication is a separate variation state. Progress describes observed stages, not invented percentages. A cancellation can race with model completion; allow one terminal transition and one reservation finalization.

Reserve the maximum allowed generation spend in a serializable database transaction or an equivalent locked account operation. Record `reserved`, `consumed` and `released` as distinct compute-allowance states. On retries, query the provider request when supported; do not issue another expensive generation blindly after a timeout. Repeated client submissions return the same job. Two simultaneous devices share the same server allowance.

Queue delivery is not exactly-once execution. AWS documents SQS [visibility and repeated delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html). Use a database lease, fencing token, heartbeat, bounded retry/backoff and dead-letter policy. Only the current worker can finalize a job. Store candidate objects under attempt-scoped keys, then atomically commit one chosen manifest. Sweep unreferenced objects after a grace period. The outbox closes the database-to-queue gap; reconciliation closes the upload-to-database gap.

Proposed starting admission limits: one running generative job per user, two queued, a configurable global queue cap, a 30-second preview default and a four-minute full-render ceiling. Longer tracks and broader operations require measured capacity. These are review defaults, not approved commercial entitlements.

## Playback, budgets and money

Keep generation spend, listening spend and royalty allocation separate. One successful render is not a billable play. A public play count is not an accepted royalty record. Model-provider charges cannot be deducted from the rights pool without approved commercial terms.

Reserve bounded listening allowance per active session against funded protocol state and unsubmitted reservations. A supported atomic reservation/consumption protocol is required; if the supplied ABI lacks it, define a reviewed extension before real-money metering. Reconcile usage before issuing further allowance. All monetary quantities use integers with explicit asset precision and FX/tariff versions, never floating-point GBP-to-USDC conversion.

At the monthly cap, the public concept keeps originals playable while variations pause. Implement this only with a documented sponsor/free-tier funding rule. Unlimited unpaid original delivery cannot create royalty obligations against nonexistent funds. Define treatment of already owned/downloadable tracks and paid versus nonbillable previews. Explicit top-up changes access only after funding is verified, and a monthly reset cannot fabricate a deposit.

Confirm whether listeners fund directly in USDC or pay in GBP through a regulated payment provider. A GBP route adds provider webhooks, signature verification, duplicate-event handling, refunds, chargeback risk, treasury/FX reconciliation and a rule for irreversible crypto payouts. Testnet supports fake funding only with visible test labels. Do not build both funding routes before selecting the pilot path.

## Security, privacy and operations

Check authorization on every track, draft, job, lineage and media-grant request. Worker file access uses server-resolved object keys; never fetch an arbitrary user URL. Sandbox media decoding with CPU, memory, duration and size limits. Rate-limit commands, generation, login and comments. Maintain separate admin and signer credentials, with bounded payout permissions and an auditable release process.

Rights withdrawal blocks new generation and sharing, cancels queued work, stops new playback grants, removes feed/search visibility and invalidates CDN content where required. Previously delivered copies may remain outside Porto's control. Historical settled statements remain auditable according to agreed retention; user deletion does not rewrite a committed transaction. Catalogue contracts determine whether derivatives remain usable after source withdrawal.

Proposed retention defaults for review: delete microphone audio immediately after transcription, with a hard 24-hour processing-cleanup ceiling; retain operational transcript/plan records for 30 days unless a user saves a draft; expire abandoned draft media after 30 days. Financial evidence and released media require their own approved schedules. Verify provider-side retention separately. Do not record raw audio or private text in ordinary monitoring.

Monitor request/planner latency, queue age, worker lease expiry, model errors, accepted-output rate, generation spend, playback failures, grants rejected, usage submission lag, chain indexing lag and unresolved obligations. Alert on growing queues, sustained error rate, stale financial projections, permission-check failures and treasury shortfall. Stop new jobs when the spend cap or model circuit breaker trips; existing originals remain available only under their approved access rule.

Back up PostgreSQL with point-in-time recovery and test restoration alongside S3 manifests. Replay chain events from a recorded cursor. Initial recovery targets are product metadata RPO at most 15 minutes and RTO at most four hours, subject to a measured restore drill. Rebuild projections rather than editing them to make balances appear correct.
