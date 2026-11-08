'use client';

import { useEffect, useState } from 'react';

/**
 * batang progres dana.
 */
export function BarProgres({
  persen,
  animasi = false,
}: {
  persen: number;
  animasi?: boolean;
}) {
  const [lebar, setLebar] = useState(animasi ? 0 : persen);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLebar(persen));
    return () => cancelAnimationFrame(id);
  }, [persen]);

  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={persen}
      aria-label="Funding progress"
    >
      <i style={{ width: `${lebar}%` }} />
    </div>
  );
}
