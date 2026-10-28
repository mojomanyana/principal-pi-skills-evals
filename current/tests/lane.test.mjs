import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { evaluateTraceGates, loadCalibration, loadSpec } from '@skill-harness/core';

const root = fileURLToPath(new URL('../', import.meta.url));
const json = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const spec = (suite, skill) => loadSpec(resolve(root, 'suites', suite, skill, 'tests/specification.yaml'));

test('current and historical dependency lanes stay distinct and imported synthetic inputs retain their reviewed identity', () => {
  const current = json('package.json');
  const historical = json('../package.json');
  assert.equal(current.devDependencies['principal-pi-skills'], '4.14.0');
  assert.equal(current.devDependencies['skill-harness'], '0.32.3');
  assert.equal(historical.devDependencies['principal-pi-skills'], '4.7.2');
  assert.equal(historical.devDependencies['skill-harness'], '0.32.1');
  const provenance = json('provenance.json');
  for (const file of provenance.files) {
    assert.equal(createHash('sha256').update(readFileSync(resolve(root, file.path))).digest('hex'), file.sha256, file.path);
  }
  for (const file of json('history/transfer-initial-20261028/inventory.json')) {
    assert.equal(createHash('sha256').update(readFileSync(resolve(root, file.path))).digest('hex'), file.sha256, file.path);
  }
  assert.match(provenance.historicalObservation.interpretation, /Post-hoc/);
  const skills = ['decide', 'architect', 'test-review'];
  assert.equal(skills.reduce((sum, skill) => sum + spec('accepted', skill).scenarios.length, 0), 6);
  assert.equal(skills.reduce((sum, skill) => sum + spec('transfer', skill).scenarios.length, 0), 3);
});

test('all readonly review gates reject missing/failed reads, changed inputs and incomplete evidence on both path styles', () => {
  const scenarios = ['accepted', 'transfer'].flatMap(suite => spec(suite, 'test-review').scenarios);
  for (const scenario of scenarios) {
    const files = scenario.traceAssert.unchanged_paths;
    for (const prefix of ['', '/fixture/', 'C:\\fixture\\']) {
      const calls = files.map((file, index) => ({
        name: 'read', args: { path: prefix + file }, id: String(index),
        issueIndex: index, completionIndex: index, isError: false,
      }));
      const grade = (tool_calls, changed_paths = []) => evaluateTraceGates(scenario.traceAssert, { tool_calls, changed_paths }).status;
      assert.equal(grade(calls), 'PASS', scenario.id);
      assert.equal(grade(calls.slice(1)), 'FAIL', 'an omitted source cannot pass');
      assert.equal(grade(calls.map((call, index) => index ? call : { ...call, isError: true })), 'FAIL');
      assert.equal(grade(calls, [files[0]]), 'FAIL');
      assert.equal(grade(calls, null), 'ERROR');
      assert.equal(grade(calls.map(({ completionIndex, ...call }) => call)), 'ERROR');
    }
  }
});

test('new transfer controls remain proposed and use shared bound calibration with ordered votes and equivalent answers', () => {
  for (const skill of ['decide', 'architect', 'test-review']) {
    const manifest = loadCalibration(resolve(root, 'suites/transfer', skill, 'tests/calibration-proposed.json'));
    assert.equal(manifest.ready, false);
    assert.equal(manifest.controls.length, 3);
    assert.equal(manifest.issues.length, 3);
    assert.ok(manifest.issues.every(issue => issue.endsWith('expected label needs author review')));
    assert.ok(manifest.controls.every(control => control.review.status === 'proposed' && control.executionEvidence === 'unknown'));
    assert.equal(manifest.controls.filter(control => control.kind === 'equivalent').length, 1);
    assert.ok(manifest.controls.every(control => control.expectedCriteria.length === manifest.spec.scenarios[0].checklist.length));
  }
});
