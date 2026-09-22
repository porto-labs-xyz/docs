---
id: 12-security-privacy-and-key-management
title: "Security, privacy and key management"
sidebar_position: 13
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Minimum security boundary

All internet endpoints require TLS. Browser actions require account ownership and CSRF protection; node API tokens bind one node and cannot authorise finance. The gateway verifies entitlement on grant issuance and consumption. Treat node endpoints, receipts, inventory and timings as untrusted. Validate registered endpoints against SSRF: HTTPS only, approved public hostname/IP, no redirects, no private/link-local/metadata address resolution, DNS revalidation and explicit destination allowlist. The origin adapter is a named internal route, never an arbitrary operator URL.

Use separate gateway, node, commitment and treasury keys. Generate node Ed25519 keys on participant infrastructure and persist privately with owner-only permissions. Porto stores public keys, validity intervals and revocation records. Gateway grants include key ID and audience; nodes pin the released gateway key set and refresh through an authenticated channel. Rotate with a bounded 60-second overlap, preserve prior keys for receipt verification, and record effective times. A suspended key cannot consume a new grant.

Treasury key resides in the selected approved custody/signing system, never in the browser, node image, ordinary API environment or general logs. The signer enforces recipient/asset/function/amount/run caps against the approved payload. Commitment key cannot spend treasury funds. Administrative two-person control and recovery evidence are production gates. Do not implement a bespoke wallet or recovery service.

## Recipient ownership and changes

Artists/operators supply an Aptos account supported by the pilot. Require a signed ownership challenge with random nonce, account ID, intended chain, purpose and five-minute expiry; verify using the selected wallet/account signature standard and retain evidence privately. If an approved custodian cannot sign that challenge, provider-verified account ownership is required instead. A bank withdrawal or redemption promise is not part of this flow. Recipient address changes require step-up and independent finance confirmation, invalidate unsigned runs and never retarget an already signed transaction.

## Data classes

| Class | Examples | Placement/access |
|---|---|---|
| Public | Catalogue display, chain digest, commitment window/count, transfer address/amount | Public site/chain; disclose wallet observability to recipients |
| Restricted operational | Node keys/public inventory, pseudonymous usage, grants, receipts, routing | Porto operational roles; nodes see only own scoped data |
| Confidential financial | Provider IDs, deductions, funding, private rights splits, full audit inputs | Finance and authorised auditor |
| Personal | Account identity, support notes, IP/security data | Minimum necessary staff; never on-chain |
| Secret | Tokens, private keys, signed transaction material before broadcast | Designated signer/secret store; no exports |

Opaque identifiers and hashing are not automatic anonymisation. Do not expose listener IDs or deterministic hashes of email/account IDs. Statement public IDs and salts are newly random each batch. Nodes necessarily observe client network addresses when serving directly; operator agreements, privacy notice and technical logging controls must account for that. Default node access logs omit full IP, grant token and query string.

## Retention and availability

The release profile must supply approved retention periods for raw receipts, accounting records, provider records, support notes and security logs. No production defaults or legal retention claims are invented. Staging fixtures use a documented seven-day cleanup policy. Evidence required to verify a promised statement must remain retrievable for the promised verification period; do not advertise permanent verification while deleting its only inputs.

Encrypt evidence objects at rest, enable versioning and protect frozen objects against overwrite/delete for the approved retention period using the chosen storage mechanism. Back up decryption keys separately with controlled recovery. Rights to deletion, legal holds and storage retention are reviewed before Mainnet; on-chain data is deliberately minimal because it cannot be treated as erasable.

## Security review acceptance

Review authentication/ownership, grant replay, node endpoint SSRF, peer content substitution, receipt forgery/collusion limits, payout double execution, signer compromise, immutable contract publication and privacy leakage. Test revoked keys and failed recovery, not just happy-path signatures. Secrets scan, dependency review and signed release-image provenance are required for the implementation release. This documentation does not claim those reviews have passed.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
