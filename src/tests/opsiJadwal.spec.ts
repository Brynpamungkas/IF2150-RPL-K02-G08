import { describe, expect, it } from 'vitest';
import {
  MAKS_HARI,
  opsiJadwal,
} from '@/components/views/RelawanView/opsiJadwal';

const HARI_INI = new Date('2026-11-01T10:00:00Z');

describe('opsiJadwal (C33, pilihan hari pada formulir relawan)', () => {
  it('menawarkan satu butir bila mulai sama dengan selesai', () => {
    const { hari, terpotong } = opsiJadwal(
      '2026-11-08',
      '2026-11-08',
      HARI_INI,
    );
    expect(hari).toEqual(['Sun 8 Nov 2026']);
    expect(terpotong).toBe(false);
  });

  it('tanpa koma agar tidak bentrok dengan pemisah basis data', () => {
    const { hari } = opsiJadwal('2026-11-08', '2026-11-09', HARI_INI);
    expect(hari).toEqual(['Sun 8 Nov 2026', 'Mon 9 Nov 2026']);
    expect(hari.join('')).not.toMatch(/[,;]/);
  });

  it('kosong bila selesai lebih awal dari mulai', () => {
    expect(opsiJadwal('2026-11-10', '2026-11-08', HARI_INI)).toEqual({
      hari: [],
      terpotong: false,
    });
  });

  it('kosong bila mulai null atau tidak terbaca', () => {
    expect(opsiJadwal(null, '2026-11-08', HARI_INI).hari).toEqual([]);
    expect(opsiJadwal('bukan-tanggal', null, HARI_INI).hari).toEqual([]);
  });

  it('memakai mulai sebagai selesai bila selesai null', () => {
    expect(opsiJadwal('2026-11-08', null, HARI_INI).hari).toEqual([
      'Sun 8 Nov 2026',
    ]);
  });

  it('membatasi pada MAKS_HARI dan menandai terpotong', () => {
    const { hari, terpotong } = opsiJadwal(
      '2026-11-08',
      '2026-12-31',
      HARI_INI,
    );
    expect(hari).toHaveLength(MAKS_HARI);
    expect(hari[0]).toBe('Sun 8 Nov 2026');
    expect(terpotong).toBe(true);
  });

  it('tidak menandai terpotong bila tepat MAKS_HARI hari', () => {
    const { hari, terpotong } = opsiJadwal(
      '2026-11-08',
      '2026-11-21',
      HARI_INI,
    );
    expect(hari).toHaveLength(MAKS_HARI);
    expect(terpotong).toBe(false);
  });

  it('melewati hari yang sudah lewat (dimulai dari hari ini)', () => {
    const { hari } = opsiJadwal(
      '2026-11-08',
      '2026-11-12',
      new Date('2026-11-10T03:00:00Z'),
    );
    expect(hari).toEqual([
      'Tue 10 Nov 2026',
      'Wed 11 Nov 2026',
      'Thu 12 Nov 2026',
    ]);
  });

  it('kosong bila seluruh periode sudah lewat', () => {
    const { hari } = opsiJadwal(
      '2026-11-08',
      '2026-11-09',
      new Date('2026-11-20T00:00:00Z'),
    );
    expect(hari).toEqual([]);
  });
});
