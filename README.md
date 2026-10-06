# principal-pi-skills-evals

skill-harness specifications, seeded fixtures and retained results for
[principal-pi-skills](https://github.com/mojomanyana/principal-pi-skills).

## Current frozen-rubric results

Fresh Pi runs across all eight skills found both lower-cost subjects **NOT READY**:

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
