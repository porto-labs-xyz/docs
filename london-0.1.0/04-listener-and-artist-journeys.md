---
id: 04-listener-and-artist-journeys
title: "Listener, artist and operator journeys"
sidebar_position: 5
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Listener

The listener sees a curated catalogue, plan price and billing terms, signs in, and uses hosted checkout. The returning browser shows “Confirming payment” until a verified provider event creates entitlement. A failed or pending payment must not appear paid. The account page exposes access end date and hosted subscription-management link. There is no wallet setup, USDC balance or token purchase.

The player starts idle with a selected work. Explicit Play opens a session and fetches the manifest, then chunk grants. Support play/pause, elapsed time, volume, work selection and ordinary seeking. Seeking earns only actually delivered unique chunks and remains rate-limited. Pause stops fetching; the last ten seconds of prebuffer may already have been delivered. Do not display “listened” as a verified fact. Show a short reconnecting state during fallback and a retry action after final failure. Audio must not restart when reading artist or payout information.

Long-form sets use the same segmented player. Show set title and duration; embedded cue metadata is optional display data and does not create separately paid works. Only sets with all necessary rights cleared enter the catalogue.

## Artist / rights recipient

Manual onboarding records licences, work IDs, approved recipient splits, payout address and the signed address-change procedure. The artist receives an authenticated page with date range, work, accepted served duration, provisional allocation, committed allocation, unpaid amount and confirmed payments. Display the asset and units explicitly. The page explains Porto's role in evidence acceptance and distinguishes operator income if the artist also hosts a node.

Each closed statement offers its private canonical JSON, a readable table, the public statement index, commitment transaction link and verifier instructions. It contains no listener IDs or other artists' private accounting. A full accounting audit requires separately authorised access to pseudonymous evidence and funding inputs. The individual statement verifies inclusion and arithmetic for its disclosed lines, not global completeness.

Address changes require authenticated support plus a fresh ownership challenge and finance confirmation. Existing signed transactions remain bound to their original recipient. An unsigned approved run must be cancelled and rebuilt if the address changes; no silent mutation is allowed.

## Operator

Porto sends an invitation and approved participation terms. The participant provisions its host, generates a local Ed25519 key, provides an HTTPS endpoint and payout address, then runs the pinned node image. An administrator verifies control and connectivity, records approval and provides a scoped node API token through a private channel. Tokens are not embedded in images.

The node downloads its assigned manifest, verifies chunks, completes a health challenge, performs a peer cache fill and serves pilot traffic. The operator view shows online/stale/suspended, cache readiness, delivered and accepted duration, rejected/missing receipt counts, earned rewards, unpaid amounts and payment links. A one-page cost form records hosting, egress and support time. It is enough to collect this manually; do not build a billing marketplace.

Uninstall stops service, revokes credentials and securely deletes cached content after the agreed retention period. Previously earned obligations remain tracked. Onboarding, suspension and exit must be possible without protocol governance.

## Human-facing money labels

| Label | Exact meaning |
|---|---|
| Recorded | Receipt retained; eligibility may be unresolved |
| Eligible | Session passed the duration and evidence rules |
| Provisional | Estimate based on unclosed accounting inputs |
| Allocated | Frozen funded accounting assigns this amount |
| Committed | The allocation artifact hash is confirmed on Aptos |
| Payment pending | Approved intent is queued, signed or submitted |
| Paid | Successful asset/recipient/amount verified from confirmed chain transaction |
| Held / delayed | An explicit reason blocks the next step |

Never use “settled” without saying whether it means accounting finalised or transfer confirmed. A commitment transaction itself transfers no royalties.

## Accessibility and presentation

Use familiar music-first controls and readable statements, not infrastructure terminology in the listening flow. Keyboard operation, visible focus, labelled controls, contrast and reduced-motion support are required. Technical proof details belong behind “Verify statement”. Company tagline remains `Made To Be Listened To.` Demo content and testnet payments must carry visible demo labels.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
