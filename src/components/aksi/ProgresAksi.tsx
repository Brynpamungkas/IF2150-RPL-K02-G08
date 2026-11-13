'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProgresProjectView } from '@/components/views/ProgresView/FormProgresProjectView';
import type { StatusPelaksanaan } from '@/shared/progres';

/** Hanya adaptor navigasi milik My Actions; form dan API progres tetap milik tim. */
export function ProgresAksi({
  id,
  judul,
  status,
}: {
  id: string;
  judul: string;
  status: StatusPelaksanaan | null;
}) {
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(false);
  const [berhasil, setBerhasil] = useState(false);
  return (
    <section className="grid gap-4">
      {berhasil && <p role="status">Pembaruan progres berhasil disimpan.</p>}
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setTerbuka(true)}
      >
        Post a progress update
      </button>
      {terbuka && (
        <FormProgresProjectView
          idProject={id}
          judul={judul}
          statusAwal={status}
          onTutup={() => setTerbuka(false)}
          onBerhasil={() => {
            setTerbuka(false);
            setBerhasil(true);
            router.refresh();
          }}
        />
      )}
    </section>
  );
}
