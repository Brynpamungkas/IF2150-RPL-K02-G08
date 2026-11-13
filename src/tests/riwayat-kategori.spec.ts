import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TabRiwayat } from '@/components/views/RiwayatView/TabRiwayat';
import { DetailRiwayatView } from '@/components/views/RiwayatView/DetailRiwayatView';
import {
  gabungkanRiwayat,
  saringRiwayat,
  type ItemRiwayatTopup,
  type ItemRiwayatRelawan,
} from '@/shared/riwayat';

const topup: ItemRiwayatTopup = {
  jenis: 'topup',
  id: 'topup-own',
  waktu: '2026-11-13T11:00:00Z',
  nominal: 50000,
  metode: 'Bank transfer (simulated)',
};
const relawan: ItemRiwayatRelawan = {
  jenis: 'relawan',
  id: 'apply-own',
  waktu: '2026-11-13T10:00:00Z',
  idProject: 'project',
  namaProject: 'Volunteer project',
  status: 'accepted',
  tanggalKeputusan: '2026-11-13T12:00:00Z',
};

describe('kategori riwayat Account', () => {
  it('menampilkan kelima filter prototipe', () => {
    const html = renderToStaticMarkup(createElement(TabRiwayat));
    for (const label of [
      'All',
      'Donations',
      'Top-ups',
      'Volunteering',
      'Progress',
    ])
      expect(html).toContain(`>${label}</button>`);
  });
  it('menggabungkan dan menyaring kategori tambahan tanpa mengubah data asal', () => {
    const items = gabungkanRiwayat([], [], [topup], [relawan]);
    expect(items.map((item) => item.id)).toEqual(['topup-own', 'apply-own']);
    expect(saringRiwayat(items, 'topup')).toEqual([topup]);
    expect(saringRiwayat(items, 'relawan')).toEqual([relawan]);
    expect(saringRiwayat(items, 'transaksi')).toEqual([]);
  });
  it('detail top-up menampilkan nominal dan metode pembayaran', () => {
    const html = renderToStaticMarkup(
      createElement(DetailRiwayatView, { item: topup, onTutup: () => {} }),
    );
    expect(html).toContain('Top-up');
    expect(html).toContain('Bank transfer (simulated)');
    expect(html).toContain('50,000');
  });
  it('detail volunteering menampilkan keputusan dan tautan project', () => {
    const html = renderToStaticMarkup(
      createElement(DetailRiwayatView, { item: relawan, onTutup: () => {} }),
    );
    expect(html).toContain('Accepted');
    expect(html).toContain('href="/project/project"');
    expect(html).toContain('Decision recorded');
  });
});
