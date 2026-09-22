---
id: 10-off-chain-services-and-apis
title: "Backend modules, APIs and provider boundaries"
sidebar_position: 11
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## One backend, restricted jobs

Build a modular backend and transactional worker system. PostgreSQL is authoritative for entitlements, grant consumption, evidence decisions, budgets and obligations. Object storage retains exact signed/canonical artifacts. API and worker can share a repository and deployment pipeline, but payment credentials are scoped to the payment worker. A DB outbox removes the need for a broker at pilot scale.

Every job has a stable business key, lease expiry and retry count. Acquire work under database locks, commit state and outbox atomically, and retry with exponential backoff capped at five minutes. A failed job after ten attempts becomes an explicit operator alert; money jobs remain pending/uncertain, never silently dropped. Worker restarts must not duplicate grant consumption, allocation, commitments or transfers.

## HTTP conventions

[OpenAPI](openapi.json) defines the public/coordinator/node contracts with schemas and examples. [Endpoint guide](20-api-contracts.md) binds ownership and behaviour. Prefix coordinator routes `/v1`; node routes `/node/v1`. Return `X-Correlation-ID`, generated UUID if absent. Enforce 1 MiB request limit except documented import/export tooling; receipts are one record per request. All JSON is UTF-8 and rejects duplicate object keys and unknown properties.

All POST requests require `Idempotency-Key` (UUID) scoped to principal, route and method, except provider webhooks which use provider event ID. Persist request hash and original response atomically. Same key/same body returns original result; changed body returns 409 `IDEMPOTENCY_CONFLICT`. Cache transport responses for seven days, but retain business uniqueness for receipt, allocation and payment IDs throughout their evidence lifetime. A timed-out financial request keeps its original ID. GET is read-only.

Browser authentication uses Secure HttpOnly SameSite=Lax session cookies, CSRF token and allowed-origin checks on writes. Sessions expire after 24 hours, refresh through the selected identity provider; step-up is required for finance/admin operations. Node credentials are randomly issued bearer tokens over TLS, stored hashed by Porto and scoped to exactly one node. A receipt also requires the node's independent signing key. Internal workers use separately scoped workload credentials. No endpoint accepts a client-selected account owner as authority.

## Provider adapters

Identity adapter: map a verified provider subject to one internal account and role grants. Login initiation/callback use the selected provider SDK; callback validates issuer, audience, state, nonce and redirect allowlist. OpenAPI exposes the resulting `GET /v1/me` session, not invented provider endpoints. Local/test auth is fixture-only and production must refuse it.

Billing adapter interface: `create_checkout(account,plan,return_url,idempotency_key)`, `create_portal(account)`, and `verify_and_normalize_webhook(raw_body,headers)`. Normalized event fields are provider, event ID, type, payment/subscription/period IDs, account mapping, event time, currency, gross pence, service start/end and provider evidence reference. Types: `access_active`, `access_ended`, `payment_cleared`, `payment_refunded`, `chargeback`. Checkout success alone never grants access. Verify the selected provider's precise clearance meaning and out-of-order semantics before production. Access may begin on verified paid subscription activation before treasury funds clear; settlement still waits for funding. Ended access cannot be revived by an older event. Duplicate events are no-ops.

Treasury conversion is manual through an approved provider in this release. Do not build exchange automation. Finance imports a signed-off funding lot through the admin tool, including provider reference, deductions, actual received USDC, deposit transaction and subscription-period assignments. The ledger independently verifies the chain receipt and rejects reused deposit units/overallocation. Evidence and tax/provider documents remain private.

## Minimum admin commands

Implement authenticated CLI commands with dry-run and JSON result: `catalogue import|activate|disable`, `operator invite|approve|suspend|rotate-key`, `funding import|reconcile`, `hold create|release|close`, `day close|prepare|verify|commit`, `payout prepare|approve|execute|reconcile`, `export audit`, `profile validate`. Node admission consumes the exact `NodeAdmission` schema, including a single-use Porto-issued registration challenge valid for five minutes and proof of the participant key. Catalogue import consumes `CatalogueImport`; activation remains a distinct approval after validation. The challenge signature excludes its own signature field and uses the node-registration domain. Commands call the same domain functions as jobs, require the same roles and emit the same audit records. No direct SQL edits are an approved operational interface.

## Rate limits and errors

Limits in OpenAPI are per authenticated principal and return 429 with Retry-After seconds. Pagination uses opaque cursor and limit 1..100, default 50. Error envelope: code, safe message, correlation ID, retryable boolean. Use 400 malformed/schema, 401 unauthenticated, 403 forbidden/entitlement, 404 absent or inaccessible object, 409 state/conflict, 410 expired grant, 416 unsupported Range, 422 semantic/integrity, 429 rate limit, 503 dependency unavailable. Never put tokens, raw provider events, private notes or listener identifiers into public errors.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
