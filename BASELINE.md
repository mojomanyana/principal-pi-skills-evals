# Frozen-rubric baseline

Date: **2026-10-04**

This is the baseline for subsequent evaluation waves. Results were regraded from retained transcripts with the frozen human-judgment rubric and `openai-codex:gpt-6-astra`; subject transcripts were not rerun or changed.

## Final results

`UNGRADED` counts are retained repetitions with incomplete criterion votes under skill-harness 0.22.4 semantics. They count as non-passes. Objective-gate failures are failed retained objective gates in the complete run for each model.

| Skill | GLM pass | GLM UNGRADED | GLM readiness | SOL pass | SOL UNGRADED | SOL readiness | Objective-gate failures (GLM / SOL) |
|---|---:|---:|---|---:|---:|---|---:|
| architect | 5/18 (28%) | 0 | NOT READY | 15/18 (83%) | 0 | NOT READY | 0 / 0 |
| build | 4/19 (21%) | 12 | NOT READY | 9/19 (47%) | 15 | NOT READY | 4 / 1 |
| debug | 4/18 (22%) | 3 | NOT READY | 13/18 (72%) | 11 | NOT READY | 3 / 0 |
| decide | 9/17 (53%) | 3 | NOT READY | 15/17 (88%) | 4 | NOT READY | 0 / 0 |
| git-ops | 12/21 (57%) | 0 | NOT READY | 17/21 (81%) | 0 | NOT READY | 0 / 0 |
| investigate | 1/9 (11%) | 0 | NOT READY | 4/9 (44%) | 0 | NOT READY | 5 / 5 |
| plan | 3/27 (11%) | 0 | NOT READY | 14/27 (52%) | 0 | NOT READY | 12 / 2 |
| review | 8/29 (28%) | 0 | NOT READY | 25/29 (86%) | 0 | NOT READY | 3 / 0 |

## Model gaps

The noise floor is ±2 scenarios.

- **architect:** SOL leads by 56 percentage points (10 scenarios); **exceeds** the noise floor.
- **build:** SOL leads by 26 percentage points (5 scenarios); **exceeds** the noise floor.
- **debug:** SOL leads by 50 percentage points (9 scenarios); **exceeds** the noise floor.
- **decide:** SOL leads by 35 percentage points (6 scenarios); **exceeds** the noise floor.
- **git-ops:** SOL leads by 24 percentage points (5 scenarios); **exceeds** the noise floor.
- **investigate:** SOL leads by 33 percentage points (3 scenarios); **exceeds** the noise floor.
- **plan:** SOL leads by 41 percentage points (11 scenarios); **exceeds** the noise floor.
- **review:** SOL leads by 59 percentage points (17 scenarios); **exceeds** the noise floor.

## Profile and versions

- **Judge profile:** stricter on manner, sharper on code, consistent across models.
- **Judge:** `openai-codex:gpt-6-astra` (explicit for every retained regrade).
- **Rubric version:** frozen human-judgment rubric from `main` at `e356594` (PR #14).
- **skill-harness:** 0.22.4.
- **principal-pi-skills:** 4.7.2.
- **Subject models:** `fireworks:accounts/fireworks/models/glm-5p3-flash` and `openai-codex:gpt-6.1-sol`.
