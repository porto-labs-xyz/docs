---
id: 24-validation-and-impact
title: "Documentation validation and impact"
sidebar_position: 25
---

**APPROVED · IMPLEMENTATION SPECIFICATION · London 0.1.0**

## Evidence boundary

This report covers specification artifacts and their documentation build. It does not report application implementation, contract deployment, provider integration, actual streaming, real payments or pilot outcomes. All implementation acceptance cases remain requirements for future execution.

## Validation record

Checks executed for this revision on 22 September 2026:

| Check | Result and proof boundary |
|---|---|
| `python scripts/validate-london.py` in the documentation environment | PASS: 29 approved pages, 142 local links, 20 OpenAPI operations, 210 schema-valid request/response examples, six artifact examples, profile schema, one canonical hash vector, five allocation vectors, seven unchanged canonical source hashes and 40 acceptance-case definitions |
| `npm exec docusaurus build` | PASS: current Docusaurus build includes London; strict broken-link validation; no canonical content-pull step |
| `npm run typecheck` | PASS: site configuration types |
| Browser production preview | All eight Mermaid diagrams rendered without syntax errors on six chapter pages; no horizontal document overflow at the checked desktop viewport. Executive diagram visually reviewed and changed to a readable vertical layout |
| `git diff --check` | PASS for the scoped documentation changes |
| Required Porto knowledge refresh | Graphify update, ontology augmentation, semantic build, document/concept prose, Obsidian rendering, organisation refresh and both checks completed successfully |
| Source impact | Reviewed 36 declared sources: 34 London documents/artifacts, docs README and design guidance; all London sources represented in semantic projection |
| Canonical preservation | Seven pinned whitepaper/PIP source hashes unchanged; no edits to canonical source or generated protocol mirrors |

These checks validate the documentation and fixtures. They do not execute real signatures, production application tests, a Move deployment, provider clearance, participant-owned playback or monetary settlement. The 210 examples include common error envelopes; they are not 210 different runtime scenarios. The broader acceptance cases remain NOT RUN until implementation.

The approved set contains 29 Markdown/MDX pages plus six JSON artifacts/category metadata. Existing chapter filenames and site routes are preserved. New chapters cover the node package/pilot and release configuration. New machine artifacts are the artifact schema bundle, release profile schema and synthetic fixture set. The previous six-contract and fraud/attestation-service API surface has been replaced, not retained as a second implementation option.

## Scope and knowledge impact

The previous broader London draft is replaced by the approved bounded pilot. All existing chapter routes are preserved; two focused chapters add the node/pilot contract and production configuration. The site navigation, README, knowledge source authority and design guidance must identify approved specification status while retaining the distinction from runtime evidence.

Graph updates must use maintained manifests/curation and supported builders, not generated notes. Review every changed declared London source and connected design guidance. Preserve existing canonical PIP/whitepaper source bytes and unrelated player/design material. Public positioning must not imply that prototype nodes or payments are now real because the implementation specification is approved.

[Contents](index.mdx) · [Implementation plan](16-implementation-plan.md) · [Launch inputs](17-open-decisions-and-risk-register.md)
