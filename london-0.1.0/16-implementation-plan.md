---
id: 16-implementation-plan
title: "Implementation plan and agent handoff"
sidebar_position: 17
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Attack this first: W0 and W1 ledger engine

Start with [the deterministic RocksDB ledger](27-deterministic-rocksdb-ledger.md). The immediate deliverable is a working pure command executor and single-owner TransactionDB adapter that atomically persist stream/accounting state, replay identically, recover from crashes and export a portable checkpoint. Use synthetic inputs and mocked external effects. Do not begin by building dashboards, provider orchestration or a chain.

W1 must pass A41-A48 before the first real integration milestone. Frontend fixture work may proceed independently, but it cannot change this dependency. This priority is an approved architectural decision, not a speculative optimisation.

## Agent entry contract

Read status/scope, architecture, the domain chapter for your work, OpenAPI, wire contracts, configuration and acceptance cases before implementation. Treat this directory as the approved London specification. Do not implement removed features because an older draft or PIP contains them. Do not modify canonical PIPs as a side effect. A missing production business value is a release input, not permission to invent commercial terms.

This is a specification delivery. Production application, node and Move implementation start as separate work. Existing prototype/demo UI remains explicitly simulated until wired to the real APIs and tested.

## Work packages and dependency order

| Package | Deliverables | Depends on | Completion evidence |
|---|---|---|---|
| W0 shared contracts | Command/artifact schemas, profile loader, ID/domain constants, ledger fixtures and canonicalisation verifier | None | A01-A04, A37 |
| W1 FIRST: RocksDB ledger engine | Pure transitions, single owner, TransactionDB, journal/state/uniqueness/outbox, checkpoint, replay and recovery | W0 | A20-A23, A37, A41-A48 |
| W2 integrations/catalogue/player | Identity/billing adapters, manual funding import, signed chunk manifest, web player, entitled sessions and grants | W0-W1 | A05-A12, A35 |
| W3 node and peers | Container, credential setup, verified cache, peer fill, consume journal, receipts, health/fallback | W0-W2 | A13-A19, A36 |
| W4 accounting | Daily closure, duration credit, funded allocation, corrections/holds, private statements | W1-W3 | A20-A26 |
| W5 commitments/verifier | One immutable Move module, publisher, retained artifacts, public index and independent CLI verifier | W0,W4 artifact schemas | A27-A30 |
| W6 real payout path | Restricted signer, run approval, durable attempt journal, transfer reconciliation | W1,W4-W5 | A31-A34 |
| W7 release/pilot | Restore drill, browser/load evidence, production profile, Mainnet rehearsal and cohort report | W0-W6 | A35-A40 and G0-G7 |

W5 contract implementation can start against W0 fixtures while W4 is in progress. Work package boundaries do not require separate services, teams or agents. A frontend may use fixtures until W2/W4 APIs exist, but must display demo state and never mix fixture money with production views.

## Required deliverables by discipline

Backend: deterministic ledger core, RocksDB transaction adapter, portable checkpoints and replay, then transactional state machines, provider normalization adapters, grant token bucket and consumption, signed evidence ingestion, ledger and deterministic allocation, public/private exports and job recovery. Frontend: explicit-play music experience, subscription state, artist/operator statements, pending/held/paid labels and verifier downloads. Node: documented install/update/uninstall, participant-held key, hash-verified peer cache, durable receipts, credential rotation and health. Move: exactly the commitment module and deployment/readback scripts. Infrastructure/security: deployment profiles, secret boundaries, backups, replay recovery, review and release record. QA: executable cases and evidence links, not a checklist marked done without runs.

## Implementation review rules

Every pull request identifies the W package and acceptance IDs it advances. Contract/schema changes update examples and fixtures in the same change. New dependencies must serve a required capability; no new operator market, token mechanics, service mesh, social surface or fraud product enters through an implementation convenience. Use the simplest existing project conventions compatible with these requirements. Runtime/library versions are pinned in the implementation lockfiles and release record after compatibility checks.

Keep a traceability table `requirement -> code -> test -> evidence`. Mark partial work honestly. Deployment, Mainnet rehearsal and real funding require the actual G5 authorisations. A build passing is not a launch approval.

## Completion boundary

Deliver a reproducible deployment, a participant-operable node, the verifier, complete runbooks and the pilot report. No automatic app-chain migration, broad decentralisation, custody platform or independent-attestor network is needed to call London implemented. No real participant-owned node or real payout means the core experiment is still incomplete.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
