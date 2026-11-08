'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  DetailBuktiTransaksiView,
  FormDonasiView,
} from '@/components/views/DonasiView';
import type { HasilDonasi } from '@/shared/dto';
import { adalahJenisTujuan } from '@/shared/dto';

/**
 * Halaman contoh untuk alur UC06. Pada aplikasi sebenarnya, tombol "Donate now"
 * berada di DetailCampaignView / DetailProjectView milik anggota lain.
 */
export default function HalamanDonasi() {
  const { jenis, id } = useParams<{ jenis: string; id: string }>();
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [hasil, setHasil] = useState<HasilDonasi | null>(null);

  if (!adalahJenisTujuan(jenis)) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F7F6F2] px-5">
        <p className="rounded-2xl border-[1.5px] border-[#DCE0D6] bg-white p-6 text-[#4A544B]">
          Unknown destination type. Use /donasi/campaign/ID or
          /donasi/project/ID.
        </p>
      </main>
    );
  }

  // tekanDonasi: menerima pilihan tujuan donasi dan meminta formulir (C30).
  function tekanDonasi() {
    setFormTerbuka(true);
  }

  function selesaiDonasi(ringkasan: HasilDonasi) {
    setFormTerbuka(false);
    setHasil(ringkasan);
  }

  return (
    <main className="min-h-screen bg-[#F7F6F2] px-5 py-10 text-[#1F2420]">
      <article className="mx-auto grid max-w-[640px] gap-5 rounded-[20px] border-[1.5px] border-[#DCE0D6] bg-white p-7">
        <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#3F6B3E]">
          Donation demo
        </p>
        <h1 className="font-serif text-[clamp(32px,5vw,44px)] font-medium leading-[1.08] tracking-[-0.02em]">
          Support this action
        </h1>
        <p className="text-[19px] text-[#4A544B]">
          This page stands in for the project details page until the campaign
          and project views are connected.
        </p>
        <p className="text-[15px] text-[#4A544B]">
          Destination: <b className="uppercase">{jenis}</b> / {id}
        </p>
        <button
          type="button"
          onClick={tekanDonasi}
          className="mt-2 min-h-[50px] w-full rounded-full bg-[#3F6B3E] px-6 text-[16px] font-extrabold text-white hover:bg-[#2D4F2D]"
        >
          Donate now
        </button>
      </article>

      {formTerbuka && (
        <FormDonasiView
          jenisTujuan={jenis}
          idTujuan={id}
          onTutup={() => setFormTerbuka(false)}
          onBerhasil={selesaiDonasi}
        />
      )}
      {hasil && (
        <DetailBuktiTransaksiView
          idTransaksi={hasil.idTransaksi}
          ringkasan={hasil}
          onTutup={() => setHasil(null)}
        />
      )}
    </main>
  );
}
