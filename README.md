# principal-pi-skills-evals

skill-harness specifications, seeded fixtures and retained results for
[principal-pi-skills](https://github.com/mojomanyana/principal-pi-skills).

## Evaluator correction candidate

The current specifications correct unfair invocation and reporting gates: source
paths accept either platform's separators, `npm test` and `npm run test` are
equivalent, and a complete source read need not be split into multiple calls.
Behavioral tests and source/write boundaries remain required. Assertion spelling
and a brief honest test-status note on a comment-only change are not failures.

Install with `npm ci`, then run `npm test` and `npm run preflight`. The preflight
uses the shared skill-harness 0.32.0 implementation; there is no separate local
authoring checker. `npm run lint` also checks preserved result consistency.
Both commands are offline and make no provider calls. Their authoring advice is
not proof of semantic validity, and historical staleness findings remain errors.
Do not erase results, restamp them, or change old scores to make these checks pass.

This repair keeps principal-pi-skills pinned to 4.7.2 and retains the original
fixtures and observations. It does not evaluate or qualify the current Principal
release. The changed evaluators need a new explicitly requested comparison before
their scores can support an updated readiness claim. Trace invocation checks
alone do not prove file contents, full source coverage, or successful execution.

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
