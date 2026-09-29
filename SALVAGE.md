# Salvage plan

Source of the pre-4.0 specs: principal-pi-skills commit cf83e48, the last
commit before they were deleted (the 4.0.1 changelog says v4.0.0; that is
wrong, they were removed one commit earlier).

Two independent audits of the 107 scenarios against 4.5.0 are in audit/.
They disagree on 76 scenarios and the disagreement is a criterion, not
the scenarios: audit 1 marks a grader EDIT when it does not verify the
full 4.x output template; audit 2 marks it EDIT only when it asserts
something the skill no longer does. Audit 2's criterion is adopted:

- A focused grader that tests one behaviour is KEEP whatever the output
  template looks like.
- Each skill gets ONE output-contract rubric criterion, applied across
  all of that skill's scenarios, so the template is checked once per
  skill rather than once per scenario.
- The 14 graders audit 2 marks EDIT-GRADER are rewritten. The eight both
  audits agree on come first: architect D2; git-ops A2, A5, A8, B1;
  plan A4, D1; review A6.
- Scenarios audit 1 marked DROP and audit 2 rescued as EDIT-GRADER are
  rescued: decide C3; git-ops E1, E2; plan D2, E1; review E1.
- investigate is written fresh: five read-only scenarios over a seeded
  fixture with a known answer, a trace assertion that no write or
  git-mutating tool ran, a hidden post-test on the fixture line, and the
  citation check as a rubric criterion, because a hidden post-test
  cannot see the final message.
- Graders use only what skill-harness still has after its two cuts: llm
  rubric, trace assertions, seeded diff, hidden post-test, assert.vitest,
  critical/B-series gating.

Order of work: skill-harness --specs overlay first, then one PR per
skill here, investigate last.
