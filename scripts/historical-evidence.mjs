import { createHash } from 'node:crypto';
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { describeSourceKey, failsGate, readResults, remedyForKey } from '@skill-harness/core';

export const BASELINE_COMMIT = '3e40cdd5350efd866f8de2b046433393daca6a53';
// Changing the archive requires an explicit review of this pin and the manifest.
export const MANIFEST_SHA256 = '1d6ee5adc6c44404139db75348ca9fe84b9c3efa730e4b37977cc19bcb96cfd3';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export function readHistoricalManifest(bytes) {
  if (sha256(bytes) !== MANIFEST_SHA256) throw new Error('Historical manifest changed: explicit archive-policy review is required.');
  const manifest = JSON.parse(bytes);
  if (manifest.schema !== 1 || manifest.baseline_commit !== BASELINE_COMMIT) throw new Error('Unexpected historical manifest identity.');
  return manifest;
}

export function verifyHistoricalRun(root, run) {
  let ancestor = root;
  for (const segment of run.path.split('/')) {
    ancestor = join(ancestor, segment);
    const stat = lstatSync(ancestor);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Historical evidence directory changed: ${run.path}`);
  }
  const actual = [];
  const walk = path => {
    const stat = lstatSync(join(root, path));
    if (stat.isSymbolicLink()) throw new Error(`Historical evidence cannot be a symlink: ${path}`);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(join(root, path)).sort()) walk(`${path}/${entry}`);
    } else if (stat.isFile()) {
      actual.push({ path, sha256: sha256(readFileSync(join(root, path))) });
    } else throw new Error(`Historical evidence is not a regular file: ${path}`);
  };
  walk(run.path);
  actual.sort((a, b) => a.path.localeCompare(b.path));
  if (JSON.stringify(actual) !== JSON.stringify(run.files)) {
    throw new Error(`Historical evidence changed, was added, or is missing: ${run.path}`);
  }
}

const findingIdentity = finding => JSON.stringify([finding.skill, finding.scenario, finding.code, finding.message]);

// Harness currently exposes textual stale findings. Match the COMPLETE known
// messages, including exact verified run path and scenario; unknown forms fail
// closed. Never exempt stimulus, skill, fixture, policy, persona or unreadable sources.
export function historicalFindingIdentities(root, runs) {
  const identities = new Set();
  for (const run of runs) {
    const runDir = join(root, run.path);
    const hashes = readResults(runDir).source_hashes ?? {};
    const skill = run.path.split('/')[0];
    const tag = basename(dirname(runDir));
    for (const [key, digest] of Object.entries(hashes)) {
      const match = /^(?:gates|rubric):([A-Za-z][A-Za-z0-9_-]*)$/.exec(key);
      if (!match || !/^[a-f0-9]{64}$/.test(digest)) continue;
      const what = describeSourceKey(key);
      for (const message of [
        `${what} changed since the newest ${tag} run (${runDir}) — results are stale; ${remedyForKey(key)}`,
        `${what} no longer exists but the newest ${tag} run measured it (${runDir})`,
      ]) identities.add(findingIdentity({ skill, scenario: match[1], code: 'stale', message }));
    }
  }
  return identities;
}

export function classifyFindings(findings, historicalIdentities) {
  const historical = [], errors = [], information = [];
  for (const finding of findings) {
    if (historicalIdentities.has(findingIdentity(finding))) historical.push(finding);
    else if (failsGate(finding)) errors.push(finding);
    else information.push(finding);
  }
  return { errors, historical, information };
}
