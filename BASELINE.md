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
- **Subject models:** `fireworks:accounts/fireworks/models/glm-5p3-flash` and `openai-codex:gpt-6.1-sol`.
