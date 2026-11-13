'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import type { Aksi } from '@/shared/aksi';
import { dapatDiedit } from '@/shared/aksi';
import { apiAksi } from './apiAksi';

export function TombolPengajuan({
  aksi,
  onSelesai,
}: {
  aksi: Aksi;
  onSelesai?: (aksi: Aksi) => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState('');
  if (!dapatDiedit(aksi.status)) return null;
  return (
    <div className="grid gap-2">
      <button
        className="btn btn-primary"
        type="button"
        disabled={sibuk}
        onClick={async () => {
          setSibuk(true);
          setGalat('');
          try {
            const hasil = await apiAksi<{ aksi: Aksi }>(
              `/api/aksi/${aksi.jenis}/${aksi.id}/pengajuan`,
              {},
            );
            showToast(
              'Aksi berhasil diajukan. Status: Menunggu Verifikasi.',
              'ok',
            );
            onSelesai?.(hasil.aksi);
            router.refresh();
          } catch (error) {
            setGalat(
              error instanceof Error
                ? error.message
                : 'Gagal mengajukan. Coba lagi.',
            );
          } finally {
            setSibuk(false);
          }
        }}
      >
        {sibuk
          ? 'Mengajukan…'
          : aksi.status === 'ditolak'
            ? 'Ajukan Ulang'
            : 'Ajukan Verifikasi'}
      </button>
      {galat && (
        <p role="alert" className="notice bad">
          {galat} Lengkapi atau perbarui Draft melalui Kelola.
        </p>
      )}
    </div>
  );
}
