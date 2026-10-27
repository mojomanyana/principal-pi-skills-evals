import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { discover, lintSkill } from '@skill-harness/core';
import { BASELINE_COMMIT, MANIFEST_SHA256, classifyFindings, historicalFindingIdentities, readHistoricalManifest, verifyHistoricalRun } from './historical-evidence.mjs';

const defaultRoot = fileURLToPath(new URL('../', import.meta.url));

export function lintForCi(root = defaultRoot) {
  const integrityErrors = [];
  let manifest, historicalIdentities = new Set();
  try {
    manifest = readHistoricalManifest(readFileSync(join(root, 'audit/historical-results.json')));
    const verified = [];
    for (const run of manifest.runs) {
      try { verifyHistoricalRun(root, run); verified.push(run); }
      catch (error) { integrityErrors.push(String(error.message)); }
    }
    historicalIdentities = historicalFindingIdentities(root, verified);
  } catch (error) { integrityErrors.push(String(error.message)); }

  const findings = [];
  try {
    const skills = discover(join(root, 'node_modules/principal-pi-skills'), root);
    // A removed spec or an uninstalled skill must not silently disappear from CI.
    const expected = new Set((manifest?.runs ?? []).map(run => run.path.split('/')[0]));
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(join(root, entry.name, 'tests/specification.yaml'))) expected.add(entry.name);
    }
    for (const name of expected) {
      if (!skills.some(skill => skill.name === name && skill.hasSpec)) {
        findings.push({ skill: name, code: 'spec', message: 'Expected skill/spec pair is missing or has duplicate specifications.' });
      }
    }
    for (const skill of skills.filter(skill => skill.hasSpec)) findings.push(...lintSkill(skill.dir, skill.testsDir));
  } catch (error) { findings.push({ skill: 'all', code: 'lint-error', message: String(error.message) }); }
  const classified = classifyFindings(findings, historicalIdentities);
  return {
    qualification: 'Historical frozen-rubric evidence only; CI success is not current evaluator or Principal qualification.',
    baseline_commit: BASELINE_COMMIT,
    manifest_sha256: MANIFEST_SHA256,
    integrity_errors: integrityErrors,
    ...classified,
    ok: integrityErrors.length === 0 && classified.errors.length === 0,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length !== 0 && (args.length !== 2 || args[0] !== '--report')) throw new Error('Usage: node scripts/lint-ci.mjs [--report FILE]');
  const report = lintForCi();
  if (args.length) writeFileSync(args[1], `${JSON.stringify(report, null, 2)}\n`);
  for (const error of report.integrity_errors) console.error(`ERROR archive: ${error}`);
  for (const [label, findings] of [['ERROR', report.errors], ['HISTORICAL ONLY', report.historical], ['INFO', report.information]]) {
    for (const finding of findings) console.log(`${label} ${finding.skill}${finding.scenario ? `/${finding.scenario}` : ''} [${finding.code}]: ${finding.message}`);
  }
  console.log(`${report.errors.length + report.integrity_errors.length} errors; ${report.historical.length} historical findings; ${report.information.length} informational findings. ${report.qualification}`);
  process.exitCode = report.ok ? 0 : 1;
}
