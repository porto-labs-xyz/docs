---
id: 10-off-chain-services-and-apis
title: "Off-chain services and APIs"
sidebar_position: 11
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Service boundaries

The backend may start as a modular deployment, but data ownership and signing identities must follow these boundaries: identity/entitlement, catalogue, session gateway, receipt ingest, fraud review, attestation builder, finance ledger, settlement executor, chain indexer and audit export. Shared deployability does not grant shared database credentials or signing authority.

The [endpoint catalogue](20-api-contracts.md) and `openapi.json` are the contract. The API version is `/v1`; every body carries `schema_version: "london.v1"`. Breaking changes create `/v2`. Correlation ID follows the request across outbox events and internal logs, never onto public chain if it links a listener. Use stable opaque IDs and decimal strings for large integers.

## Delivery and retry semantics

All mutating calls require an idempotency key scoped by authenticated principal, method and canonical path. Store key, canonical request hash, business ID and original result in the same database transaction. Same payload returns the original result; changed payload returns 409. Non-financial keys retain seven days; financial/batch/dispute business-ID uniqueness persists for the full record lifetime independently of key cache. Receipt uniqueness persists for the evidence lifetime. The client uses the original key after timeout. Do not create a replacement payment instruction just because HTTP failed.

Use HTTP 202 for durable queued work, with a status resource. GET never triggers settlement. Financial workers claim rows under locks, persist intent before signing, and record signed payload/transaction hash before submission. Index by chain transaction version and event index, resume with overlap and deduplicate. A second RPC inconsistency marks financial status uncertain. Backfills cannot emit duplicate postings.

Browser authentication uses secure same-site HttpOnly cookies, CSRF tokens on writes, strict allowed origins, step-up for payout-account or dispute-resolution actions. Service calls use mTLS plus short-lived workload tokens restricted to endpoint scopes. Operator receipt keys and transport credentials are separate. Hosted provider callbacks verify signature, timestamp and event ID; API ingestion is authenticated internal normalization after verification.

`OPEN DECISION D03`: identity and account-custody providers are not selected. Provider-specific callback adapters are required later; this catalogue intentionally defines the provider-neutral verified input boundary. No credentials, provider commercial terms or private client information belong here.

## Audit and pagination

Every call emits the catalogue's named audit event with actor/service ID, operation, target, request hash, correlation ID, outcome and policy version. Never log tokens, signed query strings, card data, full IPs in general logs or raw evidence in dashboards. List responses use opaque cursor and `limit` 1..100, default 50. GET rate limits apply per principal, with separate tenant budget; 429 includes Retry-After. Authorization checks object ownership on every ID, including status and export endpoints.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
