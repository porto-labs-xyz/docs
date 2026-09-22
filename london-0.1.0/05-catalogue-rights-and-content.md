---
id: 05-catalogue-rights-and-content
title: "Catalogue, rights and content"
sidebar_position: 6
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Registration and asset pipeline

Catalogue lifecycle: `draft -> quarantined -> rights_review -> approved -> active -> withdrawn`. Malware checks, media decode validation, duplicate detection and rights review precede publication. Masters and derived renditions use distinct immutable object keys and SHA-256 digests. Never treat an S3 ETag as a content digest.

`work_id = SHA256("porto:work:v1:" || JCS({master_sha256, core_metadata}))`. Core metadata consists exactly of `recording_title`, `primary_artist_credit`, `duration_ms` and `recording_version`, normalized UTF-8 NFC, with duration as a decimal string. Rights splits, mutable artwork and account addresses are excluded. This identity rule intentionally replaces the ambiguous source formulation. An edited master or identity metadata creates a new work; corrections use an explicit `supersedes_work_id` relationship, not overwriting. Licences stay off-chain.

Each immutable rendition manifest contains codec, sample rate, channels, total duration and ordered chunks `{index, object_version, byte_start, byte_end_exclusive, media_start_ms, media_end_ms, sha256}`. Encoding pipeline validates non-overlapping media intervals and complete hashes; no average-bitrate duration inference is permitted for variable bitrate audio. Each decoded chunk is independently verifiable. Range bytes are local to the rendition object. Partial chunks earn no duration until the union of observed ranges covers the full chunk.

## Rights versions

A rights version contains work, effective UTC interval, territories, availability state, recipient IDs, positive basis points summing to 10000, licence evidence references and reviewer approval IDs. No duplicate recipient. Maximum 32 recipients per version is a proposed transaction/test bound, adjustable only after review. Account addresses are resolved and snapshotted at settlement preparation. Versions are immutable and never retroactively overwrite accrued rights. A session locks the rights version at issuance; takedown overrides further authorisation immediately.

Concurrent sessions around a version boundary keep their locked version until their grants expire, at most 60 seconds, then reauthorise against the current version. Accounting splits evidence by the version effective for each renewed grant. A withdrawal denies renewal, purges cache authorisation and queues deletion verification. Retain only evidence legally required under the retention schedule; do not keep publicly accessible audio after withdrawal.

## Long-form works and DJ sets

A set is one work only if clearance covers every constituent recording/composition and the complete set's distribution. Otherwise it cannot enter the payable catalogue. Cue sheets are rights evidence, not automatically new payable plays. A two-hour set crosses the same eligibility threshold as another long recording, but approved unique served duration continues to weight allocation. Do not award a stream per chunk, per chapter, per repeated seek or per provider retry. Cue-sheet based internal allocation is a separate rights-version decision; unavailable clearance blocks release.

`LEGAL/COMPLIANCE REVIEW REQUIRED`: recording, publishing, performer and territorial permissions, takedown process, DJ set permissions and payee contracts. These specifications do not establish any music licence. `CURRENT SOURCE`: PIP-4 §7 defines content-addressed work registration and split basis points; PIP-5 §3 distinguishes internal rights allocation from the network split.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
