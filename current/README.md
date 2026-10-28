# Current Principal evaluation lane

This lane pins **Principal 4.14.0** and **published Harness 0.32.3** independently
of the repository's historical Principal 4.7.2 / Harness 0.32.1 root installation.
It uses the shared Harness CLI and calibration core; there is no local judge or
scoring implementation. Pi is required for model execution. Use the qualified
Pi 1.4.0 runtime for the planned comparison; do not silently upgrade it.

Two separate specification roots prevent development data from becoming a holdout:

| Root | Purpose | Cases | State |
| --- | --- | ---: | --- |
| `suites/accepted` | Previously accepted bounded Decide, Architect and Test Review contracts | 6 | Imported synthetic inputs; private observed results remain outside Git |
| `suites/transfer` | New cash-commitment decision, durable-ingest structure and failed-batch test review | 3 | Not run; nine calibration labels proposed, not accepted |

Neither lane qualifies all nine Principal skills or a complete delegated workflow.
The review cases grant only read/grep/find/ls. Unavailable mutation/execute tools
are a profile restriction, not evidence of model restraint when they are available.
The subject explicitly receives the complete-read instruction that the read gates
observe. Tool-reported read success is not proof of semantic comprehension.

## Offline checks

From the repository root, using Node 24:

```sh
npm ci --prefix current --ignore-scripts
npm --prefix current test
npm --prefix current run lint
npm --prefix current run preflight
```

These commands make no model/provider calls. CI runs them in a separate job and
keeps the historical root installation, commands and evidence policy unchanged.
The fixture suites deliberately include both weak and stronger test oracles;
passing their tests does not establish their test quality. Calibration proposals
are synthetic answer controls, not observed subject executions.

## Review and measurement

Read each transfer `specification.yaml`, its `controls.json`, and the named
fixtures together. Each skill has one positive, one focused negative and one
equivalent valid answer, with a vote for each criterion. All nine labels require
operator review; prior acceptance of different controls does not carry over.
`calibration-proposed.json` was prepared through shared `prepareCalibration` and
binds the exact specification, reference and transcript bytes. It intentionally
reports `needs-review`; do not edit an acceptance flag to bypass the review.

From `current/`, inspect one proposal without a model call:

```sh
./node_modules/.bin/skill-harness calibrate suites/transfer/decide/tests/calibration-proposed.json
```

After actual label acceptance, prepare a **new** manifest with the shared helper
and the recorded decision; preserve the proposal. Calibrate it using the selected
independent judge, then run the subject comparison only if that calibration is
sound. The subject and judge are operator choices; none are silently defaulted by
this lane. Commands below are a template, not authorization or an automatic run:

```sh
# Set SUBJECT and JUDGE to the explicitly selected provider:model identifiers.
npm run run:transfer -- decide --harness pi --model "$SUBJECT" --judge "$JUDGE" --mode red --parallel 1 --reps 2 --pass-threshold 1
npm run run:transfer -- decide --harness pi --model "$SUBJECT" --judge "$JUDGE" --mode force --parallel 1 --reps 2 --pass-threshold 1
```

Repeat sequentially for `architect` and `test-review`; a failing case is evidence
to diagnose, not a reason to rerun until it passes. Use Harness resource controls
appropriate to the host, and inspect its settled-process receipts after each phase.
Report errors separately from quality failures, and answers separately from fully
passing scenarios. Forced delivery does not test autonomous skill selection.
Do not overlap the comparison with a separate Scout model wave.

## Reuse and provenance

`provenance.json` records hashes of selected synthetic input files and references
to the private local review reports. Those report references are inventory labels,
not public files or proof available to a fresh clone. No private subject answer,
trace, provider receipt, human conversation, or accepted-label record is committed.

The previous bounded local comparison used Sol/Astra, Pi 1.4.0 and Harness 0.32.2.
After operator-accepted rubric clarification it recorded 4/12 baseline answers
and 12/12 force answers (six force scenarios fully passing, two repetitions each).
The original 10/12 force result remains intact. Two overall verdicts changed by
regrading eight saved answers; there were no fresh subjects. These are **post-hoc
development observations**, not generalization evidence or a current run score.

Before spending calls on accepted cases, run shared `diagnose` against explicitly
selected local original directories and this lane's specification/skill roots.
Use its reuse/regrade/run distinction and exact `calibrate --plan --reuse` bindings.
Do not reconstruct absent traces, relabel a copied answer as new, or infer a new
calibration acceptance from the old reports. New rubric grading uses a fresh output
directory; results stay ignored until an explicit, reviewed publication selection.

The transfer cases are fresh relative to the prior six-case subject comparison.
Their authored controls disclose the intended acceptance policy and make them
development tests once reviewed; they are not a secret benchmark or a stability
study. Do not pool their future scores with historical scores to claim a larger run.
