'use client';

import { useEffect, useState } from 'react';
import type { ApiGagal, BuktiDTO } from '@/shared/donasi';
import { panggilApi } from './panggilApi';

export type KeadaanBukti =
  | { status: 'memuat' }
  | { status: 'ada'; bukti: BuktiDTO }
  | { status: 'gagal'; galat: ApiGagal };

/**
 * bukaBukti (C31): GET /api/donasi/bukti/:id. Kepemilikan diperiksa server (Algo-122).
 * Bila idTransaksi berubah, pasang key={idTransaksi} pada pemakai agar keadaan mulai dari awal.
 */
export function useBukti(idTransaksi: string): KeadaanBukti {
  const [keadaan, setKeadaan] = useState<KeadaanBukti>({ status: 'memuat' });

  useEffect(() => {
    let batal = false;
    panggilApi<BuktiDTO>(
      `/api/donasi/bukti/${encodeURIComponent(idTransaksi)}`,
    ).then((h) => {
      if (batal) return;
      setKeadaan(
        h.ok ? { status: 'ada', bukti: h.data } : { status: 'gagal', galat: h },
      );
    });
    return () => {
      batal = true;
    };
  }, [idTransaksi]);

  return keadaan;
}
