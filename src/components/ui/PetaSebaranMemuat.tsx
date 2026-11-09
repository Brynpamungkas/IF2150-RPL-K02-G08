'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { type JenisSebaran, type TitikSebaran } from '@/shared/peta';
import { PetaSebaran } from './PetaSebaran';

interface PetaSebaranMemuatProps {
  jenis?: JenisSebaran;
  pusat?: string;
  radiusKm?: number;
  aksiPopup?: (titik: TitikSebaran) => ReactNode;
}

interface Termuat {
  kunci: string;
  titik: TitikSebaran[];
  gagal: boolean;
}

export function PetaSebaranMemuat({
  jenis = 'semua',
  pusat,
  radiusKm = 0,
  aksiPopup,
}: PetaSebaranMemuatProps) {
  const params = new URLSearchParams({ jenis });
  if (pusat && radiusKm > 0) {
    params.set('pusat', pusat);
    params.set('radius', String(radiusKm));
  }
  const kunci = params.toString();
  const [termuat, setTermuat] = useState<Termuat | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`/api/peta?${kunci}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<{ data: TitikSebaran[] }>;
      })
      .then(({ data }) => setTermuat({ kunci, titik: data, gagal: false }))
      .catch(() => {
        if (!ac.signal.aborted) {
          setTermuat({ kunci, titik: [], gagal: true });
        }
      });
    return () => ac.abort();
  }, [kunci]);

  return (
    <>
      {termuat?.kunci === kunci && termuat.gagal && (
        <p className="small muted" role="alert">
          The map could not be loaded. Please refresh the page.
        </p>
      )}
      <PetaSebaran
        titik={termuat?.kunci === kunci ? termuat.titik : []}
        aksiPopup={aksiPopup}
      />
    </>
  );
}
