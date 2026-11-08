'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { LABEL_STATUS_AKSI, type Aksi } from '@/shared/aksi';
import { apiAksi } from './apiAksi';

export function KeputusanPengajuan({ aksi }: { aksi: Aksi }) {
  const router = useRouter();
  const { showToast } = useToast();
  const id = useId();
  const [alasan, setAlasan] = useState('');
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState('');
  async function putuskan(keputusan: 'setujui' | 'tolak') {
    if (sibuk) return;
    if (keputusan === 'tolak' && !alasan.trim()) {
      setGalat('Alasan penolakan wajib diisi.');
      return;
    }
    setSibuk(true);
    setGalat('');
    try {
      const hasil = await apiAksi<{ aksi: Aksi }>(
        `/api/verifikasi/${aksi.jenis}/${aksi.id}`,
        { keputusan, alasan },
      );
      showToast(
        `Status pengajuan: ${LABEL_STATUS_AKSI[hasil.aksi.status]}.`,
        'ok',
      );
      router.refresh();
    } catch (error) {
      setGalat(
        error instanceof Error
          ? error.message
          : 'Keputusan gagal disimpan. Coba lagi.',
      );
    } finally {
      setSibuk(false);
    }
  }
  if (aksi.status !== 'menunggu_verifikasi')
    return (
      <div className="notice info" role="status">
        Status pengajuan: {LABEL_STATUS_AKSI[aksi.status]}.{' '}
        <Link href="/admin">Kembali ke antrean</Link>
      </div>
    );
  return (
    <section className="grid gap-4" aria-label="Keputusan admin">
      <h2>Keputusan verifikasi</h2>
      <label htmlFor={id} className="font-bold">
        Alasan penolakan (wajib untuk Tolak)
      </label>
      <textarea
        id={id}
        value={alasan}
        onChange={(e) => setAlasan(e.target.value)}
        rows={4}
        maxLength={2000}
        disabled={sibuk}
        className="rounded-xl border border-line p-4"
        aria-describedby={galat ? `${id}-error` : undefined}
      />
      {galat && (
        <p role="alert" id={`${id}-error`} className="notice bad">
          {galat}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={sibuk}
          onClick={() => putuskan('setujui')}
        >
          Setujui
        </button>
        <button
          type="button"
          className="btn btn-danger"
          disabled={sibuk}
          onClick={() => putuskan('tolak')}
        >
          Tolak
        </button>
      </div>
      {sibuk && <p role="status">Menyimpan keputusan…</p>}
    </section>
  );
}
