'use client';

import { AlurDonasi } from '@/components/views/DonasiView';
import { adalahJenisTujuan } from '@/shared/donasi';

/**
 * Isi halaman contoh alur UC06. Pada aplikasi sebenarnya, tombol "Donate now"
 * berada di DetailCampaignView / DetailProjectView (TombolDonasi) milik anggota lain,
 * yang cukup memakai <AlurDonasi jenisTujuan idTujuan />.
 */
export function DemoDonasi({ jenis, id }: { jenis: string; id: string }) {
  if (!adalahJenisTujuan(jenis)) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-[var(--cream)] px-5">
        <p className="notice bad">
          Unknown destination type. Use /donasi/campaign/ID or
          /donasi/project/ID.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--cream)] px-5 py-10">
      <article className="mx-auto grid max-w-[640px] gap-5 rounded-[20px] border-[1.5px] border-[var(--line)] bg-white p-7">
        <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--forest)]">
          Donation demo
        </p>
        <h1 className="font-serif text-[clamp(32px,5vw,44px)] font-medium leading-[1.08] tracking-[-0.02em]">
          Support this action
        </h1>
        <p className="text-[19px] text-[var(--ink-2)]">
          This page stands in for the project details page until the campaign
          and project views are connected.
        </p>
        <p className="small muted">
          Destination: <b className="uppercase">{jenis}</b> / {id}
        </p>
        <AlurDonasi jenisTujuan={jenis} idTujuan={id} />
      </article>
    </div>
  );
}
