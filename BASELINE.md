# Frozen-rubric baseline

Date: **2026-10-04**

This is the baseline for subsequent evaluation waves. All 765 retained repetitions were regraded from unchanged transcripts with the frozen human-judgment rubric, the explicit judge `openai-codex:gpt-6-astra`, and skill-harness 0.23.0's structured JSON judge contract. Subject transcripts were not rerun or changed.

## Final results

`UNGRADED` counts are retained repetitions whose structured judge reply remained invalid after the one allowed retry. They count as non-passes. Objective-gate failures are failed retained objective gates in the complete run for each model.

| Skill | GLM pass | GLM UNGRADED | GLM readiness | SOL pass | SOL UNGRADED | SOL readiness | Objective-gate failures (GLM / SOL) | judgeFormat |
|---|---:|---:|---|---:|---:|---|---:|---|
| architect | 6/18 (33%) | 0 | NOT READY | 16/18 (89%) | 0 | NOT READY | 0 / 0 | json |
| build | 11/19 (58%) | 0 | NOT READY | 14/19 (74%) | 0 | NOT READY | 4 / 1 | json |
| debug | 7/18 (39%) | 0 | NOT READY | 17/18 (94%) | 0 | NOT READY | 3 / 0 | json |
| decide | 8/17 (47%) | 0 | NOT READY | 15/17 (88%) | 0 | NOT READY | 0 / 0 | json |
| git-ops | 12/21 (57%) | 0 | NOT READY | 18/21 (86%) | 0 | NOT READY | 0 / 0 | json |
| investigate | 2/9 (22%) | 0 | NOT READY | 4/9 (44%) | 0 | NOT READY | 5 / 5 | json |
| plan | 2/27 (7%) | 0 | NOT READY | 13/27 (48%) | 0 | NOT READY | 12 / 2 | json |
| review | 7/29 (24%) | 0 | NOT READY | 25/29 (86%) | 0 | NOT READY | 3 / 0 | json |

## Waves 2 and 3

These are fresh Pi subject runs under the same frozen rubric, skill version, harness version, and explicit JSON judge. Wave 2 used `fireworks:accounts/fireworks/models/deepseek-v4p1-flash`; Wave 3 used `fireworks:accounts/fireworks/models/nemotron-lightning-3p5-30b-a3b`. Scenario-level repetitions came from each specification.

Infrastructure errors are retained as non-passes. `UNGRADED` remains reserved for invalid structured judge replies after the allowed retry; neither wave produced one.

| Skill | DeepSeek pass | DeepSeek UNGRADED | DeepSeek readiness | DeepSeek gate failures | DeepSeek infra errors | Nemotron pass | Nemotron UNGRADED | Nemotron readiness | Nemotron gate failures | Nemotron infra errors |
|---|---:|---:|---|---:|---:|---:|---:|---|---:|---:|
| architect | 4/18 (22%) | 0 | NOT READY | 0 | 0 | 5/18 (28%) | 0 | NOT READY | 1 | 1 |
| build | 10/19 (53%) | 0 | NOT READY | 4 | 1 | 5/19 (26%) | 0 | NOT READY | 3 | 1 |
| debug | 7/18 (39%) | 0 | NOT READY | 4 | 0 | 2/18 (11%) | 0 | NOT READY | 5 | 2 |
| decide | 8/17 (47%) | 0 | NOT READY | 0 | 0 | 3/17 (18%) | 0 | NOT READY | 0 | 0 |
| git-ops | 16/21 (76%) | 0 | NOT READY | 0 | 0 | 5/21 (24%) | 0 | NOT READY | 1 | 0 |
| investigate | 0/9 (0%) | 0 | NOT READY | 9 | 0 | 0/9 (0%) | 0 | NOT READY | 9 | 0 |
| plan | 3/27 (11%) | 0 | NOT READY | 11 | 0 | 1/27 (4%) | 0 | NOT READY | 13 | 4 |
| review | 8/29 (28%) | 0 | NOT READY | 0 | 1 | 7/29 (24%) | 0 | NOT READY | 1 | 4 |

### SOL-relative gaps

The noise floor remains ±2 scenarios. Positive gaps mean SOL passed more scenarios.

| Skill | SOL over DeepSeek | Noise-floor result | SOL over Nemotron | Noise-floor result |
|---|---:|---|---:|---|
| architect | 67 pp (12 scenarios) | exceeds | 61 pp (11 scenarios) | exceeds |
| build | 21 pp (4 scenarios) | exceeds | 48 pp (9 scenarios) | exceeds |
| debug | 55 pp (10 scenarios) | exceeds | 83 pp (15 scenarios) | exceeds |
| decide | 41 pp (7 scenarios) | exceeds | 70 pp (12 scenarios) | exceeds |
| git-ops | 10 pp (2 scenarios) | at | 62 pp (13 scenarios) | exceeds |
| investigate | 44 pp (4 scenarios) | exceeds | 44 pp (4 scenarios) | exceeds |
| plan | 37 pp (10 scenarios) | exceeds | 44 pp (12 scenarios) | exceeds |
| review | 58 pp (17 scenarios) | exceeds | 62 pp (18 scenarios) | exceeds |

### Wave accounting and cost

- Planned subject repetitions: **744** total, **372 per model**.
- Subject repetitions with usage metrics: **730/744** — DeepSeek **369/372**, Nemotron **361/372**.
- Infrastructure-error scenarios: **14** — DeepSeek **2**, Nemotron **12**.
- Structured-judge `UNGRADED` repetitions: **0**.
- **DeepSeek COST:** architect $0.073296; build $0.257211; debug $0.342047; decide $0.092371; git-ops $0.155718; investigate $0.023060; plan $0.252267; review $0.173439; **total $1.369409**.
- **Nemotron COST:** architect $0.021308; build $0.125075; debug $0.291364; decide $0.051116; git-ops $0.162364; investigate $0.006091; plan $0.173291; review $0.179510; **total $1.010119**.

Costs are subject-only usage-derived values from the skill-harness result metrics and exclude judge cost.

## Regrade accounting

- Retained runs: **37**.
- Retained repetitions regraded: **765**.
- Repetitions requiring the one structured-output retry: **0**.
- Repetitions still `UNGRADED`: **0**.
- Retained repetitions with `judgeFormat: json`: **765/765**.
- Changed subject transcripts: **0/765**.

## Model gaps

The noise floor is ±2 scenarios.

- **architect:** SOL leads by 56 percentage points (10 scenarios); **exceeds** the noise floor.
- **build:** SOL leads by 16 percentage points (3 scenarios); **exceeds** the noise floor.
- **debug:** SOL leads by 56 percentage points (10 scenarios); **exceeds** the noise floor.
- **decide:** SOL leads by 41 percentage points (7 scenarios); **exceeds** the noise floor.
- **git-ops:** SOL leads by 29 percentage points (6 scenarios); **exceeds** the noise floor.
- **investigate:** SOL leads by 22 percentage points (2 scenarios); **at** the noise floor.
- **plan:** SOL leads by 41 percentage points (11 scenarios); **exceeds** the noise floor.
- **review:** SOL leads by 62 percentage points (18 scenarios); **exceeds** the noise floor.

## What changed from the prose judge

These are pass-rate deltas from the skill-harness 0.22.4 prose-judge baseline using the same retained transcripts, frozen rubrics, and explicit judge model. Positive values mean more scenarios passed under the structured regrade.

| Skill | GLM pass-rate delta | SOL pass-rate delta |
|---|---:|---:|
| architect | +5 pp (+1 scenario) | +6 pp (+1 scenario) |
| build | +37 pp (+7 scenarios) | +27 pp (+5 scenarios) |
| debug | +17 pp (+3 scenarios) | +22 pp (+4 scenarios) |
| decide | -6 pp (-1 scenario) | 0 pp (0 scenarios) |
| git-ops | 0 pp (0 scenarios) | +5 pp (+1 scenario) |
| investigate | +11 pp (+1 scenario) | 0 pp (0 scenarios) |
| plan | -4 pp (-1 scenario) | -4 pp (-1 scenario) |
| review | -4 pp (-1 scenario) | 0 pp (0 scenarios) |

## Profile and versions

- **Judge profile:** stricter on manner, sharper on code, consistent across models.
- **Judge:** `openai-codex:gpt-6-astra` (explicit for every retained regrade).
- **Judge format:** structured JSON; strict criterion order and count validation.
- **Rubric version:** frozen human-judgment rubric from `main` at `e356594` (PR #14).
- **skill-harness:** 0.23.0.
- **principal-pi-skills:** 4.7.2.
- **Subject models:** `fireworks:accounts/fireworks/models/glm-5p3-flash`, `openai-codex:gpt-6.1-sol`, `fireworks:accounts/fireworks/models/deepseek-v4p1-flash`, and `fireworks:accounts/fireworks/models/nemotron-lightning-3p5-30b-a3b`.
