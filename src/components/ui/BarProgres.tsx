'use client';

import { useEffect, useState } from 'react';

/**
 * batang progres dana. dengan animasi=true batang tumbuh dari 0 saat pertama tampil
 * (seperti prototipe saat halaman dibuka); selain itu langsung penuh.
 */
export function BarProgres({
  persen,
  animasi = false,
  besar = false,
  warna,
}: {
  persen: number;
  animasi?: boolean;
  besar?: boolean;
  warna?: string;
}) {
  const [lebar, setLebar] = useState(animasi ? 0 : persen);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLebar(persen));
    return () => cancelAnimationFrame(id);
  }, [persen]);

  return (
    <div
      className={besar ? 'bar big' : 'bar'}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={persen}
      aria-label="Funding progress"
    >
      <i style={{ width: `${lebar}%`, background: warna }} />
    </div>
  );
}
