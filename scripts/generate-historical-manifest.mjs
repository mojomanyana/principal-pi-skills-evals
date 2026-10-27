// Review-time inventory only. CI never enrolls records automatically.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const baseline = '3e40cdd5350efd866f8de2b046433393daca6a53';
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024 });
const entries = git('ls-tree', '-rz', '--full-tree', baseline).toString('utf8')
  .split('\0').filter(Boolean).map(line => {
    const [metadata, path] = line.split('\t');
    const [mode, type, oid] = metadata.split(' ');
    return { mode, type, oid, path };
  });
const runs = entries.filter(e => /^[^/]+\/tests\/results\/[^/]+\/[^/]+\/results\.yaml$/.test(e.path))
  .map(e => e.path.slice(0, -'/results.yaml'.length)).sort();
const manifest = {
  schema: 1,
  baseline_commit: baseline,
  qualification: 'Historical frozen-rubric evidence only; not current evaluator or Principal qualification.',
  runs: runs.map(path => ({
    path,
    files: entries.filter(e => e.path.startsWith(`${path}/`)).map(e => {
      if (e.type !== 'blob' || e.mode !== '100644') throw new Error(`Unsupported archive entry: ${e.path}`);
      return { path: e.path, sha256: createHash('sha256').update(git('cat-file', 'blob', e.oid)).digest('hex') };
    }).sort((a, b) => a.path.localeCompare(b.path)),
  })),
};
process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
