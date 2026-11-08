import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { FormPetaWilayahView } from '@/components/views/FormPetaWilayahView';
import { KartuHasil } from '@/components/ui/KartuHasil';
import { PetaSebaran } from '@/components/ui/PetaSebaran';
import type { ItemKatalog } from '@/shared/katalog';
import { aturPin, kunciTitik, type TitikSebaran } from '@/shared/peta';

function titik(ubah: Partial<TitikSebaran> = {}): TitikSebaran {
  return {
    tipe: 'project',
    id: 'sama',
    judul: 'Judul Project',
    kota: 'Demak',
    provinsi: 'Jawa Tengah',
    kategori: 'Clean water',
    latitude: -6.9,
    longitude: 110.5,
    targetDana: 1000,
    danaTerkumpul: 250,
    ...ubah,
  };
}

const project = titik();
const campaign = titik({ tipe: 'campaign', judul: 'Judul Campaign' });

function item(ubah: Partial<ItemKatalog> = {}): ItemKatalog {
  return {
    ...titik(),
    deskripsi: '',
    mulai: '2026-10-01',
    selesai: '2026-12-31',
    persenCapaian: 25,
    statusPelaksanaan: 'berjalan',
    terbukaDonasi: true,
    terbukaRelawan: false,
    kuotaRelawan: null,
    relawanDiterima: null,
    ...ubah,
  } as ItemKatalog;
}

/** judul (aria-label) pin yang sedang aktif ("pin on"). */
const pinAktif = (html: string) =>
  [...html.matchAll(/class="pin on"[^>]*aria-label="([^"]+)"/g)].map(
    (m) => m[1],
  );
const jumlahPin = (html: string) => (html.match(/class="pin/g) ?? []).length;
const render = (props: Parameters<typeof PetaSebaran>[0]) =>
  renderToStaticMarkup(createElement(PetaSebaran, props));

describe('identitas titik peta = tipe + id', () => {
  it('kunciTitik membedakan project dan campaign ber-id sama', () => {
    expect(kunciTitik(project)).toBe('project-sama');
    expect(kunciTitik(campaign)).toBe('campaign-sama');
    expect(kunciTitik(project)).not.toBe(kunciTitik(campaign));
  });

  it('aturPin menyimpan satu posisi per tipe+id, tidak saling menimpa', () => {
    const posisi = aturPin([project, campaign]);
    expect(Object.keys(posisi).sort()).toEqual([
      'campaign-sama',
      'project-sama',
    ]);
  });

  it('dua titik di koordinat yang sama tetap digeser agar bisa diklik masing-masing', () => {
    const posisi = aturPin([project, campaign]);
    const [a, b] = [posisi['project-sama'], posisi['campaign-sama']];
    expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeGreaterThanOrEqual(20);
  });

  it('kedua marker dirender', () => {
    expect(jumlahPin(render({ titik: [project, campaign] }))).toBe(2);
  });

  it('memilih marker campaign membuka popup campaign, bukan project', () => {
    const html = render({
      titik: [project, campaign],
      terpilihKunci: 'campaign-sama',
    });
    expect(html).toContain('<strong style="font-size:17px">Judul Campaign');
    expect(html).not.toContain('<strong style="font-size:17px">Judul Project');
    expect(html).toContain('href="/campaign/sama"');
    expect(pinAktif(html)).toEqual(['Judul Campaign, Demak']);
  });

  it('memilih marker project membuka popup project', () => {
    const html = render({
      titik: [campaign, project],
      terpilihKunci: 'project-sama',
    });
    expect(html).toContain('<strong style="font-size:17px">Judul Project');
    expect(html).toContain('href="/project/sama"');
    expect(pinAktif(html)).toEqual(['Judul Project, Demak']);
  });

  it('menyorot satu jenis tidak ikut menyorot jenis lain yang id-nya sama', () => {
    const html = render({
      titik: [project, campaign],
      terpilihKunci: null,
      sorotKunci: 'campaign-sama',
    });
    expect(pinAktif(html)).toEqual(['Judul Campaign, Demak']);
  });

  it('kunci yang tidak cocok tidak membuka popup', () => {
    const html = render({
      titik: [project, campaign],
      terpilihKunci: 'sama',
    });
    expect(html).not.toContain('map-pop');
    expect(pinAktif(html)).toEqual([]);
  });

  it('wrapper Explore: hasil project dan campaign ber-id sama sama-sama dipetakan', () => {
    const html = renderToStaticMarkup(
      createElement(FormPetaWilayahView, {
        hasil: [item(), item({ tipe: 'campaign', judul: 'Judul Campaign' })],
        terpilihKunci: 'campaign-sama',
        sorotKunci: null,
        onPilih: () => {},
      }),
    );
    expect(jumlahPin(html)).toBe(2);
    expect(html).toContain('href="/campaign/sama"');
    expect(pinAktif(html)).toEqual(['Judul Campaign, Demak']);
  });

  it('hover kartu mengirim kunci tipe+id, supaya hanya marker jenis itu yang menyala', () => {
    const onHover = vi.fn();
    const kartu = KartuHasil({
      item: item({ tipe: 'campaign' }),
      onHover,
    }) as ReactElement<{ onMouseEnter: () => void; onFocus: () => void }>;
    kartu.props.onMouseEnter();
    kartu.props.onFocus();
    expect(onHover).toHaveBeenNthCalledWith(1, 'campaign-sama');
    expect(onHover).toHaveBeenNthCalledWith(2, 'campaign-sama');
  });
});
