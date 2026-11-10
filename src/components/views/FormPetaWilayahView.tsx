'use client';

import { useMemo } from 'react';
import type { ItemKatalog } from '@/shared/katalog';
import type { TitikSebaran } from '@/shared/peta';
import { adaKoordinat } from '@/shared/explore';
import { PetaSebaran } from '@/components/ui/PetaSebaran';

interface FormPetaWilayahViewProps {
  hasil: ItemKatalog[];
  /** kunci titik (kunciTitik: tipe + id), bukan id saja. */
  terpilihKunci: string | null;
  sorotKunci: string | null;
  onPilih: (kunci: string | null) => void;
}

export function FormPetaWilayahView({
  hasil,
  terpilihKunci,
  sorotKunci,
  onPilih,
}: FormPetaWilayahViewProps) {
  // peta mengikuti hasil filter: aksi yang donasinya tutup/selesai tetap muncul,
  // selama punya koordinat (catatan marker aksi selesai, #54).
  const titik: TitikSebaran[] = useMemo(
    () => hasil.filter(adaKoordinat),
    [hasil],
  );

  return (
    <PetaSebaran
      titik={titik}
      terpilihKunci={terpilihKunci}
      sorotKunci={sorotKunci}
      onPilih={onPilih}
    />
  );
}
