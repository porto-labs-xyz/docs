---
id: 20-api-contracts
title: "API contracts and endpoint catalogue"
sidebar_position: 21
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Contract authority

[OpenAPI](openapi.json) is the exhaustive coordinator and node HTTP surface for this release. It includes closed request/response schemas, examples, authentication, ownership, rate limits, error envelopes, audit-event names and idempotency rules. [Artifact schemas](artifact-schemas.json) defines retained files; [fixtures](fixtures.json) supplies deterministic examples. Do not implement former draft fraud-case, claims, on-chain registry or attestor endpoints.

Examples are synthetic structural examples. Zero-byte signatures are deliberately not cryptographic proofs. Validate signatures, cross-field relationships, amounts and state transitions in addition to JSON Schema. Exact artifact bytes are downloaded canonically, even when human displays pretty-print them.

## Endpoint inventory

| Method and path | Authorisation | Limit | Request → response schema |
|---|---|---|---|
| `GET /v1/me` | Own authenticated account | 60/min/account | `none` → `Account` |
| `POST /v1/billing/checkout` | Listener; server-selected approved plan | 5/min/account | `CheckoutRequest` → `URLResponse` |
| `POST /v1/billing/portal` | Own billing account | 5/min/account | `Empty` → `URLResponse` |
| `GET /v1/catalogue` | Public available catalogue | 120/min/IP | `none` → `Catalogue` |
| `GET /v1/renditions/{rendition_id}/manifest` | Entitled listener or approved node | 120/min/principal | `none` → `Manifest` |
| `POST /v1/sessions` | Own entitled listener; one active session | 10/min/account | `SessionRequest` → `Session` |
| `POST /v1/sessions/{session_id}/close` | Owner of session | 30/min/account | `Empty` → `Ack` |
| `POST /v1/sessions/{session_id}/grants` | Session owner; entitlement and prebuffer checks | 120/min/session | `GrantRequest` → `GrantResponse` |
| `POST /v1/nodes/{node_id}/health` | Token node equals path/body node | 6/min/node | `HealthRequest` → `HealthResponse` |
| `POST /v1/nodes/{node_id}/fills` | Pending or active destination node equals path; bootstrap allowed | 120/min/node | `FillRequest` → `GrantResponse` |
| `POST /v1/grants/{grant_id}/consume` | Selected source node; destination proof on peer fills | 2400/min/node | `ConsumeRequest` → `Consumed` |
| `POST /v1/receipts` | Source node token and receipt key match grant | 2400/min/node | `Receipt` → `Ack` |
| `POST /v1/peer-results` | Destination node token/key bound to grant | 120/min/node | `PeerResult` → `Ack` |
| `GET /v1/statements` | Own artist/operator beneficiary only | 60/min/account | `none` → `Statements` |
| Pending nodes may fetch manifests and seed caches from origin/active peers; they may not receive paid playback or act as participant sources until active. This avoids requiring an active cache before granting the access needed to build it.

`GET /v1/statements/{statement_id}/proof` | Statement beneficiary or authorised finance auditor | 10/min/account | `none` → `ProofBundle` |
| `GET /v1/operator` | Own operator account | 60/min/account | `none` → `OperatorView` |
| `GET /v1/batches/{batch_id}` | Public metadata only, no raw private evidence | 60/min/IP | `none` → `BatchStatus` |
| `GET /v1/indexes/{batch_id}` | Public confirmed statement-index only | 30/min/IP | `none` → `IndexArtifact` |
| `GET /node/v1/content/{rendition_id}/{chunk_index}` | Grant bound to path/source; request ID; peer proof for fills | 2400/min/node | `none` → `Ack` |
| `GET /node/v1/health` | Public liveness only; detailed status private | 30/min/IP | `none` → `NodeHealth` |

## Ownership and purpose rules

Node path IDs must equal the authenticated node. Consumption is authorised to the grant's source; fill request/result is authorised to its destination. Playback grant session must belong to the browser account. A peer grant must have null session and non-null destination; playback must have non-null session and null destination. Probe grants are internal-only, never returned to a paying-session endpoint. Receipt purpose/node/rendition/chunk/request/consume sequence must exactly match the grant and consumption record. Signature key must be valid at consume time and not compromised in the relevant reviewed interval.

The manifest has an init chunk with zero media duration and index `init`; media chunks use indices 0..N-1 without gaps. Public manifests omit internal storage keys. Operator inventory is advisory and verified by probes/content checks. Complete receipt bytes must equal the signed manifest's exact length; a receipt claiming complete with short bytes is rejected rather than trusted.

Pending nodes may fetch manifests and seed caches from origin/active peers; they may not receive paid playback or act as participant sources until active. This avoids requiring an active cache before granting the access needed to build it.

`GET /v1/statements/{statement_id}/proof` is financial/private and requires ownership; a random UUID does not grant access. Each payment journal must have a matching confirmed commitment locator in the bundle. If not anchored yet, show payment confirmation separately with journal verification `not_checked`. Public batch/index endpoints never expose raw usage, listener IDs, rights agreements, provider references or full accounting files.

## Idempotency and transport

All coordinator POSTs require Idempotency-Key; same principal/route/key with changed canonical request returns 409. IDs must match existing objects and current state. GET node content is a one-use authorised transfer despite its HTTP method: X-Request-ID is persisted locally; retry after partial delivery must obtain a fresh grant. Do not use HTTP/browser caching to bypass grant consumption. Node content rejects Range and redirects.

Receipt POST returns the stored disposition synchronously after durable insert and basic validation; final session eligibility can still change at closure. Exact duplicate receipt returns its original stored acknowledgement, while the latest statement reflects later decision revisions. Health response carries withdrawal commands and authoritative status. Fill result acknowledgement is evidence of ingestion, not proof of physical delivery.

## Provider and administrative interfaces

Provider callbacks are mounted at `/integrations/billing/{provider}/webhook` by the selected adapter. Its raw signed payload and authentication are provider-specific. `BillingEvent` is the internal normalized schema after signature/time/event verification; it is never an unauthenticated public JSON injection endpoint. Login/callback routes are provided by the selected identity adapter and must validate provider state/nonce/issuer/audience. These adapter routes become concrete at L02, with provider sandbox contract tests required by G3.

Manual admin commands use `NodeAdmission`, `CatalogueImport`, `FundingImport`, `HoldCommand`, `PayoutApproval`, `RightsSnapshot`, `EconomicPolicy`, manifest and role-checked domain functions. They are not a second undocumented public REST API. Payout approval binds hashes and caps, not a mutable list of recipients. Full-audit export requires finance authorization and logs object access; no unauthenticated export route exists.

## Errors and audit

All methods declare safe Error responses. Apply common meanings in [backend contracts](10-off-chain-services-and-apis.md); 429 has Retry-After, and correlation IDs identify private audit records. Schema validity does not imply entitlement, signature validity, honest receipt or sufficient funds. Denied access must not reveal whether another person's object exists. Every mutating operation emits its requested/completed/denied family with actor, target, request hash, outcome and timestamp. Never log grants or secrets verbatim.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
