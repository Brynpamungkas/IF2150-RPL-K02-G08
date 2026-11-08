'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useToast } from '@/components/ui/Toast';
import type { Aksi, DataAksi, JenisAksi } from '@/shared/aksi';
import { GalatValidasi } from '@/shared/galat';
import { apiAksi } from './apiAksi';

type Kunci = Exclude<keyof DataAksi, 'rincianDana'>;
type Isian = Record<Kunci, string>;
type Kolom = {
  kunci: Kunci;
  label: string;
  tipe?: 'textarea' | 'date' | 'number';
  wajib?: boolean;
  maks?: number;
};
const INFORMASI: Kolom[] = [
  { kunci: 'judul', label: 'Judul', wajib: true, maks: 200 },
  {
    kunci: 'deskripsi',
    label: 'Deskripsi',
    tipe: 'textarea',
    wajib: true,
    maks: 10000,
  },
  { kunci: 'kategori', label: 'Kategori', maks: 50 },
  { kunci: 'provinsi', label: 'Provinsi', wajib: true, maks: 100 },
  { kunci: 'kota', label: 'Kota / kabupaten', wajib: true, maks: 150 },
  { kunci: 'latitude', label: 'Latitude (opsional)', tipe: 'number' },
  { kunci: 'longitude', label: 'Longitude (opsional)', tipe: 'number' },
];
const PERIODE: Kolom[] = [
  { kunci: 'mulai', label: 'Tanggal mulai', tipe: 'date', wajib: true },
  { kunci: 'selesai', label: 'Tanggal selesai', tipe: 'date', wajib: true },
];
const KEBUTUHAN: Kolom[] = [
  {
    kunci: 'targetDana',
    label: 'Kebutuhan dana (Rp)',
    tipe: 'number',
    wajib: true,
  },
  {
    kunci: 'kebutuhan',
    label: 'Kebutuhan logistik',
    tipe: 'textarea',
    wajib: true,
    maks: 10000,
  },
  {
    kunci: 'kriteriaRelawan',
    label: 'Kriteria relawan',
    tipe: 'textarea',
    wajib: true,
    maks: 10000,
  },
  {
    kunci: 'kuotaRelawan',
    label: 'Kuota relawan',
    tipe: 'number',
    wajib: true,
  },
  ...PERIODE,
  { kunci: 'lokasiKumpul', label: 'Titik kumpul', wajib: true, maks: 255 },
];
function awal(aksi?: Aksi): Isian {
  const kosong: Isian = {
    judul: '',
    deskripsi: '',
    tujuan: '',
    kategori: '',
    provinsi: '',
    kota: '',
    latitude: '',
    longitude: '',
    targetDana: '',
    mulai: '',
    selesai: '',
    kebutuhan: '',
    kriteriaRelawan: '',
    kuotaRelawan: '',
    lokasiKumpul: '',
  };
  if (aksi)
    for (const kunci of Object.keys(kosong) as Kunci[])
      kosong[kunci] = String(aksi[kunci] ?? '');
  return kosong;
}

export function FormAksi({ jenis, aksi }: { jenis: JenisAksi; aksi?: Aksi }) {
  const router = useRouter();
  const { showToast } = useToast();
  const prefix = useId();
  const [isian, setIsian] = useState(() => awal(aksi));
  const [id, setId] = useState(aksi?.id);
  const [tahap, setTahap] = useState(1);
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState('');
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [rincian, setRincian] = useState(
    () =>
      aksi?.rincianDana.map((r) => ({
        label:
          'uraian' in r && typeof r.uraian === 'string' ? r.uraian : r.label,
        nominal: String(r.nominal),
      })) ?? [],
  );
  const infoProject = jenis === 'project' && tahap === 1;
  const kolom = infoProject
    ? [
        ...INFORMASI,
        {
          kunci: 'tujuan' as const,
          label: 'Tujuan',
          tipe: 'textarea' as const,
          wajib: true,
          maks: 10000,
        },
      ]
    : jenis === 'campaign'
      ? [
          ...INFORMASI,
          {
            kunci: 'targetDana' as const,
            label: 'Target dana (Rp)',
            tipe: 'number' as const,
            wajib: true,
          },
          ...PERIODE,
          {
            kunci: 'kebutuhan' as const,
            label: 'Kebutuhan / penggunaan dana',
            tipe: 'textarea' as const,
            maks: 10000,
          },
        ]
      : KEBUTUHAN;

  async function simpan(event: FormEvent) {
    event.preventDefault();
    if (sibuk) return;
    setSibuk(true);
    setPesan('');
    setGalat({});
    try {
      const badan: Record<string, unknown> = {};
      const keys = infoProject
        ? [...INFORMASI.map((k) => k.kunci), 'tujuan' as const]
        : (Object.keys(isian) as Kunci[]);
      for (const k of keys) {
        badan[k] = [
          'targetDana',
          'kuotaRelawan',
          'latitude',
          'longitude',
        ].includes(k)
          ? isian[k] === ''
            ? null
            : Number(isian[k])
          : isian[k];
      }
      if (!infoProject)
        badan.rincianDana = rincian.map((r) => ({
          label: r.label,
          nominal: Number(r.nominal),
        }));
      badan.tahap = infoProject ? 'informasi' : 'lengkap';
      const hasil = await apiAksi<{ aksi: Aksi }>(
        id
          ? `/api/aksi/${jenis}/${id}`
          : `/api/${jenis === 'project' ? 'projects' : 'campaigns'}`,
        badan,
        id ? 'PATCH' : 'POST',
      );
      setId(hasil.aksi.id);
      showToast(
        <>
          Draft tersimpan. ID: <strong>{hasil.aksi.id}</strong>.{' '}
          <Link href={`/manage/${jenis}/${hasil.aksi.id}`}>
            Lihat detail privat
          </Link>
        </>,
        'ok',
      );
      if (infoProject) setTahap(2);
      else {
        router.push(`/manage/${jenis}/${hasil.aksi.id}`);
        router.refresh();
      }
    } catch (error) {
      setPesan(
        error instanceof Error ? error.message : 'Gagal menyimpan. Coba lagi.',
      );
      if (error instanceof GalatValidasi) setGalat(error.rincian ?? {});
    } finally {
      setSibuk(false);
    }
  }

  return (
    <form onSubmit={simpan} noValidate className="grid gap-5">
      {jenis === 'project' && (
        <p aria-live="polite">
          <strong>Tahap {tahap} dari 2:</strong>{' '}
          {tahap === 1 ? 'Informasi dasar' : 'Kebutuhan dan jadwal'}
        </p>
      )}
      {id && (
        <p className="notice info">
          ID {jenis}: <strong>{id}</strong>
        </p>
      )}
      {pesan && (
        <div role="alert" className="notice bad">
          <p>{pesan}</p>
          {Object.keys(galat).length > 0 && (
            <ul>
              {Object.entries(galat).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <fieldset disabled={sibuk} className="grid min-w-0 gap-5 border-0 p-0">
        {kolom.map(({ kunci, label, tipe, wajib, maks }) => {
          const props = {
            id: `${prefix}-${kunci}`,
            name: kunci,
            value: isian[kunci],
            required: wajib,
            maxLength: maks,
            'aria-invalid': !!galat[kunci],
            'aria-describedby': galat[kunci]
              ? `${prefix}-${kunci}-error`
              : undefined,
            onChange: (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setIsian({ ...isian, [kunci]: e.target.value }),
            className:
              'w-full rounded-xl border border-line bg-white px-4 py-3',
          };
          return (
            <div key={kunci} className="grid gap-2">
              <label htmlFor={props.id} className="font-bold">
                {label}
                {wajib ? ' *' : ''}
              </label>
              {tipe === 'textarea' ? (
                <textarea {...props} rows={4} />
              ) : (
                <input
                  {...props}
                  type={tipe ?? 'text'}
                  step={
                    tipe === 'number'
                      ? kunci === 'kuotaRelawan'
                        ? '1'
                        : 'any'
                      : undefined
                  }
                />
              )}
              {galat[kunci] && (
                <p id={`${prefix}-${kunci}-error`} className="text-red-800">
                  {galat[kunci]}
                </p>
              )}
            </div>
          );
        })}
        {!infoProject && (
          <div className="grid gap-3">
            <h3>Rincian penggunaan dana (opsional)</h3>
            {rincian.map((r, index) => (
              <div key={index} className="flex flex-wrap gap-2">
                <input
                  aria-label={`Rincian ${index + 1}`}
                  value={r.label}
                  maxLength={200}
                  className="rounded-xl border border-line p-3"
                  onChange={(e) =>
                    setRincian(
                      rincian.map((v, i) =>
                        i === index ? { ...v, label: e.target.value } : v,
                      ),
                    )
                  }
                />
                <input
                  aria-label={`Nominal rincian ${index + 1}`}
                  type="number"
                  step="0.01"
                  value={r.nominal}
                  className="rounded-xl border border-line p-3"
                  onChange={(e) =>
                    setRincian(
                      rincian.map((v, i) =>
                        i === index ? { ...v, nominal: e.target.value } : v,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setRincian(rincian.filter((_, i) => i !== index))
                  }
                >
                  Hapus rincian {index + 1}
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-light"
              disabled={rincian.length >= 50}
              onClick={() =>
                setRincian([...rincian, { label: '', nominal: '' }])
              }
            >
              Tambah rincian
            </button>
            {galat.rincianDana && (
              <p className="text-red-800">{galat.rincianDana}</p>
            )}
          </div>
        )}
      </fieldset>
      <div className="flex flex-wrap gap-3">
        {jenis === 'project' && tahap === 2 && (
          <button
            type="button"
            className="btn btn-light"
            disabled={sibuk}
            onClick={() => {
              setTahap(1);
              setPesan('');
              setGalat({});
            }}
          >
            Kembali ke informasi
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={sibuk}>
          {sibuk
            ? 'Menyimpan…'
            : infoProject
              ? 'Simpan dan lanjut'
              : 'Simpan Draft'}
        </button>
      </div>
      <p className="small muted">
        Aksi belum tampil publik sampai disetujui admin. Pengajuan dilakukan
        setelah Draft tersimpan.
      </p>
    </form>
  );
}
