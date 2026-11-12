import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GateLogin } from '@/components/ui/GateLogin';
import { DompetKartu } from '@/components/views/DonasiView/DompetKartu';
import { DetailStatusPendaftaranView } from '@/components/views/RelawanView/DetailStatusPendaftaranView';
import { FormRiwayatView } from '@/components/views/RiwayatView/FormRiwayatView';
import { TabRiwayat } from '@/components/views/RiwayatView/TabRiwayat';
import { penggunaSaatIni } from '@/server/controllers/guard';

export const metadata: Metadata = { title: 'My activity | KlimPooL' };

// ===================== DATA SEMENTARA =====================
// saldoGalang belum punya sumber data; ganti setelah DonasiService siap.
const SALDO_GALANG_SEMENTARA = 0;
// ==========================================================

export default function HalamanAccount() {
  // Sesi dibaca dari cookie, jadi harus di balik <Suspense> (cacheComponents).
  return (
    <Suspense fallback={null}>
      <IsiAccount />
    </Suspense>
  );
}

/** KF04: tanpa sesi valid, halaman ini hanya menampilkan penghalang login. */
async function IsiAccount() {
  const pengguna = await penggunaSaatIni();
  if (!pengguna) {
    return <GateLogin pesan="Log in to see your activity" />;
  }

  const namaDepan = pengguna.nama.split(' ')[0];

  return (
    <main>
      <section className="border-b border-[#DCE0D6] bg-[#F7F6F2] pb-10 pt-12">
        <div className="mx-auto max-w-[1240px] px-5">
          <p className="text-[15px] font-bold text-[#4A544B]">My activity</p>
          <h1 className="mb-3 mt-3 font-serif text-[clamp(36px,5vw,56px)] font-medium leading-[1.08] tracking-tight">
            Hi, {namaDepan}
          </h1>
          <p className="max-w-[62ch] text-[19px] text-[#4A544B]">
            All your donations, volunteer applications, and actions in one
            place.
          </p>
          <DompetKartu
            saldoDonasi={pengguna.saldo ?? 0}
            saldoGalang={SALDO_GALANG_SEMENTARA}
          />
        </div>
      </section>

      <section className="pb-16 pt-7">
        <div className="mx-auto max-w-[1240px] px-5">
          {/* Tab aksi dipasang lewat props aksi={...}. */}
          <FormRiwayatView
            riwayat={<TabRiwayat />}
            relawan={<DetailStatusPendaftaranView />}
          />
        </div>
      </section>
    </main>
  );
}
