---
id: 20-api-contracts
title: "API contracts"
sidebar_position: 21
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Normative common contract

The machine-readable [OpenAPI contract](./openapi.json) in this directory is the request/response schema catalogue. All fields shown in request examples are required; unknown fields are rejected. Responses include `schema_version` and `correlation_id`. Request bodies include `schema_version`. UUID-style CSPRNG identifiers replace readable synthetic example IDs. HTTP examples below are synthetic, not production observations.

Every endpoint requires `X-Correlation-ID` (1..128 safe ASCII characters); service writes use workload token plus mTLS, browser writes use cookie plus CSRF, login calls bind the one-use login transaction. Every POST requires `Idempotency-Key` (16..128 safe ASCII); login start binds that key to browser pre-session cookie. Read calls need no idempotency key and have no financial effect. See [retry semantics](10-off-chain-services-and-apis.md).

All endpoints return the shared error envelope `{schema_version, correlation_id, error: {code, message, retryable}}`. Common HTTP errors: 400 VALIDATION_FAILED, 401 UNAUTHENTICATED, 403 FORBIDDEN, 404 NOT_FOUND, 409 IDEMPOTENCY_CONFLICT, 413 BODY_TOO_LARGE, 429 RATE_LIMITED, 503 DEPENDENCY_UNAVAILABLE. Domain errors below use 409 for state/revision/conflict, 403 for entitlement/rights/scope/signature, 422 for invalid amounts/ranges/asset/policy and 503 for unavailable evidence. Each operation's `x-domain-error-status` in OpenAPI maps every domain error to its exact HTTP status and is authoritative. Do not leak object existence through errors to unauthorised callers. Rate limits are proposed defaults pending D09/D11. 429 returns Retry-After.

Financial business IDs remain permanently deduplicated even after the seven-day generic key cache expires. Every endpoint emits `<operationId>.succeeded` or `<operationId>.failed` with actor, target, request digest and correlation ID; access/export events omit secrets and detailed PII. Read audit logs may be aggregated only if scope and access accountability remain reconstructible.

## Fields and bounds

Unsigned decimal strings must fit u64 unless explicitly defined as u128 intermediates. `fx_usdc_per_gbp` is a positive exact decimal with at most 12 fractional digits, converted to a rational for arithmetic. Hashes are SHA-256 lowercase hex. Times are UTC RFC3339. Amounts ending `_micro` are micro-USDC; `_minor` is GBP pence. Empty `next_cursor` means end of results. Dashboard dates are `[from,to)`, max 366 days, default current UTC month. `limit` default 50, max 100; cursor is opaque. Invalid range returns 400. Responses cannot expose listener IDs to payees.

Polling response state is authoritative; queued resources omit transaction/download fields until available. Amount and identity fields remain typed. Paid status always requires verified transfer evidence, not just HTTP success.

## Endpoint catalogue

### AuthExchange

`POST /v1/auth/exchange`

Authorization: **login**, with object ownership and role checks. Rate limit: **5/minute per login attempt + 20/minute per source IP**. PII classification: **restricted identity**.

Validate one-time login transaction, PKCE and approved redirect. Set HttpOnly Secure SameSite cookie; never return provider tokens. Idempotency belongs to the server-issued login transaction. Login transaction initialization is specified below.

Request schema: `AuthExchangeRequest`. Response schema: `AuthExchangeResponse`, success HTTP 200. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `INVALID_LOGIN`, `STATE_MISMATCH`. Audit events: `AuthExchange.succeeded`, `AuthExchange.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "code": "synthetic_code",
  "state": "synthetic_state",
  "nonce": "synthetic_nonce",
  "code_verifier": "synthetic_pkce_verifier",
  "redirect_uri": "https://app.example.invalid/callback"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "authenticated": true,
  "subject_id": "usr_example",
  "expires_at": "2026-09-22T12:00:00Z"
}
```

### Entitlement

`GET /v1/me/entitlement`

Authorization: **user**, with object ownership and role checks. Rate limit: **60/minute**. PII classification: **restricted identity and billing**.

Read authoritative access interval; access is not proof of cleared funding.

Request schema: `no body; path/query/header parameters only`. Response schema: `EntitlementResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `ENTITLEMENT_UNKNOWN`. Audit events: `Entitlement.succeeded`, `Entitlement.failed`.

Request example: `GET /v1/me/entitlement` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "active": true,
  "paid_through": "2026-09-22T12:00:00Z",
  "subscription_id": "sub_example",
  "policy_version": "1"
}
```

### CreateSession

`POST /v1/playback-sessions`

Authorization: **user**, with object ownership and role checks. Rate limit: **10/minute**. PII classification: **restricted playback**.

Acquire account-wide exclusive lease; takeover closes old generation. Response deliberately contains no S3 credentials.

Request schema: `CreateSessionRequest`. Response schema: `CreateSessionResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `ENTITLEMENT_REQUIRED`, `RIGHTS_UNAVAILABLE`, `SESSION_CONFLICT`. Audit events: `CreateSession.succeeded`, `CreateSession.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "work_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "rendition_id": "rnd_example",
  "takeover": false
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "session_id": "ses_example",
  "lease_generation": "1",
  "expires_at": "2026-09-22T12:00:00Z",
  "rights_version": "1"
}
```

### IssueGrant

`POST /v1/playback-sessions/{session_id}/grants`

Authorization: **user**, with object ownership and role checks. Rate limit: **120/minute per session**. PII classification: **restricted playback and bearer capability**.

Own active session only; validate chunk boundaries, pacing and rights. URL contains signed grant as defined by wire spec. Log grant ID, never URL.

Request schema: `IssueGrantRequest`. Response schema: `IssueGrantResponse`, success HTTP 200. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `SESSION_EXPIRED`, `RANGE_INVALID`, `PACE_EXCEEDED`, `OPERATOR_UNAVAILABLE`. Audit events: `IssueGrant.succeeded`, `IssueGrant.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "byte_start": "0",
  "byte_end_exclusive": "4096"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "grant_id": "grt_example",
  "operator_id": "op_example",
  "url": "https://delivery.example.invalid/range?grant=synthetic",
  "expires_at": "2026-09-22T12:00:00Z"
}
```

### CloseSession

`POST /v1/playback-sessions/{session_id}/close`

Authorization: **user**, with object ownership and role checks. Rate limit: **10/minute**. PII classification: **restricted playback**.

Allowed reasons stopped, completed, takeover. Server also closes expired sessions. Closing does not itself approve evidence.

Request schema: `CloseSessionRequest`. Response schema: `CloseSessionResponse`, success HTTP 200. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `SESSION_EXPIRED`. Audit events: `CloseSession.succeeded`, `CloseSession.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "reason": "stopped"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "session_id": "ses_example",
  "state": "closed"
}
```

### RegisterOperator

`POST /v1/operators`

Authorization: **operatorApplicant**, with object ownership and role checks. Rate limit: **2/day**. PII classification: **restricted operator identity**.

Endpoint verified against SSRF restrictions; registration does not admit or grant traffic.

Request schema: `RegisterOperatorRequest`. Response schema: `RegisterOperatorResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `ACCOUNT_UNVERIFIED`, `ENDPOINT_REJECTED`. Audit events: `RegisterOperator.succeeded`, `RegisterOperator.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "endpoint": "https://node.example.invalid",
  "region": "eu-west-2",
  "receipt_public_key": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "payout_account_id": "acct_example"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "operator_id": "op_example",
  "state": "pending"
}
```

### OperatorHealth

`POST /v1/operators/{operator_id}/health`

Authorization: **operator**, with object ownership and role checks. Rate limit: **4/minute**. PII classification: **internal operational**.

Only authenticated node subject; server synthetic probes override self-reported readiness.

Request schema: `OperatorHealthRequest`. Response schema: `OperatorHealthResponse`, success HTTP 200. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `OPERATOR_SUSPENDED`, `PROBE_MISMATCH`. Audit events: `OperatorHealth.succeeded`, `OperatorHealth.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "probe_id": "probe_example",
  "manifest_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "capacity_sessions": "100",
  "status": "ready"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "operator_id": "op_example",
  "routing_state": "probation",
  "next_probe_after_seconds": "30"
}
```

### SubmitReceipt

`POST /v1/delivery-receipts`

Authorization: **operator**, with object ownership and role checks. Rate limit: **600/minute per node; maximum body 32 KiB**. PII classification: **restricted playback, no IP required**.

Durable persistence before 202. Accepted is transport status, not eligible or payable. Replay with identical tuple returns original evidence hash.

Request schema: `SubmitReceiptRequest`. Response schema: `SubmitReceiptResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `SIGNATURE_INVALID`, `GRANT_UNKNOWN`, `RECEIPT_CONFLICT`, `EVIDENCE_UNAVAILABLE`. Audit events: `SubmitReceipt.succeeded`, `SubmitReceipt.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "receipt_id": "rcpt_example",
  "operator_id": "op_example",
  "key_version": "1",
  "session_id": "ses_example",
  "grant_id": "grt_example",
  "request_id": "req_example",
  "lease_generation": "1",
  "work_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "rights_version": "1",
  "rendition_id": "rnd_example",
  "chunk_index": "0",
  "byte_start": "0",
  "byte_end_exclusive": "4096",
  "bytes_written": "4096",
  "chunk_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "request_started_ms": "1790078400000",
  "response_ended_ms": "1790078401000",
  "http_status": 206,
  "nonce_digest": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "key_id": "key_example",
  "signature": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "receipt_id": "rcpt_example",
  "ingestion_state": "accepted",
  "evidence_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

### FraudDecision

`POST /v1/internal/fraud-decisions`

Authorization: **fraudService**, with object ownership and role checks. Rate limit: **120/minute**. PII classification: **restricted fraud**.

Only scoped decision engine; approve/held/rejected enum; human release needs separate reviewed revision.

Request schema: `FraudDecisionRequest`. Response schema: `FraudDecisionResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `REVISION_CONFLICT`, `POLICY_UNKNOWN`. Audit events: `FraudDecision.succeeded`, `FraudDecision.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "session_id": "ses_example",
  "revision": "1",
  "state": "held",
  "policy_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "evidence_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "rule_codes": [
    "RATE_ANOMALY"
  ],
  "review_case_id": "case_example"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "decision_id": "dec_example",
  "revision": "1",
  "state": "held"
}
```

### CreateBatch

`POST /v1/internal/batches`

Authorization: **attestationService**, with object ownership and role checks. Rate limit: **10/minute**. PII classification: **internal pseudonymous evidence**.

Only closed approved decisions; immutable membership and root. Chunk at contract bounds.

Request schema: `CreateBatchRequest`. Response schema: `CreateBatchResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `DECISION_HELD`, `WINDOW_NOT_CLOSED`, `DUPLICATE_MEMBERSHIP`. Audit events: `CreateBatch.succeeded`, `CreateBatch.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "decision_ids": [
    "dec_example"
  ],
  "policy_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "window_start": "2026-09-22T12:00:00Z",
  "window_end": "2026-09-22T12:01:00Z"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "batch_id": "bat_example",
  "state": "queued",
  "status_path": "/v1/batches/bat_example"
}
```

### BatchStatus

`GET /v1/batches/{batch_id}`

Authorization: **auditReader**, with object ownership and role checks. Rate limit: **60/minute**. PII classification: **internal aggregate**.

Scoped auditor/service only. States queued, submitted, committed, held, revoked, failed. Transaction fields omitted until present.

Request schema: `no body; path/query/header parameters only`. Response schema: `BatchStatusResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `BATCH_UNKNOWN`. Audit events: `BatchStatus.succeeded`, `BatchStatus.failed`.

Request example: `GET /v1/batches/example_id` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "batch_id": "bat_example",
  "state": "committed",
  "root": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "count": "1",
  "chain_id": "1",
  "transaction_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "ledger_version": "123",
  "stale": false
}
```

### ArtistDashboard

`GET /v1/artists/{artist_id}/dashboard`

Authorization: **artist**, with object ownership and role checks. Rate limit: **60/minute**. PII classification: **restricted recipient financial**.

Own artist rights scope; totals clearly state currency, period and overlap: paid is subset of settled, not additive. Query from/to/cursor/limit as below.

Request schema: `no body; path/query/header parameters only`. Response schema: `ArtistDashboardResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `ARTIST_UNKNOWN`. Audit events: `ArtistDashboard.succeeded`, `ArtistDashboard.failed`.

Request example: `GET /v1/artists/example_id/dashboard` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "artist_id": "artist_example",
  "as_of": "2026-09-22T12:00:00Z",
  "accrued_micro": "100",
  "held_micro": "20",
  "settled_micro": "80",
  "paid_micro": "50",
  "stale": false,
  "next_cursor": ""
}
```

### OperatorDashboard

`GET /v1/operators/{operator_id}/dashboard`

Authorization: **operatorUser**, with object ownership and role checks. Rate limit: **60/minute**. PII classification: **restricted operator financial**.

Own operator role, no listener history or payment identities; same query contract as artist dashboard.

Request schema: `no body; path/query/header parameters only`. Response schema: `OperatorDashboardResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `OPERATOR_UNKNOWN`. Audit events: `OperatorDashboard.succeeded`, `OperatorDashboard.failed`.

Request example: `GET /v1/operators/example_id/dashboard` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "operator_id": "op_example",
  "as_of": "2026-09-22T12:00:00Z",
  "approved_duration_ms": "60000",
  "accrued_micro": "10",
  "held_micro": "2",
  "settled_micro": "8",
  "paid_micro": "5",
  "stale": false,
  "next_cursor": ""
}
```

### ReconciliationInput

`POST /v1/internal/treasury/reconciliation`

Authorization: **financeService**, with object ownership and role checks. Rate limit: **30/minute**. PII classification: **restricted financial provider references**.

Receipt input is untrusted until independently matched to provider/bank/chain. Example address is synthetic, never accepted in Mainnet. Retain FX decimal as exact rational, not float.

Request schema: `ReconciliationInputRequest`. Response schema: `ReconciliationInputResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `LOT_CONFLICT`, `ASSET_MISMATCH`, `AMOUNT_MISMATCH`. Audit events: `ReconciliationInput.succeeded`, `ReconciliationInput.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "lot_id": "lot_example",
  "provider_instruction_id": "provider_example",
  "statement_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "gbp_debit_minor": "1000",
  "fee_gbp_minor": "10",
  "fx_usdc_per_gbp": "1.250000",
  "received_usdc_micro": "12375000",
  "chain_id": "1",
  "asset_metadata": "0x1111111111111111111111111111111111111111111111111111111111111111",
  "transaction_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "ledger_version": "123"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "reconciliation_id": "rec_example",
  "state": "pending_review"
}
```

### CreateSettlement

`POST /v1/internal/settlements`

Authorization: **financePreparer**, with object ownership and role checks. Rate limit: **10/minute**. PII classification: **restricted finance**.

Builder reserves internal budgets under lock, independently recomputed before approver can release. No on-chain submission on this preparer endpoint.

Request schema: `CreateSettlementRequest`. Response schema: `CreateSettlementResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `BUDGET_UNFUNDED`, `INPUT_HELD`, `BUDGET_ALREADY_SPENT`. Audit events: `CreateSettlement.succeeded`, `CreateSettlement.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "budget_ids": [
    "budget_example"
  ],
  "batch_ids": [
    "bat_example"
  ],
  "allocation_policy_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "settlement_id": "set_example",
  "state": "pending_review",
  "manifest_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "total_micro": "100"
}
```

### ApproveSettlement

`POST /v1/internal/settlements/{settlement_id}/approval`

Authorization: **financeApprover**, with object ownership and role checks. Rate limit: **10/minute**. PII classification: **restricted finance**.

Approver must differ from preparer and attest inputs/amounts. Atomically queue exact approved manifest. On-chain create reserves funds.

Request schema: `ApproveSettlementRequest`. Response schema: `ApproveSettlementResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `SELF_APPROVAL`, `ROOT_MISMATCH`, `LIMIT_EXCEEDED`. Audit events: `ApproveSettlement.succeeded`, `ApproveSettlement.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "manifest_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "recomputation_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "review_id": "rev_example"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "settlement_id": "set_example",
  "state": "queued"
}
```

### SettlementStatus

`GET /v1/settlements/{settlement_id}`

Authorization: **recipientOrFinance**, with object ownership and role checks. Rate limit: **60/minute**. PII classification: **restricted financial**.

Recipients see only their permitted lines and scoped totals; finance sees full totals. States pending_review, queued, submitted, settled, partially_paid, paid, held, failed, closed. Never expose other beneficiaries.

Request schema: `no body; path/query/header parameters only`. Response schema: `SettlementStatusResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `SETTLEMENT_UNKNOWN`. Audit events: `SettlementStatus.succeeded`, `SettlementStatus.failed`.

Request example: `GET /v1/settlements/example_id` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "settlement_id": "set_example",
  "state": "partially_paid",
  "asset": "USDC",
  "total_micro": "100",
  "paid_micro": "50",
  "held_micro": "10",
  "remaining_micro": "50",
  "chain_id": "1",
  "transaction_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "ledger_version": "123",
  "stale": false
}
```

### CreateDispute

`POST /v1/disputes`

Authorization: **participant**, with object ownership and role checks. Rate limit: **5/day**. PII classification: **restricted case evidence**.

Own affected allocation/session/recipient scope only. Evidence uploaded through restricted channel, no arbitrary URL fetch.

Request schema: `CreateDisputeRequest`. Response schema: `CreateDisputeResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `TARGET_FORBIDDEN`, `WINDOW_EXPIRED`. Audit events: `CreateDispute.succeeded`, `CreateDispute.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "target_type": "payout",
  "target_id": "pay_example",
  "reason_code": "AMOUNT_DISAGREEMENT",
  "evidence_reference": "evref_example"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "dispute_id": "case_example",
  "state": "open"
}
```

### DisputeStatus

`GET /v1/disputes/{dispute_id}`

Authorization: **caseParticipant**, with object ownership and role checks. Rate limit: **30/minute**. PII classification: **restricted case evidence**.

Redact internal fraud methods and other people; authorised reviewer gets restricted case view.

Request schema: `no body; path/query/header parameters only`. Response schema: `DisputeStatusResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `CASE_UNKNOWN`. Audit events: `DisputeStatus.succeeded`, `DisputeStatus.failed`.

Request example: `GET /v1/disputes/example_id` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "dispute_id": "case_example",
  "state": "investigating",
  "revision": "2",
  "next_action": "review"
}
```

### ResolveDispute

`POST /v1/disputes/{dispute_id}/resolutions`

Authorization: **reviewer**, with object ownership and role checks. Rate limit: **20/minute**. PII classification: **restricted case evidence**.

Independent reviewer only; resolution links finance-approved correction. Never changes paid history. Outcomes upheld/rejected. Response state is the upheld or rejected outcome, matching domain state.

Request schema: `ResolveDisputeRequest`. Response schema: `ResolveDisputeResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `REVISION_CONFLICT`, `SELF_REVIEW`, `ADJUSTMENT_UNAPPROVED`. Audit events: `ResolveDispute.succeeded`, `ResolveDispute.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "expected_revision": "2",
  "outcome": "upheld",
  "reason_code": "EVIDENCE_CORRECTED",
  "review_commitment": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "adjustment_ids": [
    "adj_example"
  ]
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "dispute_id": "case_example",
  "state": "upheld",
  "revision": "3"
}
```

### CreateAuditExport

`POST /v1/audit-exports`

Authorization: **auditor**, with object ownership and role checks. Rate limit: **5/hour**. PII classification: **restricted audit**.

Check explicit case scope; create redacted encrypted bundle and immutable manifest.

Request schema: `CreateAuditExportRequest`. Response schema: `CreateAuditExportResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `SCOPE_FORBIDDEN`, `PURPOSE_REQUIRED`. Audit events: `CreateAuditExport.succeeded`, `CreateAuditExport.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "case_id": "case_example",
  "scope_type": "settlement",
  "scope_id": "set_example",
  "purpose": "dispute_review"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "export_id": "exp_example",
  "state": "queued"
}
```

### AuditExportStatus

`GET /v1/audit-exports/{export_id}`

Authorization: **auditor**, with object ownership and role checks. Rate limit: **30/minute**. PII classification: **restricted audit and short-lived capability**.

Only requesting auditor or explicit case delegate. Link expires in 15 minutes; never return underlying bucket credentials. Queue states omit download fields.

Request schema: `no body; path/query/header parameters only`. Response schema: `AuditExportStatusResponse`, success HTTP 200. Idempotency: read-only; no key. Errors: common envelope plus `EXPORT_EXPIRED`, `SCOPE_FORBIDDEN`. Audit events: `AuditExportStatus.succeeded`, `AuditExportStatus.failed`.

Request example: `GET /v1/audit-exports/example_id` with authenticated headers.

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "export_id": "exp_example",
  "state": "ready",
  "manifest_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "download_url": "https://audit.example.invalid/exp_example",
  "expires_at": "2026-09-22T12:00:00Z"
}
```

### AccountChallenge

`POST /v1/payout-accounts/challenges`

Authorization: **payee**, with object ownership and role checks. Rate limit: **5/hour**. PII classification: **restricted account linkage**.

Challenge includes subject, chain, full address, CSPRNG nonce and five-minute expiry. Does not fund or activate the account.

Request schema: `AccountChallengeRequest`. Response schema: `AccountChallengeResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `CHAIN_MISMATCH`, `STEP_UP_REQUIRED`. Audit events: `AccountChallenge.succeeded`, `AccountChallenge.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "address": "0x1111111111111111111111111111111111111111111111111111111111111111",
  "chain_id": "1"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "challenge_id": "chl_example",
  "message": "porto:london:account:v1:synthetic",
  "expires_at": "2026-09-22T12:00:00Z"
}
```

### AccountVerify

`POST /v1/payout-accounts`

Authorization: **payee**, with object ownership and role checks. Rate limit: **5/hour**. PII classification: **restricted account linkage**.

Verify account authentication scheme with pinned Aptos SDK, possession and reviewed recovery mode. No assumption address equals hash of supplied key after rotation. Activate after independent review, cooldown and test transfer.

Request schema: `AccountVerifyRequest`. Response schema: `AccountVerifyResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `SIGNATURE_INVALID`, `CHALLENGE_EXPIRED`, `STEP_UP_REQUIRED`. Audit events: `AccountVerify.succeeded`, `AccountVerify.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "challenge_id": "chl_example",
  "address": "0x1111111111111111111111111111111111111111111111111111111111111111",
  "public_key": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "signature": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "account_id": "acct_example",
  "state": "pending_review",
  "effective_after": "2026-09-22T12:00:00Z"
}
```

### VerifiedPaymentEvent

`POST /v1/internal/payment-events`

Authorization: **paymentAdapter**, with object ownership and role checks. Rate limit: **120/minute**. PII classification: **restricted billing**.

Adapter verifies provider signature before this boundary. States authorised, cleared, failed, refunded, chargeback. Reordered events append history and recompute projection; cleared never overwrites a later reversal.

Request schema: `VerifiedPaymentEventRequest`. Response schema: `VerifiedPaymentEventResponse`, success HTTP 202. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `EVENT_CONFLICT`, `UNVERIFIED_PROVIDER_EVENT`. Audit events: `VerifiedPaymentEvent.succeeded`, `VerifiedPaymentEvent.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "provider": "selected_provider",
  "provider_event_id": "provider_event_example",
  "payment_id": "payment_example",
  "state": "cleared",
  "gross_gbp_minor": "1000",
  "effective_at": "2026-09-22T12:00:00Z",
  "signed_payload_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "payment_id": "payment_example",
  "recorded": true
}
```

### ConsumeGrant

`POST /v1/internal/grants/{grant_id}/consume`

Authorization: **operator**, with object ownership and role checks. Rate limit: **120/minute per active session and bounded node budget**. PII classification: **restricted playback**.

Atomic compare-and-set nonce. Identical retry returns original authorization to same in-flight request, not permission for a new delivery. Node persists request ID and refuses duplicate response execution.

Request schema: `ConsumeGrantRequest`. Response schema: `ConsumeGrantResponse`, success HTTP 200. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `GRANT_REPLAY`, `SESSION_EXPIRED`, `WRONG_OPERATOR`. Audit events: `ConsumeGrant.succeeded`, `ConsumeGrant.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "signed_grant": "synthetic_signed_grant",
  "request_id": "req_example"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "request_id": "req_example",
  "accepted": true,
  "lease_generation": "1"
}
```

### LoginStart

`POST /v1/auth/login-transactions`

Authorization: **login**, with object ownership and role checks. Rate limit: **5/minute per device + 20/minute per source IP**. PII classification: **restricted identity**.

Server generates state/nonce, stores five-minute one-use transaction; binds cookie and PKCE S256 challenge. No open redirect or caller-selected issuer.

Request schema: `LoginStartRequest`. Response schema: `LoginStartResponse`, success HTTP 201. Idempotency: required POST key and permanent business uniqueness where applicable. Errors: common envelope plus `REDIRECT_REJECTED`. Audit events: `LoginStart.succeeded`, `LoginStart.failed`.

Request example:

```json
{
  "schema_version": "london.v1",
  "redirect_uri": "https://app.example.invalid/callback",
  "code_challenge": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}
```

Response example:

```json
{
  "schema_version": "london.v1",
  "correlation_id": "corr_example",
  "login_transaction_id": "login_example",
  "authorization_url": "https://identity.example.invalid/authorize",
  "state": "synthetic_state",
  "nonce": "synthetic_nonce",
  "expires_at": "2026-09-22T12:00:00Z"
}
```

[London contents](index.mdx) · [Data model](11-data-model-and-event-schemas.md) · [Wire contracts](21-wire-and-commitment-contracts.md)
