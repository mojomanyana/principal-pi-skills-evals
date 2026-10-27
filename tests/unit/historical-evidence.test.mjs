// Offline archive-policy controls. These make no model/readiness claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { failsGate, lintSkill } from '@skill-harness/core';
import { classifyFindings, historicalFindingIdentities, readHistoricalManifest, verifyHistoricalRun } from '../../scripts/historical-evidence.mjs';
import { lintForCi } from '../../scripts/lint-ci.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const manifestBytes = readFileSync(join(root, 'audit/historical-results.json'));
const manifest = readHistoricalManifest(manifestBytes);
const identities = historicalFindingIdentities(root, manifest.runs);
const temporaryRoot = t => {
  const path = mkdtempSync(join(tmpdir(), 'principal-archive-test-'));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
};
const copy = (from, to) => { mkdirSync(dirname(to), { recursive: true }); copyFileSync(from, to); };

test('real corpus preserves all 160 strict errors as historical notices, without changing native severity', () => {
  const report = lintForCi(root);
  assert.equal(report.ok, true, JSON.stringify(report.errors));
  assert.deepEqual(report.integrity_errors, []);
  assert.equal(manifest.runs.length, 53);
  assert.equal(report.historical.length, 160);
  assert.ok(report.historical.every(finding => finding.code === 'stale' && failsGate(finding)));
  assert.ok(report.information.length >= 3);
  assert.match(report.qualification, /not current evaluator or Principal qualification/);
});

test('altered hashes, removed entries and added run enrollments require explicit policy review', () => {
  for (const change of [
    value => { value.runs[0].files[0].sha256 = '0'.repeat(64); },
    value => { value.runs.pop(); },
    value => { value.runs.push({ path: 'build/tests/results/new/2099-01-01', files: [] }); },
  ]) {
    const value = JSON.parse(manifestBytes);
    change(value);
    assert.throws(() => readHistoricalManifest(Buffer.from(JSON.stringify(value))), /explicit archive-policy review/);
  }
});

test('archived evidence edits, deletions and added files fail integrity', t => {
  const temp = temporaryRoot(t);
  const run = manifest.runs[0];
  for (const file of run.files) copy(join(root, file.path), join(temp, file.path));
  assert.doesNotThrow(() => verifyHistoricalRun(temp, run));
  const file = run.files[0].path;
  writeFileSync(join(temp, file), 'altered score or transcript\n');
  assert.throws(() => verifyHistoricalRun(temp, run), /Historical evidence changed/);
  rmSync(join(temp, file));
  assert.throws(() => verifyHistoricalRun(temp, run), /Historical evidence changed/);
  copy(join(root, file), join(temp, file));
  writeFileSync(join(temp, run.path, 'new-evidence.txt'), 'added evidence');
  assert.throws(() => verifyHistoricalRun(temp, run), /Historical evidence changed/);
});

test('a symlinked archive ancestor fails integrity', { skip: process.platform === 'win32' }, t => {
  const temp = temporaryRoot(t);
  const run = manifest.runs[0];
  const skill = run.path.split('/')[0];
  symlinkSync(join(root, skill), join(temp, skill), 'dir');
  assert.throws(() => verifyHistoricalRun(temp, run), /Historical evidence directory changed/);
});

test('new stale and malformed result records retain native errors and get no historical exception', t => {
  const temp = temporaryRoot(t);
  const testsDir = join(temp, 'build/tests');
  copy(join(root, 'build/tests/specification.yaml'), join(testsDir, 'specification.yaml'));
  const historicalRun = manifest.runs.find(run => run.path.startsWith('build/') && run.path.includes('deepseek'));
  const runDir = join(testsDir, 'results/new-subject/2099-01-01T00-00-00-000Z');
  copy(join(root, historicalRun.path, 'results.yaml'), join(runDir, 'results.yaml'));
  const skillDir = join(root, 'node_modules/principal-pi-skills/build');
  const findings = lintSkill(skillDir, testsDir);
  assert.ok(findings.some(finding => finding.code === 'stale' && finding.message.includes(runDir)));
  const classified = classifyFindings(findings, identities);
  assert.equal(classified.historical.length, 0);
  assert.ok(classified.errors.some(finding => finding.code === 'stale'));
  writeFileSync(join(runDir, 'results.yaml'), 'schema: 2\nscenarios: null\n');
  const malformed = classifyFindings(lintSkill(skillDir, testsDir), identities);
  assert.ok(malformed.errors.some(finding => finding.code === 'consistency' && finding.message.includes(runDir)));
  assert.equal(malformed.historical.length, 0);
});

test('only complete known gate/rubric stale messages qualify, never other error classes', () => {
  const [skill, scenario, code, message] = JSON.parse(identities.values().next().value);
  const known = { skill, scenario, code, message };
  assert.equal(classifyFindings([known], identities).historical.length, 1);
  const errors = [
    { ...known, code: 'consistency' }, { ...known, code: 'spec' },
    { ...known, skill: 'unlisted-skill' }, { ...known, scenario: 'unlisted-scenario' },
    { ...known, message: `${message}; unknown new condition` },
    ...['stimulus', 'scoring policy', 'fixture', 'judge persona', 'unreadable source'].map(kind => ({
      ...known, message: message.replace(/the (?:rubric|gates)/, `the ${kind}`),
    })),
  ];
  const classified = classifyFindings(errors, identities);
  assert.equal(classified.errors.length, errors.length);
  assert.equal(classified.historical.length, 0);
});
