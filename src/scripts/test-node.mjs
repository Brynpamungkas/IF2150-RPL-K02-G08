import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

/** @param {string} directory @returns {Promise<string[]>} */
export async function findNodeTests(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findNodeTests(path)));
    else if (entry.isFile() && entry.name.endsWith('.test.ts'))
      files.push(path);
  }
  return files.sort();
}

async function main() {
  const app = fileURLToPath(new URL('../', import.meta.url));
  const files = await findNodeTests(join(app, 'tests'));
  if (files.length === 0)
    throw new Error('Tidak ada file node:test (*.test.ts).');
  const child = spawnSync(
    process.execPath,
    ['--import', 'tsx', '--test', ...process.argv.slice(2), ...files],
    { cwd: app, stdio: 'inherit', env: process.env },
  );
  if (child.error) throw child.error;
  process.exitCode = child.status ?? 1;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
