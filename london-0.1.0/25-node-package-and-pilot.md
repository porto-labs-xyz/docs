---
id: 25-node-package-and-pilot
title: "Node package and participation pilot"
sidebar_position: 26
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Installable node contract

Deliver a versioned container image, example configuration, one-command compose startup, healthcheck, upgrade/rollback instructions and uninstall procedure. Target Linux amd64 and arm64 hosts with outbound HTTPS and a public inbound HTTPS endpoint controlled by the participant. Home-network NAT traversal, browser nodes, mobile nodes and automatic certificate infrastructure are outside scope. A participant may use their own VPS/cloud account; cloud hosting does not make it Porto-owned.

Configuration fields: `node_id`, `coordinator_url`, `public_base_url`, `node_token_file`, `receipt_key_file`, `gateway_keyset_file`, `cache_dir`, `spool_dir`, `cache_max_bytes`, `max_concurrent_fills` (4), `max_concurrent_playbacks` (20), and pinned `image_digest`. No listener data, treasury key or S3 credential is required. Defaults target a small pilot; onboarding checks measured capacity instead of claiming hardware minimums are proven. Reject startup with world-readable secrets or unwritable durable spool.

Commands: `node keygen`, `node config-check`, `node run`, `node status`, `node export-diagnostics`, `node purge-cache`. Diagnostic exports redact tokens, signatures usable as bearer grants, IPs and private paths. Node status displays credential/key IDs, readiness, verified-cache bytes, pending receipt count and last coordinator contact. Keys never leave the participant host through diagnostics.

## Lifecycle and inventory

States: invited, pending, active, suspended, retired. Pending nodes can fetch signed manifests, fill their cache from origin or active peers, report health and run probes, but receive no paid playback. Admission must permit this bootstrap path before requiring a ready cache. Pending nodes cannot act as peer sources for other participants until approved active. Activation requires approved terms/ownership, endpoint validation, fresh key challenge, healthy durable volumes and at least one verified assigned work. The origin adapter uses reserved node ID `00000000-0000-4000-8000-000000000001` and operator ID `00000000-0000-4000-8000-000000000002`; these are seeded internal records, excluded from independent-participant counts. It follows the same grant/receipt rules with its own keys, but its operator share is retained in Porto treasury. Node heartbeat every 20 seconds reports cache manifest version, ready rendition/chunk ranges, free capacity and spool backlog. Coordinator stores the latest inventory and probes without paying for probe traffic.

Cache eviction is least-recently-used among unpinned chunks, never during an active response. Pin the pilot demonstration work on both participant nodes until its acceptance evidence is collected. Verify hashes on cache admission and on read before serving; corrupt files are quarantined. Rebuild inventory from verified files after restart. Update by stopping admission, finishing active transfers, persisting receipts, switching image digest, checking schema compatibility and resuming health. Do not delete the spool during image rollback.

## Peer authorisation and request transport

A destination requests missing chunks through `POST /v1/nodes/{id}/fills`; Porto chooses an active ready source distinct from the destination or the named origin fallback. Response is a signed grant and manifest hash. Destination fetches `GET /node/v1/content/{rendition_id}/{chunk_index}` using `Authorization: PortoGrant <base64url(JCS(grant))>`. Source verifies destination binding through a request signature over grant ID, request ID, method and path using the destination's registered node key; Porto consumption verifies this proof before accepting a peer request. Browser playback uses the same grant header but no node request signature. CORS allows only the released Porto app origin; credentials are not sent to node endpoints.

Init segment uses chunk index `init`; media uses canonical decimal index. Request includes `X-Request-ID`. No redirect, cookie-based bearer token or raw query-string token. Return immutable bytes with Content-Type, Content-Length and Digest header; cache-control is private/no-store for browser responses. Shared node disk caching occurs behind grant authorisation. Use `X-Peer-Proof` for the base64url canonical proof; its signing domain is `porto:london:peer-request:v1\n`. Both sides record peer transfer ID; the source sends a normal non-payable peer receipt and destination sends its verified fill result. A destination's success claim must match source grant consumption and expected digest, but is still an assertion from those participants.

## Pilot procedure

1. Invite a small cohort, targeting three to five independently operated nodes, including at least one artist and one unrelated third party. The minimum acceptance boundary is those two ownership categories, not a fabricated recruitment result.
2. Record ownership/control, who pays costs, onboarding time, assistance, licence/participation terms and any subsidy. Give operators a clear exit path.
3. Seed an authorised work onto artist node A. Keep B's selected chunks absent. Run a Porto-authorised A-to-B fill, verify source/destination evidence and ensure B serves at least one eligible real paid-listener session from those filled chunks.
4. Run real paid listening through participant nodes with Porto fallback available. Keep free/test/operator self-test sessions separately labelled and outside demand metrics and payable budgets.
5. Close accounting, anchor evidence, pay both rights and serving operators, deliver statements and have at least one external recipient verify their proof package.
6. Collect actual hosting/egress cost, time, earned reward, subsidy and willingness to continue. Observe at least one offered subscription renewal before claiming renewal evidence. Record the observation window before recruitment.

## Pilot report

Report invited/activated/retained operators by ownership type; actual peer-filled bytes; eligible independent delivery share versus fallback; successful playback/rebuffer; missing/rejected receipts; cost per eligible served hour; earned rewards versus subsidy and participant cost; cleared paying listeners, repeat listeners and renewal opportunities/outcomes; artist/operator confirmed payments; verifier outcomes; incidents and support effort.

Do not equate a working peer transfer with viable economics, willingness to sign up with retained participation, or subsidies with organic demand. The pilot may correctly conclude that the infrastructure works but participation economics need revision. That is useful evidence, not a reason to rewrite historical results.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
