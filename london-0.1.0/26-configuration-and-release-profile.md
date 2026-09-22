---
id: 26-configuration-and-release-profile
title: "Configuration and release profile"
sidebar_position: 27
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Technical constants

These are implementation defaults approved for this bounded MVP, not measured service claims. Changing a constant requires versioned configuration, matching tests and a prospective effective time. Core accounting/replay invariants are not configurable away.

| Field | Default / constraint |
|---|---|
| schema_version | london.v1 |
| region / accounting timezone | eu-west-2 / UTC |
| grant_ttl_seconds | 60 |
| consumed_transfer_deadline_seconds | 30 |
| session_idle_seconds / session_max_seconds | 120 / 21600 |
| session_boundary | Midnight UTC, entitlement/rights expiry, explicit close or work change |
| media_chunk_target_ms / prebuffer_ms | 2000 / 10000 |
| concurrent_sessions_per_listener | 1 |
| sessions_per_minute / grants_per_minute_session | 10 / 120 |
| receipt_deadline_seconds | 600 after consumption |
| daily_close_delay_seconds | 600 |
| eligible_threshold_ms | min(30000, floor(work_duration_ms / 2)) |
| max_credited_ms_listener_day | 86400000; excess holds whole day |
| heartbeat_seconds / stale_seconds | 20 / 60 |
| peer_fill_concurrency / playback_concurrency_node | 4 / 20 |
| participant_attempts_then_origin | 2 participant attempts, then 1 origin attempt |
| first_byte_timeout_seconds | 3 |
| API body bytes / default page / max page | 1048576 / 50 / 100 |
| transport_idempotency_days | 7; business uniqueness survives cache expiry |
| scheduled_accounting / payout_preparation | Daily after evidence/funding readiness; manual run approval |
| minimum_payout_micro_usdc | 1; zero creates no transfer |
| payout_sender_lanes | 1 serial account, one unresolved transaction at a time |

## Production profile, mandatory fields

A private JSON release profile contains: release ID; environment; approved-by records; effective timestamp; legal entity and territory list; identity/billing provider names and verified event mapping; GBP plan ID/price/service-period rules; finance deduction/reserve/refund/unused-budget policy references; `rights_bps`, `operator_bps`, `porto_bps` summing to 10000; conversion/custody provider references; chain ID; native-USDC metadata address; commitment package address; pinned transfer ABI and SDK/framework revisions; RPC endpoints; signer/admin account references; max pilot/run/recipient amounts; approved retention durations; production site/coordinator URLs; node image/backend commit digests; incident contacts and G0-G6 evidence links.

These values have no production fallback. A missing field, test fixture, unverified asset, zero cap, unknown provider, invalid percentage sum or mismatched chain is a fatal validation error before live billing, grants or signing start. Do not publish private terms, provider account references, personal contacts or secrets in this docs repository. Publish a redacted profile description and digest only.

Policy changes apply to new subscription periods. Existing funded periods retain the economic policy hash under which their budgets were created. Key rotations and suspensions can apply immediately to new authorisations but cannot rewrite historic signatures. Risk caps may be lowered immediately, leaving already signed transactions subject to reconciliation.

The [release-profile schema](release-profile.schema.json) defines the exact JSON keys. In addition to shape validation, require rights and operator shares greater than zero, basis-point sum 10000, `max_recipient <= max_run <= max_pilot`, HTTPS URLs, independently operated RPC endpoints, approved recipient lists and actual signed review evidence. The native-USDC asset pin must be verified against the issuer's current official deployment information, not its ticker.

For the G6 rehearsal, use a separately signed restricted rehearsal profile with real deployment pins and a specifically approved minimal transfer cap. It references G0-G5 evidence and a pending G6 record; it cannot enable public subscriptions or the participant pilot. The final production profile replaces that pending record with the completed G6 evidence before public paid access. This avoids requiring a completed Mainnet rehearsal before the authorised rehearsal itself can run.

## Synthetic profile

Tests use environment `fixture`, fake provider IDs, mock billing, testnet/localnet asset locator, test price and 6000/3000/1000 split. Fixture funding and addresses never enable production mode. Fixture examples demonstrate units and mechanics only. [Fixtures](fixtures.json) identifies synthetic inputs and expected outcomes; an agent must not promote it by renaming the environment.

## Release record

Before G5, assemble the complete non-secret profile, review signatures and actual deployment pins. Store its exact canonical bytes and hash beside the release evidence. Validate startup against that hash; unreviewed configuration drift disables signing and alerts operations. A docs change does not itself deploy a new profile or rotate a real key.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
