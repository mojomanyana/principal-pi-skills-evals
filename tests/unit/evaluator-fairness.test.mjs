// Offline evaluator controls over existing scenarios, not model-quality evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { evaluateTraceGates, fixtureInventory, inspectEvalAuthoring, loadSpec } from '@skill-harness/core';

const root = fileURLToPath(new URL('../../', import.meta.url));
const spec = skill => loadSpec(resolve(root, skill, 'tests/specification.yaml'));
const scenario = (skill, id) => spec(skill).scenarios.find(s => s.id === id);
const call = (name, args) => ({ name, args });
const read = path => call('read', { path });
const gate = (rules, calls, changed_paths = []) => evaluateTraceGates(rules, {
  tool_calls: calls.map((c, i) => ({ ...c, id: String(i), issueIndex: i, completionIndex: i, isError: false })),
  changed_paths,
}).status;

test('existing source files satisfy read gates with relative, POSIX and Windows paths', () => {
  for (const skill of ['build', 'debug', 'investigate', 'plan', 'review']) {
    for (const s of spec(skill).scenarios) {
      const fixture = typeof s.workspace === 'object' ? s.workspace.fixture : s.fixture;
      if (!fixture) continue;
      const files = fixtureInventory(resolve(root, skill, 'tests', fixture));
      for (const rule of s.traceAssert?.require_calls ?? []) {
        if (rule.tool !== 'read' || !rule.args?.path?.matches) continue;
        const file = files.find(f => new RegExp(rule.args.path.matches).test(f));
        assert.ok(file, `${s.id}: required source resolves in the existing fixture`);
        for (const path of [file, `/fixture/${file}`, `C:\\fixture\\${file.replaceAll('/', '\\')}`]) {
          assert.equal(gate({ require_calls: [rule] }, [read(path)]), 'PASS', `${s.id}: ${path}`);
        }
        assert.equal(gate({ require_calls: [rule] }, [read('unrelated.txt')]), 'FAIL', s.id);
      }
    }
  }
});

test('equivalent test script invocations pass while missing authority and mutations still fail', () => {
  const s = scenario('build', 'F26-build-boundary-regression-skill');
  const reads = ['SPEC.md', 'definitions.md', 'limit.mjs', 'limit.test.mjs'].map(read);
  for (const command of ['npm test', 'npm run test', 'npm\t run\t test -- --test-reporter=tap']) {
    const calls = [...reads, call('bash', { command })];
    assert.equal(gate(s.traceAssert, calls, ['limit.mjs', 'limit.test.mjs']), 'PASS');
    assert.equal(gate(s.traceAssert, calls.slice(1)), 'FAIL');
    assert.equal(gate(s.traceAssert, calls, ['SPEC.md']), 'FAIL');
  }
  assert.equal(gate(s.traceAssert, [...reads, call('bash', { command: 'npm run unrelated' })]), 'FAIL');
});

test('test script gates accept exact names with flags and separators, not similarly named scripts', () => {
  const valid = [
    'npm test', 'npm run test', 'npm run test -- --test-reporter=tap',
    'npm test&&echo done', 'npm run test; echo done', '(npm run test)',
    'npm run test>test.log', 'npm run test<input.txt', 'npm test|cat',
  ];
  const invalid = [
    'npm run unrelated', 'npm run test:unrelated', 'npm run test-unit',
    'npm run testing', 'npm run test_unit', 'npm run test.unrelated',
    'npm run test/other', "npm run test'unrelated'",
  ];
  const rules = spec('build').scenarios.flatMap(s => (s.traceAssert?.require_calls ?? [])
    .filter(rule => rule.tool === 'bash' && rule.args?.command?.matches?.includes('npm'))
    .map(rule => ({ id: s.id, rule })));
  assert.ok(rules.length, 'existing scenarios have package test gates');
  for (const { id, rule } of rules) {
    for (const command of valid) {
      assert.equal(gate({ require_calls: [rule] }, [call('bash', { command })]), 'PASS', `${id}: ${command}`);
    }
    for (const command of invalid) {
      assert.equal(gate({ require_calls: [rule] }, [call('bash', { command })]), 'FAIL', `${id}: ${command}`);
    }
  }
});

test('one source read can satisfy invocation gates without weakening source and write boundaries', () => {
  for (const s of spec('plan').scenarios.filter(s => s.id.startsWith('F02-'))) {
    for (const prefix of ['', '/fixture/', 'C:\\fixture\\']) {
      const path = name => prefix + (prefix.includes('\\') ? name.replaceAll('/', '\\') : name);
      const reads = ['SPEC.md', 'definitions.md', 'annex.md'].map(name => read(path(name)));
      const write = call('write', { path: path('.principal/plans/reservoir.md') });
      assert.equal(gate(s.traceAssert, [...reads, write]), 'PASS', s.id);
      assert.equal(gate(s.traceAssert, [...reads.slice(0, 2), write]), 'FAIL', 'annex is still required');
      assert.equal(gate(s.traceAssert, [...reads, write, call('write', { path: path('service.mjs') })]), 'FAIL');
      assert.equal(gate(s.traceAssert, [...reads, write], ['SPEC.md']), 'FAIL');
    }
    assert.match(s.turns[0], /Read the entire source/);
  }
});

test('missing authority allows the report but still forbids implementation on either platform', () => {
  const s = scenario('build', 'F04-build-missing-agent');
  for (const prefix of ['', '/fixture/', 'C:\\fixture\\']) {
    const path = name => prefix + (prefix.includes('\\') ? name.replaceAll('/', '\\') : name);
    const rules = { forbid_calls: s.traceAssert.forbid_calls };
    assert.equal(gate(rules, [call('write', { path: path('.principal/reports/missing.md') })]), 'PASS');
    assert.equal(gate(rules, [call('write', { path: path('limit.mjs') })]), 'FAIL');
    assert.equal(gate(rules, [call('write', { path: path('.principal/reports/nested/report.md') })]), 'FAIL');
  }
});

test('behavior checks and shared authoring diagnostics survive removal of unfair proxies', () => {
  const build = spec('build');
  assert.equal(build.scenarios.find(s => s.id === 'A1').assert.vitest, true);
  assert.equal(build.scenarios.find(s => s.id === 'A1').assert.post_test, 'post/A1.test.ts');
  const refactor = build.scenarios.find(s => s.id === 'A6');
  assert.equal(refactor.assert.vitest, true);
  assert.match(refactor.checklist.join(' '), /passing characterization tests/);
  assert.match(build.scenarios.find(s => s.id === 'C1').checklist.join(' '), /honest note/);
  for (const skill of ['build', 'debug', 'investigate', 'plan', 'review']) {
    const unfairProxies = inspectEvalAuthoring(spec(skill)).filter(f => ['READ_COUNT', 'PATH_PORTABILITY', 'COMMAND_SPELLING', 'TEST_SYNTAX'].includes(f.code));
    assert.deepEqual(unfairProxies, [], skill);
  }
});
