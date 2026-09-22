---
id: 17-open-decisions-and-risk-register
title: "Open decisions and risk register"
sidebar_position: 18
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Production-blocking decisions

Every row is `OPEN DECISION`. Owners are required roles, not assigned people. All remain unresolved in this specification; proposed test defaults are not approvals. A closure record must identify named approver, evidence, date, policy/config digest and affected test IDs.

| ID | Decision and required closure | Owner/review | Blocks | Residual risk |
|---|---|---|---|---|
| D01 | Entity, launch jurisdictions, subscription/revenue/custody model, regulated-activity assessment, financial-crime duties and customer terms | Legal/compliance, finance | Real-money onboarding and funds flow | Ownership wording alone cannot establish regulatory status |
| D02 | GBP provider, conversion/native Aptos USDC withdrawal, redemption eligibility, limits, fees, reconciliation and outage terms | Finance, selected provider, legal | Real conversion/funding | Provider rejection, insolvency or unsupported rail |
| D03 | Identity, Aptos account custody/recovery, signer system, address change procedure and user control | Security, product, legal/provider | Authentication and payout-account production implementation | Key loss and recovery abuse |
| D04 | VAT/tax, revenue recognition, FX valuation, fee allocation, reserves, refunds, chargebacks and recovery authority | Finance, tax adviser, legal | Production ledger policy | Underfunding, tax error, unsupported clawback |
| D05 | Network split, allocation base, daily proration, unused budgets, rounding policy, minimum payout and late adjustments | Product, finance, rights stakeholders/governance | Economic production implementation | Do not assume 70/25/5 or fixture economics |
| D06 | Recording/publishing/performer/territorial and DJ-set rights, recipient splits, operator remuneration and origin fallback share | Rights counsel, catalogue, operators | Payable catalogue and operator contracts | Unlicensed serving or disputed allocation |
| D07 | Exact framework/SDK/package versions, USDC metadata/decimals/API, custody vault, upgrade compatibility and admin quorum | Move lead, independent security reviewer | Production Move implementation and deployment | Asset confusion, unsafe custody or upgrade |
| D08 | Privacy/DPIA, retention and legal holds, export/redaction, public-address disclosure and dispute terms | Privacy, legal, security | Production data collection/retention | Immutable correlation and erasure conflicts |
| D09 | Eligibility, dedup/long-form policy, fraud caps, suspension/appeal authority and operator cold-start limits | Fraud, product, rights, security | Production reward approval | False positives and operator/listener collusion |
| D10 | Freeze/cancel/reissue authority, independent finance review, roles, timelocks, treasury and gas monetary ceilings | Finance, security, accountable executive | Signing/reservation/payment | Insider or compromised key loss |
| D11 | Pilot capacity, deployment/DR region, SLOs, alert thresholds, support roster, RPO/RTO and load baseline | Operations, security, finance | Production infrastructure sizing and go-live | Outages and unsupported scale claims |
| D12 | Formal acceptance of London departures, public-claim review and separately approved Mainnet rehearsal/pilot | Protocol governance, product, legal, security | Production release | Canonical source mismatch and premature launch claims |

## Additional tracked risks

R01 operator signatures can authenticate fabricated receipts: permissioning, probes, cross-checks, monetary caps and independent review reduce exposure but do not make delivery trustless. R02 private-root allocation fraud: independent recomputation plus bounded vault prevents overspend, not arbitrary trusted allocation. R03 data loss: durable evidence and restore tests are required before acknowledgement. R04 chain/provider/stablecoin failure: pause and preserve liabilities; asset substitution is a new decision. R05 late rights dispute after payment: chain finality prevents unilateral reversal. R06 privacy reidentification through addresses/timing: minimise public fields, review aggregation and disclose limits. R07 unapproved public launch language: keep draft banners and route visible as proposal.

## Future decisions, not launch dependencies

F01 app-chain trigger thresholds and security funding; F02 independent attestor observation/quorum design; F03 validator admission/staking/governance; F04 new-chain asset strategy and any bridge; F05 optional ZK research; F06 later bank payout rail. All require new proposals and reviews. No future date or provider commitment is assumed.

[London 0.1.0 contents](index.mdx) · [Decision register](17-open-decisions-and-risk-register.md)
