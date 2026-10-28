// Offline preparation only. Review these authored labels before any judge call.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadSpec, prepareCalibration } from '@skill-harness/core';

for (const skill of ['decide', 'architect', 'test-review']) {
  const directory = new URL(`../suites/transfer/${skill}/tests/`, import.meta.url);
  const specPath = fileURLToPath(new URL('specification.yaml', directory));
  const spec = loadSpec(specPath);
  const controls = JSON.parse(readFileSync(new URL('controls.json', directory), 'utf8'))
    .map(({ answer, ...control }) => ({
      ...control,
      transcript: `>>> USER:\n${spec.scenarios.find(scenario => scenario.id === control.scenarioId).turns[0]}\n\n<<< ASSISTANT:\n${answer}\n`,
    }));
  const prepared = prepareCalibration({
    specPath,
    manifestPath: fileURLToPath(new URL('calibration-proposed.json', directory)),
    controls,
  });
  console.log(JSON.stringify({ skill, ready: prepared.ready, issues: prepared.issues, providerCalls: 0 }));
}
