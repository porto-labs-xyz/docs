---
id: 24-validation-and-impact
title: "Validation and impact report"
sidebar_position: 25
---

**DRAFT · PROPOSED · IMPLEMENTATION SPECIFICATION**

## Scope of evidence

This report records documentation validation only. No application tests, provider integration, Move deployment or real-money settlement were performed. The acceptance catalogue is future required test coverage.

## Validation record

Validation completed for the documentation artefacts. Commands are run from the directories stated below; they do not deploy services.

| Check | Command / method | Result |
|---|---|---|
| Full current site build | `npm exec docusaurus build` in `docs/` | PASS, London included, strict broken-link build completed |
| Site configuration types | `npm run typecheck` in `docs/` | PASS |
| Front matter, local links, draft labels, OpenAPI and examples | `python scripts/validate-london.py` in `docs/`, using a development environment with jsonschema, PyYAML and openapi-spec-validator | PASS, 27 pages, all local links, OpenAPI 3.1, 47 request/response examples, seven source hashes |
| Browser check | Local Docusaurus production preview | London navigation visible; all seven Mermaid diagrams rendered without syntax errors |
| Whitespace | `git -C docs diff --check` and `git -C ../porto-knowledge diff --check` from Porto root | PASS |
| Full required graph pipeline | `./scripts/update-porto-knowledge-graph.sh` from Porto root | PASS, Graphify, ontology augmentation, semantic prose, Obsidian and organisation projection checks |
| Per-source impact | `python3 ../porto-knowledge/scripts/knowledge.py impact <source-path>` | PASS for all 30 declared changed documentation sources |
| Canonical-source preservation | SHA-256 comparison against pre-task inventory | PASS, 18 canonical/generated protocol files unchanged |

The browser check found a static path collision between the section landing page and its output directory under the existing no-trailing-slash configuration. The landing route was changed to `/london-0.1.0/overview`; navigation uses that route. This is not a claim of a full browser regression suite. The package installer reported 30 dependency advisories (23 moderate, 7 high); this task added the matching Docusaurus Mermaid theme and did not perform an unrelated dependency upgrade campaign. Dependency remediation remains part of site maintenance, separate from London application launch evidence. The current build includes the canonical `london-0.1.0/` source through a second Docusaurus docs instance. The direct Docusaurus build avoids the existing content-pull pre-step so generated PIP and whitepaper mirrors remain unchanged.

## Impact disposition

London is registered as a separate draft proposal corpus with dedicated architecture, evidence, USDC settlement and compatibility concepts. It does not replace PRT, app-chain or existing rollout facts. Governance/PIP, website, economic copy and design route reviews are identified in the compatibility matrix and D12. No approved visual or presentation decision changed, so design guidance has no new approved decision to record. The private design/player sources retain metadata-only treatment.

Publication notification is not run because no source was published. No commit, push or deployment is performed.

[Contents](index.mdx) · [Open decisions](17-open-decisions-and-risk-register.md)


## Files created

Canonical directory: `docs/london-0.1.0/` relative to the Porto workspace. The following 30 files were created:

- `00-status-and-scope.md`
- `01-executive-architecture.md`
- `02-system-architecture.md`
- `03-roles-and-trust-model.md`
- `04-listener-and-artist-journeys.md`
- `05-catalogue-rights-and-content.md`
- `06-streaming-delivery-and-attestation.md`
- `07-fraud-controls-and-disputes.md`
- `08-usdc-treasury-and-settlement.md`
- `09-move-contract-specification.md`
- `10-off-chain-services-and-apis.md`
- `11-data-model-and-event-schemas.md`
- `12-security-privacy-and-key-management.md`
- `13-operations-observability-and-incidents.md`
- `14-testing-and-launch-gates.md`
- `15-migration-to-porto-app-chain.md`
- `16-implementation-plan.md`
- `17-open-decisions-and-risk-register.md`
- `18-compatibility-with-existing-pips.md`
- `19-architecture-decisions.md`
- `20-api-contracts.md`
- `21-wire-and-commitment-contracts.md`
- `22-acceptance-test-catalogue.md`
- `23-source-register.md`
- `24-validation-and-impact.md`
- `_category_.json`
- `glossary.md`
- `index.mdx`
- `openapi.json`
- `source-manifest.json`

Additional new documentation tooling: `docs/sidebars.london.ts` and `docs/scripts/validate-london.py`.

Modified integration sources: `docs/README.md`, `docs/docusaurus.config.ts`, `docs/package.json`, `docs/package-lock.json`, `graphify-knowledge-augment.py`, `scripts/build-porto-semantic-layer.py`, and the organisation graph's `sources/manifest.json` and `knowledge/curation.json` in the sibling `porto-knowledge` repository. Generated graph/Obsidian/site projections were rebuilt through their supported tools, not hand-edited. Existing unrelated changes in the organisation graph checkout were preserved.

## Impact review by family

| Connected family | Review outcome |
|---|---|
| Whitepaper, PIP-2 through PIP-7 and economic cross-references including PIP-8 | Compatibility matrix identifies proposed departures; no canonical edits or implied ratification |
| Generated documentation mirrors and source index | Unchanged; London has its own source authority and route |
| Public product/economic messaging and landing route | Requires future D12 review, no automatic replacement of approved claims |
| Marketing, design and player-prototype routes | Prototype behaviour and approved presentation decisions remain separate from this proposal |
| Knowledge operations and documentation route | Added explicit London draft corpus, concepts and local build integration |

All 12 D01-D12 decisions remain open. Legal/compliance, tax/finance, rights, provider and independent security reviews are required as assigned in the [decision register](17-open-decisions-and-risk-register.md). The documentation is ready for implementation planning and specialist review, not approved for production deployment.
