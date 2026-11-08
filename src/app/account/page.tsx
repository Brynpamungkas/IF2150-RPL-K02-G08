import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TabMyActions } from '@/components/aksi/TabMyActions';
import LoadingAksi from '@/components/aksi/LoadingAksi';
import { GateLogin } from '@/components/ui/GateLogin';
import { DompetKartu } from '@/components/views/DonasiView/DompetKartu';
import { FormRiwayatView } from '@/components/views/RiwayatView/FormRiwayatView';

export const metadata: Metadata = { title: 'My activity | KlimPooL' };

// ===================== DATA SEMENTARA (UI saja) =====================
// Belum ada akses data. Ganti blok ini setelah backend siap:
//  - SUDAH_LOGIN dan nama dari sesi login (AutentikasiService). Di Next 16
//    dengan cacheComponents, pembacaan sesi harus berada di balik <Suspense>.
//  - saldoDonasi dan saldoGalang dari DonasiService.
// Slot My Actions di bawah sudah memakai sesi/data server sendiri; header/dompet
// preview ini tetap milik integrasi Account/auth dan tidak dipakai sebagai identitas aksi.
const SUDAH_LOGIN: boolean = true;
const PENGGUNA_DUMMY = {
  nama: 'Andi Rahman',
  saldoDonasi: 750_000,
  saldoGalang: 0,
};
// ====================================================================

export default function HalamanAccount() {
  if (!SUDAH_LOGIN) {
    return <GateLogin pesan="Log in to see your activity" />;
  }

  const namaDepan = PENGGUNA_DUMMY.nama.split(' ')[0];

  return (
    <main>
      <section className="border-b border-[#DCE0D6] bg-[#F7F6F2] pb-10 pt-12">
        <div className="mx-auto max-w-[1240px] px-5">
          <p className="text-[15px] font-bold text-[#4A544B]">My activity</p>
          <p className="notice warn mt-3">
            Account header and wallet are a preview. My Actions uses your active
            session and private data, not the preview identity or balance.
          </p>
          <h1 className="mb-3 mt-3 font-serif text-[clamp(36px,5vw,56px)] font-medium leading-[1.08] tracking-tight">
            Hi, {namaDepan}
          </h1>
          <p className="max-w-[62ch] text-[19px] text-[#4A544B]">
            All your donations, volunteer applications, and actions in one
            place.
          </p>
          <DompetKartu
            saldoDonasi={PENGGUNA_DUMMY.saldoDonasi}
            saldoGalang={PENGGUNA_DUMMY.saldoGalang}
          />
        </div>
      </section>

      <section className="pb-16 pt-7">
        <div className="mx-auto max-w-[1240px] px-5">
          {/* Slot riwayat dan relawan tetap disediakan untuk modul pemiliknya. */}
          <FormRiwayatView
            aksi={
              <Suspense fallback={<LoadingAksi />}>
                <TabMyActions />
              </Suspense>
            }
          />
        </div>
      </section>
    </main>
  );
}
