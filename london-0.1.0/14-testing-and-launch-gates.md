---
id: 14-testing-and-launch-gates
title: "Testing and launch gates"
sidebar_position: 15
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Verification strategy

Use the [acceptance catalogue](22-acceptance-test-catalogue.md) as traceability IDs. Backend tests must use contract fixtures and controlled clocks; frontend tests verify displayed evidence state; Move tests verify state/asset invariants. Every result records environment, commit/package digest, policy version, input fixture and observed output. No tests in this documentation task establish deployed application behaviour.

Contract unit tests cover each role, transition and abort in the Move specification. Property tests generate random allocations, splits and chunk orderings, proving integer conservation, monotone spent budget, no negative/overflow values and no duplicate payout. Integration tests exercise real chosen framework asset APIs, account creation, sponsor restrictions and frozen/failed transfers. Adversarial tests include malicious operator and fabricated validly signed receipts, showing the trust limit rather than incorrectly expecting the chain to prove delivery truth.

Load tests must include six-hour sessions, long DJ sets, range retries, seeks, partial chunks, VBR renditions, operator failover, midnight crossing, delayed evidence, many recipients and settlement chunk retries. Test 2x the signed pilot capacity for 60 minutes and 4x burst for five minutes; D11 must supply actual concurrency/throughput baseline before the test is executable. Track percentile latency, memory, queue growth, integrity and attribution, not only request success rate.

## Gate order

| Gate | Required proof | Owner |
|---|---|---|
| G0 Architecture ratification | D01-D12 closed for launch scope; compatibility departures accepted | Product, engineering, finance, legal |
| G1 Contract freeze | OpenAPI/schema compatibility, signed-byte golden vectors, independent allocation match | Backend, Move, QA |
| G2 Staging loop | Authorisation through confirmed test-asset payout and reconciliation | QA/operations |
| G3 Security/privacy | Independent contract review, custody threat review, DPIA and abuse tests | Security/privacy lead |
| G4 Commercial/provider | Executed rights/participant terms, provider selected and capability tests, tax/financial-crime review | Legal/finance |
| G5 Recovery/performance | Restore, key compromise, chain/provider outage drills and capacity proof | Operations |
| G6 Mainnet rehearsal | Separately authorised bounded company-funded transfer, pinned asset/package and verified recipient | Finance/security |
| G7 Pilot go/no-go | Signed launch manifest, limits, incident roster and zero unresolved critical/high findings | Accountable launch owner |

Mainnet rehearsal is future work, not authorization to deploy or move money now. A testnet pass is not a Mainnet pass. A successful Mainnet canary is not broad rollout readiness. No zero-risk claim follows from audit.

## Go/no-go checklist

- [ ] All production-blocking decisions closed with named approvers and versioned policy.
- [ ] Rights catalogue and payout accounts approved; no placeholder IDs or test assets.
- [ ] Exact code, dependencies, chain, asset, custody and package identity pinned.
- [ ] Conservation, replay, privacy, payment-state and recovery tests passed with evidence.
- [ ] Funding reconciled, reserves approved, APT budget available, limits active.
- [ ] Incident ownership, support/dispute handling and operator fallback rehearsed.
- [ ] Public copy accurately discloses permissioned delivery and trusted attestation.
- [ ] Pause controls tested; irreversible payment recovery understood and signed off.

Any unchecked item is no-go. A business override cannot silently relabel missing technical/security/legal evidence as passed.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
