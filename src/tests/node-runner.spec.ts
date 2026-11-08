import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { findNodeTests } from '../scripts/test-node.mjs';

let root: string;
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'klimpool-test-discovery-'));
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('penemuan node:test lintas platform pada Node 20', () => {
  it('menemukan tes aksi dan donasi termasuk subfolder dengan urutan stabil', async () => {
    await mkdir(join(root, 'nested'));
    for (const file of [
      'donasi.test.ts',
      'aksi.test.ts',
      'nested/baru.test.ts',
    ]) {
      await writeFile(join(root, file), '');
    }
    expect(
      (await findNodeTests(root)).map((file) => relative(root, file)),
    ).toEqual([
      'aksi.test.ts',
      'donasi.test.ts',
      join('nested', 'baru.test.ts'),
    ]);
  });
  it('tidak menyerahkan test Vitest atau berkas lain ke runner node:test', async () => {
    for (const file of ['katalog.spec.ts', 'helper.ts', 'aksi.test.ts'])
      await writeFile(join(root, file), '');
    expect(await findNodeTests(root)).toEqual([join(root, 'aksi.test.ts')]);
  });
  it('tidak mengikuti symlink direktori sehingga tidak berulang keluar pohon tes', async () => {
    await writeFile(join(root, 'aksi.test.ts'), '');
    await symlink(root, join(root, 'loop'), 'dir');
    expect(await findNodeTests(root)).toEqual([join(root, 'aksi.test.ts')]);
  });
  it('direktori kosong menghasilkan daftar kosong dan root yang hilang ditolak', async () => {
    expect(await findNodeTests(root)).toEqual([]);
    await expect(findNodeTests(join(root, 'missing'))).rejects.toThrow();
  });
});
