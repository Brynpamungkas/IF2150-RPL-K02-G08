'use client';

import { useMemo } from 'react';
import type { ItemKatalog } from '@/shared/katalog';
import type { TitikSebaran } from '@/shared/peta';
import { PetaSebaran } from '@/components/ui/PetaSebaran';

interface FormPetaWilayahViewProps {
  hasil: ItemKatalog[];
  terpilihId: string | null;
  sorotId: string | null;
  onPilih: (id: string | null) => void;
}

type ItemBerpin = ItemKatalog & { latitude: number; longitude: number };

const dapatDipasang = (i: ItemKatalog): i is ItemBerpin =>
  i.terbukaDonasi && i.latitude !== null && i.longitude !== null;

export function FormPetaWilayahView({
  hasil,
  terpilihId,
  sorotId,
  onPilih,
}: FormPetaWilayahViewProps) {
  const titik: TitikSebaran[] = useMemo(
    () => hasil.filter(dapatDipasang),
    [hasil],
  );

  return (
    <PetaSebaran
      titik={titik}
      terpilihId={terpilihId}
      sorotId={sorotId}
      onPilih={onPilih}
    />
  );
}
