# principal-pi-skills-evals

skill-harness specifications, seeded fixtures and retained results for
[principal-pi-skills](https://github.com/mojomanyana/principal-pi-skills).

## Current and historical lanes

[current/](current/README.md) is a separate Principal **4.14.0** / Harness **0.32.3**
installation with six previously accepted bounded cases and three new, unrun
transfer cases. Its nine proposed calibration labels still need operator review.
It does not replace or rescore the historical corpus below. Run its offline checks
with `npm ci --prefix current --ignore-scripts`, then `npm run check:current`.

The root dependencies, commands, archived results and historical CI policy remain
on Principal **4.7.2** / Harness **0.32.1** for reproducibility. Root `npm test` and
`npm run lint:ci` exercise that historical lane; current checks have their own job.

## Evaluator correction candidate

The current specifications correct unfair invocation and reporting gates: source
paths accept either platform's separators, `npm test` and `npm run test` are
equivalent, and a complete source read need not be split into multiple calls.
Behavioral tests and source/write boundaries remain required. Assertion spelling
and a brief honest test-status note on a comment-only change are not failures.

Install with `npm ci`, then run `npm test` and `npm run preflight`. The preflight
uses the shared skill-harness 0.32.1 implementation; there is no separate local
authoring checker. `npm run lint` also checks preserved result consistency.
Both commands are offline and make no provider calls. Their authoring advice is
not proof of semantic validity, and historical staleness findings remain errors.
Do not erase results, restamp them, or change old scores to make these checks pass.

This repair keeps principal-pi-skills pinned to 4.7.2 and retains the original
fixtures and observations. It does not evaluate or qualify the current Principal
release. The changed evaluators need a new explicitly requested comparison before
their scores can support an updated readiness claim. Trace invocation checks
alone do not prove file contents, full source coverage, or successful execution.

## CI and preserved historical evidence

CI runs `npm test` and `npm run lint:ci`. The latter runs the same shared Harness
lint, then reports a narrow historical exception separately. The exact run paths
and SHA-256 hashes in [audit/historical-results.json](audit/historical-results.json)
come from immutable base commit `3e40cdd5350efd866f8de2b046433393daca6a53`.
Every file in each archived run must still match that inventory. Added, edited,
deleted or symlinked evidence fails CI. The manifest itself is hash-pinned in
`scripts/historical-evidence.mjs`; enrolling evidence requires explicit review of
both the inventory and that policy pin, never automatic enrollment during CI.

Only known gate/rubric source-staleness messages for verified, unchanged archived
runs become **HISTORICAL ONLY** notices. Full messages, skill, scenario and run
path must match; unknown messages fail closed. Skill, stimulus, fixture, scoring
policy, unreadable-source, coverage and consistency failures remain errors.
New runs receive the ordinary strict Harness checks with no archive exception.
The full findings, including historical notices, are printed and retained in the
CI `lint-report` artifact. `npm run lint` and `npm run preflight` remain strict and
still fail on historical staleness. No old files, timestamps, hashes or scores are
rewritten by any of these commands.

A passing CI gate means the evaluator definitions validate and frozen evidence
remains intact. It does **not** establish that old scores apply to the corrected
evaluators or qualify the current Principal release. Principal remains pinned to
4.7.2; fresh qualification requires separately authorized evaluation.

To reproduce the inventory for review, run
`node scripts/generate-historical-manifest.mjs > /tmp/historical-results.json`
and compare its SHA-256 with the committed manifest. The generator reads Git
blobs from the fixed baseline commit, not the working tree.

## Historical frozen-rubric results

The retained Pi runs across all eight skills found both lower-cost subjects **NOT READY**:

| Subject | Scenarios passed | Infrastructure-error scenarios |
|---|---:|---:|
| DeepSeek V4.1 Flash | 56/158 (35%) | 2 |
| Nemotron Lightning | 28/158 (18%) | 12 |

Neither wave produced an `UNGRADED` structured judge reply. See [BASELINE.md](BASELINE.md)
for per-skill results, SOL-relative gaps, run accounting, costs, and methodology.

principal-pi-skills 4.0.1 removed its specs and fixtures so measurement
could live outside the product repo. This is that repo. Skills come from
the pinned principal-pi-skills version in package.json; specs live here
at `<skill>/tests/specification.yaml`; skill-harness reads both roots.

Layout: one directory per skill, matching the skill's name, holding
`tests/specification.yaml`, `tests/fixtures/`, `tests/post/` and retained
`tests/results/`. `audit/` holds the salvage audits that founded the repo.
