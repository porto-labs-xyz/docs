---
id: 12-security-privacy-and-key-management
title: "Security, privacy and key management"
sidebar_position: 13
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Key separation and threats

| Key/credential | Custody and scope | Rotation/incident rule |
|---|---|---|
| Gateway grant signer | Managed isolated signer, grant domain only | Publish new key ID; retain old verification through grant expiry; revoke immediately for compromise |
| Operator receipt signer | Operator protected key, registered validity | Reject evidence outside validity; quarantine compromise interval |
| Attestor | Isolated signing service, batch entry allowlist | Pause commits, rotate with admin, reconcile in-flight batches |
| Executor | Transfer committed leaves only | Revoke immediately; cannot change roots or withdraw |
| Finance approval | Separate approval custody | Dual approval for funding and manifests |
| Admin quorum | Independent hardware-backed members | Recovery drill, timelock; no shared secrets |
| APT sponsor | Bounded operating wallet | Function/amount/gas allowlist and spend cap |
| S3 services | Short-lived workload roles, exact bucket/prefix actions | Revoke role sessions; no long-lived shared access keys |

Threat tests include grant leakage/replay, stolen session, malicious operator, forged receipt, forged webhook, rights substitution, wrong asset, forged Merkle proof, compromised indexer, admin compromise, supply-chain compromise, insider export and identity inference from payment timing. Residual risks include Porto collusion and stablecoin issuer/custody controls. Do not claim contracts remove them.

Secrets reside in managed secret/signing services, never source, images, environment dumps or client bundles. Production deployment identity cannot read treasury signing material; treasury signer cannot deploy. Production keys and accounts never enter staging. Infrastructure uses least privilege and explicit egress; catalogue upload cannot grant public bucket access. Use TLS and mTLS across appropriate boundaries, encryption at rest, audited privileged access and short-lived break-glass sessions.

## Data minimisation

On-chain: opaque work/operator/batch IDs, salted roots, policy digests, asset identity, payout addresses, amounts and state. Off-chain restricted: listener mappings, exact timestamps/ranges, IP/device signals, payment evidence and licences. Hashing PII alone does not anonymise it. Salt leaf commitments with random per-leaf 256-bit salts, retained only in encrypted audit manifests. No listener ID, session ID, provider reference or raw correlation ID goes on-chain.

Recipients may be identifiable from address/amount patterns. Document this in consent/notices after specialist review. Do not publish granular listener histories or small-cohort analytics. Default dashboards expose aggregates scoped to recipient only. Audit exports require purpose, case reference, least-privilege redaction, encryption, expiry and download auditing.

`LEGAL/COMPLIANCE REVIEW REQUIRED`: DPIA, lawful basis, retention/deletion/legal holds, territorial transfers, rights of access and provider data processing. Retention values in streaming spec are draft defaults, not legal conclusions. Deletion removes identity mappings and eligible off-chain data on schedule, while explaining immutable on-chain limits. Legal hold cannot silently become indefinite universal retention.

## Backups and recovery

Encrypted database point-in-time recovery plus daily immutable snapshots; evidence objects independently versioned with integrity manifests. Proposed RPO 15 minutes for general metadata, zero acknowledged financial/evidence writes lost through durable replication, RTO four hours. These are acceptance targets, not achieved measurements. Restore into isolated environment, validate ledger balances, chain cursor and source object digests, then replay outbox/inbox idempotently before reopening writes. Quarterly restoration and key-loss drills are proposed requirements.

A database restore never resets on-chain payout uniqueness. Chain is authoritative for paid state. Rebuild paid projection before issuing any new transfer. Never restore an old signer role blindly. See [incidents](13-operations-observability-and-incidents.md).

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
