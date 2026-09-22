---
id: 00-status-and-scope
title: "Status and scope"
sidebar_position: 1
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Authority and scope

This directory is **DRAFT**, **PROPOSED**, and an **IMPLEMENTATION SPECIFICATION**. `PROPOSED FOR LONDON 0.1.0` is the default label for all requirements, algorithms, interfaces, diagrams, defaults and acceptance criteria in this directory. MUST means required by this proposal, not approved company policy. No contract, service, provider integration or Mainnet deployment is supplied.

`CURRENT SOURCE` means verified text in an existing source, not proof that its design is implemented. `OPEN DECISION` blocks the indicated production activity. `ASSUMPTION` is a testable planning premise. `OUT OF SCOPE` excludes work. `SECURITY REVIEW REQUIRED` and `LEGAL/COMPLIANCE REVIEW REQUIRED` identify mandatory specialist gates. None is a certification.

London is a real-money music MVP using Aptos Mainnet settlement. Porto owns cleared subscription revenue and converts company treasury funds into native Aptos USDC. Listeners buy a GBP subscription, do not own USDC, and have no customer crypto balance. Artists and permissioned delivery operators can receive USDC after eligibility, rights, fraud and treasury checks.

`OUT OF SCOPE`: PRT issuance, Porto L1 launch, bridges, Porto consensus validators, permissionless serving, ZK launch dependencies, exchange functionality, NFT issuance, production implementation and publication. Future bank payouts need a separately approved rail.

## Reading contract

Start with [executive architecture](01-executive-architecture.md), [trust model](03-roles-and-trust-model.md), [settlement](08-usdc-treasury-and-settlement.md), and [open decisions](17-open-decisions-and-risk-register.md). Implementers must also use the [API catalogue](20-api-contracts.md), [wire contracts](21-wire-and-commitment-contracts.md), and [acceptance catalogue](22-acceptance-test-catalogue.md). Do not invent values for deployment-blocking decisions.

Existing whitepaper and PIPs remain unchanged. [Compatibility](18-compatibility-with-existing-pips.md) identifies proposed departures. [Sources](23-source-register.md) records exact sections and source hashes. No roadmap PDF was present in the supplied attachment set; no dates or commitments are inferred from one.

## Evidence ladder

A static specification establishes intended behaviour. A prototype establishes only demonstrated UI or local behaviour. Automated tests establish their tested cases and environment. A Mainnet deployment requires an address, package digest and successful deployment transaction. Real settlement requires reconciled transfers of the pinned real asset. Delivery evidence describes server-observed serving, never proof that a person heard the audio. Completion of one level does not establish the next.

## Versioning

Keep this version immutable after approval. Before approval, change the draft and record decisions in the risk register. Breaking field, allocation, eligibility or trust changes require a new specification version and an ADR. Version API envelopes, evidence, policies, allocation rules and contract package independently. A launch manifest pins every version, source digest, chain identity, asset, signer role and signed review receipt.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
