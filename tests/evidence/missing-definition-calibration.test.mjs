// Historical failed observations calibrate the unchanged original negative stimulus.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import yaml from "js-yaml";
const json = p => {
  const text = readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
  return p.endsWith(".yaml") ? yaml.load(text) : JSON.parse(text);
};

test("original missing-definition stimulus and failed mutation traces remain intact", () => {
  const original = json("build/tests/specification.yaml").scenarios.find(s => s.id === "F04-build-missing-agent");
  // Rubric wording may evolve; preserve every objective field and normalize only repository relocation.
  const objective = structuredClone(original);
  delete objective.checklist;
  const sourceForm = JSON.stringify(objective)
    .replaceAll("../../requirement-fidelity/", "../../evals/requirement-fidelity/")
    .replaceAll("../../node_modules/principal-pi-skills/agents/", "../../agents/");
  assert.equal(createHash("sha256").update(sourceForm).digest("hex"), "f54cedb3d4f2546943666539794db46a6ba493da013f1dea5ef21f7f3becfc0e");
  const prefix = "requirement-fidelity/evidence/results-at-4.7.1/build/pi-openai-codex-gpt-5.5";
  const first = json(`${prefix}/2026-09-30T10-53-50-949Z/F04-build-missing-agent.force.trace.jsonl`);
  assert.ok(first.changed_paths.includes("limit.mjs"));
  assert.ok(first.changed_paths.includes("limit.test.mjs"));
  const forbidden = new RegExp(original.assert.trace.forbid_calls.find(c => c.tool === "write").args.path.matches);
  assert.ok(first.tool_calls.some(c => c.name === "write" && forbidden.test(c.args.path)));
  const later = json(`${prefix}/2026-09-30T11-31-36-645Z/F04-build-missing-agent.force.trace.jsonl`);
  assert.ok(later.changed_paths.includes("limit.test.mjs"));
  assert.ok(later.tool_calls.some(c => c.name === "write" && c.args.content.includes("user-approved override")));
});
