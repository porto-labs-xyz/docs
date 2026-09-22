---
id: 05-catalogue-rights-and-content
title: "Catalogue, rights and content"
sidebar_position: 6
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Manual catalogue contract

An administrator imports a versioned catalogue document with `work_id`, title, display artist, duration in integer milliseconds, licence reference, allowed territories, availability interval, `rights_version`, recipients with integer basis points summing to 10000, `rendition_id`, and immutable manifest hash. A second human confirms rights and payout recipients before activation. No upload portal, automated rights marketplace or on-chain work registry is required.

Use UUIDv4 opaque work IDs independent of title or file path. A different master is a new rendition with its own manifest, even if the work ID is retained. Never infer ownership from an uploader's claim. Rights snapshots have increasing integer versions and future effective timestamps. Sessions snapshot rights at issuance and expire at the next rights/availability boundary, so usage never crosses a rights change under an old snapshot.

For the pilot, a long-form DJ set is one work with explicitly cleared rights and agreed beneficiary splits. If its rights cannot be represented by that agreement, exclude it. Do not invent cue-by-cue allocation or assume a mix grants licences to every embedded recording.

## Streaming format

Package one AAC-LC stereo rendition in fragmented MP4 with an init segment and approximately two-second independently decodable media segments. Target 128 kbit/s; actual byte lengths and exact media intervals come from the packaging output, never bitrate division. The final segment may be shorter. Support the current agreed desktop/mobile browser matrix in G2; format changes require new renditions, not substitution under existing IDs.

Manifest fields are normative: schema version; work/rendition IDs; codec string; total duration; init object hash and byte length; ordered chunk entries containing `index`, `media_start_ms`, `media_end_ms`, `byte_length`, `sha256`, private storage reference; manifest version. Chunk intervals must be contiguous, non-overlapping, positive and cover the full rendition. Browser responses omit storage references. Treat the init segment as required delivery but zero royalty duration.

Each HTTP media request fetches one complete segment. Partial HTTP range resume, arbitrary multi-range requests and byte-to-duration estimation are out of scope. Return 416 to Range requests. This is deliberate: a chunk earns duration only when its entire declared byte length was written successfully. A partial attempt earns zero and can retry through a new grant. Playback uses Media Source Extensions or an equivalent segment player; the grant URL remains the sole authorised transport.

## Private origin and caches

S3 public access is blocked; TLS and encryption at rest are mandatory. Only the importer writes versioned objects. The coordinator origin adapter reads approved objects and serves scoped requests. Participants never get bucket credentials or unrestricted presigned S3 URLs. A node cache is keyed by rendition and SHA-256 digest, downloaded to a temporary file, verified for size/hash, then atomically renamed. An invalid file is discarded, reported and never served.

The manifest is signed by the gateway key over the [canonical domain](21-wire-and-commitment-contracts.md). Peer recipients independently verify its signature and every content hash. A malicious peer can deny service but cannot replace accepted content without detection by the conforming receiver. Do not call this DRM: an authorised operator can copy bytes. Licence and operator agreements must permit participant caching and serving.

## Availability and withdrawal

Disable work availability centrally to stop new grants immediately. Already consumed grants may finish within 30 seconds. Send cache invalidations on the next heartbeat; nodes must delete withdrawn content within 60 seconds of receiving the command. Offline nodes delete on reconnect before becoming ready. Record acknowledged deletion as an operator assertion, not remote physical erasure proof. Historic lawful usage, statements and obligations remain intact.

## Import acceptance

Reject absent rights, invalid duration, missing chunks, mismatched digest, unsupported codec, invalid recipient totals, retroactive rights effective times, expired territory clearance and duplicate IDs with different payloads. Reimporting identical bytes is idempotent. Catalogue activation is a distinct audited operation from upload. Preserve source masters privately; only the licensed streaming rendition is distributed.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
