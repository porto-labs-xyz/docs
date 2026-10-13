---
title: Audio model research and selection
sidebar_position: 3
---

**Research checked 13 October 2026 · No Porto model calls, quality benchmark or provider purchase performed**

## One shared model

Use the original or selected parent recording as model input, accompanied by the validated text instruction. This does not require a model trained for each artist. Speech transcription and command interpretation can be separate lightweight services; the shared music model is the component that synthesizes transformed music.

A music model need not be an LLM. Diffusion and hybrid music-generation architectures can provide the required audio-conditioned interface. A speech-generation or text-to-speech model is not a substitute for music editing. Prompting a text-only music generator with the artist's name does not establish source-preserving transformation.

## Selected model: ACE-Step 1.5

The founder selected **ACE-Step 1.5 as Porto's primary shared music model on 13 October 2026**. Use pretrained weights for source-conditioned transformations; no per-artist fine-tuning or training programme is required. The starting deployment recommendation is a self-hosted Python/GPU worker behind the existing model adapter. Selecting the family does not yet select a checkpoint, prove output quality or establish production readiness.

The official [model card](https://huggingface.co/ACE-Step/Ace-Step1.5) labels the weights MIT and documents checkpoint-specific support. Evaluate `acestep-v15-base`, `acestep-v15-sft` and `acestep-v15-turbo` for cover/source conditioning and repainting. Base additionally lists extract, layer-addition and completion operations that the SFT/Turbo matrix does not list. Do not choose the fastest checkpoint solely from text-to-music generation benchmarks.

Implement the first generative path using uploaded source audio plus a validated instruction. Test source-conditioned cover/restyling and selected-region repainting; retain precise tempo/pitch/effects and supplied-stem muting in the deterministic executor. Pin the successful checkpoint, code revision, weight hashes, inference settings and dependencies after the evaluation gate. Keep output manifests tied to those exact versions.

## Current candidates

| Candidate | Documented support | Proposed role and unresolved questions |
| --- | --- | --- |
| ACE-Step 1.5 | Official project lists reference input, covers and repainting; its checkpoint matrix distinguishes editing/separation support | Selected primary model family. Evaluate editing fidelity and checkpoint coverage, then pin one checkpoint for production |
| Stable Audio 3 Medium / Large | Audio-to-audio, inpainting and continuation are documented in the official inference repository; open weights exist for Medium, with Large offered through an API/enterprise route | Alternative retained for comparison or a future reviewed fallback if ACE-Step fails a required edit; not the selected implementation |
| Eleven Music v2 / v2.5 | Stored uploaded audio, retained reference slices, regenerated chunks and audio conditioning in composition plans | Hosted alternative for section edits. Reference conditioning is limited to 30 seconds and generated chunks to 120 seconds in the documented inpainting guide; this is not proof of exact whole-song transformation |

[Stable Audio's inference repository](https://github.com/Stability-AI/stable-audio-3) documents the source-conditioned editing interface and controls. Its [release description](https://stability.ai/news-updates/meet-stable-audio-3-the-model-family-built-for-artistic-experimentation-with-open-weight-models) describes Small/Medium open weights, longer-generation support and Large deployment options. These are vendor capabilities and claims, not measured Porto latency or source fidelity.

[ACE-Step's official repository](https://github.com/ACE-Step/ACE-Step-1.5) publishes the feature and checkpoint matrices. Its code licence and any selected weights/dependencies must be checked at the pinned revision. The project licence is not permission to remix a third-party recording.

[ElevenLabs' inpainting guide](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/inpainting) documents mixed retained and regenerated sections. Its [audio-reference guidance](https://elevenlabs.io/docs/help-center/product/core-capabilities/music/what-is-audio-reference) also describes copyright screening. Catalogue permission from a rights holder does not guarantee provider admission; validate the actual upload and distribution terms before making it the production path.

Decision: implement and evaluate ACE-Step 1.5 first. Stable Audio and Eleven Music remain research alternatives, rather than coequal implementation choices. Keep a narrow adapter so a later reviewed model change preserves the product contract. Use one pinned production music checkpoint; no artist-specific fine-tuning is included.

## Exact edits and generative edits

| Request | Preferred implementation | Honest capability boundary |
| --- | --- | --- |
| Slow down, speed up, pitch shift | Deterministic audio processing | Precise parameter control; listening tests still needed for stretching artefacts |
| Reverse, chop, distortion, echo, darker filter | Deterministic processing from original/parent | Reproducible and inexpensive; a general model is unnecessary for these operations |
| Remove supplied guitar/vocal/drum stem | Remix aligned stems with that stem muted | Removes the provided channel; residual content may exist in other stems |
| Remove guitar from a stereo master | Evaluated separation and remix, or reject unsupported request | Separation can leave bleed and damage nearby instruments; not guaranteed clean removal |
| Make dreamy, change arrangement, replace a section | Shared audio model with original input and preservation constraints | Can drift in melody, lyrics, timbre or structure; benchmark before release |
| Sound like another artist or clone a singer | Reject unless explicitly within approved rights and supported policy | Outside the proposed first release |

[FFmpeg's filter documentation](https://www.ffmpeg.org/ffmpeg-filters.html) provides tempo, filtering and related processing primitives. Pin the compiled feature set and review the licensing of optional libraries, including any time-stretch dependency. The original [Demucs repository](https://github.com/facebookresearch/demucs) describes its experimental guitar/piano separation and artefact limitations, and is archived. Use it as a baseline research option, not an assumed maintained production service. Prefer supplied stems for the first reliable instrument-removal feature.

“Make it dreamy” needs an interpretation policy. Offer one reasonable bounded default, preserve source context, and let the listener refine through voice/text. Ask only when ambiguity changes the target track, permissions, spending or a major musical outcome. Do not expose technical settings or model names in the normal product flow.

## User-uploaded source audio

The shared model can receive an eligible user-uploaded original or a selected excerpt. Uploading is open to any account; AI inference is governed by the uploader's separate transformation permission and provider terms. An upload does not authorize training. Preserve the uploaded source hash and excerpt time range in every edit plan and result manifest.

The upload service accepts supported audio categories independently from the music model. Speech, field recordings and long mixes can be hosted and played without claiming that the music-editing model can transform them successfully. Evaluate such inputs before enabling them for generation. Disclose unsupported source types and duration limits before reserving generation allowance. Provider admission checks may still reject an otherwise valid Porto upload; do not route rejected content around provider restrictions.

## Speech and command interpretation

Use an explicit microphone gesture, bounded capture, visible recording state and editable transcript. Music continues playing, matching the prototype. Evaluate recognition with headphones, phone speakers and noisy rooms; echo cancellation and noise suppression can help but must be tested. Typed input remains available for unsupported browsers and recognition failures.

[Deepgram's streaming documentation](https://developers.deepgram.com/docs/live-streaming-audio) documents interim and finalized transcript signals. A managed speech service is a reasonable starting candidate. Use a backend proxy or short-lived provider authorization, never a long-lived secret embedded in the browser. Provider retention and region settings need confirmation for the chosen account and service.

The text planner should return a closed set of operations and typed parameters. [Anthropic's structured-output documentation](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) illustrates this capability; provider selection remains open. Schema-valid output still needs semantic checks: track existence, operation support, parameter limits, permission, quote and consistency across clauses. Treat user text and track metadata as untrusted input. The model cannot execute arbitrary tools.

## Two-week evaluation gate

Create a permission-cleared test set of ten source tracks spanning dense guitars, electronic arrangements, percussion, vocals and sparse acoustic recordings. Include aligned stems for a subset. Use ten command classes per track, three seeds for stochastic model jobs, and full-length tests for five tracks after short previews pass. Record the exact input hashes, model revision, parameters, hardware, provider region, duration, output hashes and cost. Hold back some tracks and phrasings from prompt tuning.

Compare ACE-Step checkpoints for source preservation, edit adherence, intelligible vocals, discontinuities, clipping, stereo behaviour and audible bleed. Ask artist representatives and listeners to rate randomized A/B results. Similarity measurements, tempo estimators and silence detectors supplement listening; they do not prove rights clearance or preservation of the song's identity.

Proposed go/no-go thresholds, to approve before testing:

- At least 90% correct supported-command plans on a 200-example suite; zero unauthorized operations or unsupported partial execution.
- Exact-edit numerical tests pass; guitar removal launches only for supplied stems or individually accepted separation results.
- At least 80% of evaluated generative previews receive both edit-adherence and source-recognition scores of 4/5 or better from the review panel, with no unacceptable vocal corruption.
- Measure warm and cold p50/p95 latency for 30-second previews and full tracks at 1, 5 and 10 concurrent jobs. Initial targets are preview p95 under 60 seconds and four-minute rendition p95 under 180 seconds at admitted load; adjust scope if measurements miss them.
- Compare cost per accepted result, including failed attempts, against the proposed product margin. No launch claim based on vendor benchmark timing alone.

If no model meets the preservation threshold, ship the honest deterministic/stem subset and keep generation experimental. Preserve the shared-model direction without committing to a provider that fails the product test.
