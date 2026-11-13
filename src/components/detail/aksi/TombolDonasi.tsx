'use client';

import { useRouter } from 'next/navigation';
import { AlurDonasi } from '@/components/views/DonasiView';
import { formatTanggal, type DetailAksi } from '@/shared/detail';

export function TombolDonasi({ detail }: { detail: DetailAksi }) {
  const router = useRouter();

  if (detail.terbukaDonasi) {
    // Alur UC06: tombol "Donate now" -> formulir donasi -> bukti transaksi.
    return (
      <AlurDonasi
        jenisTujuan={detail.tipe}
        idTujuan={detail.id}
        onSelesai={() => router.refresh()}
      />
    );
  }

  if (detail.belumMulai) {
    return (
      <>
        <div className="notice warn">
          <strong>Fundraising has not started yet</strong>
          <span>
            Donations open on {formatTanggal(detail.mulai)}. You can read the
            details in the meantime.
          </span>
        </div>
        <button type="button" className="btn btn-block" aria-disabled="true">
          Donations not open yet
        </button>
      </>
    );
  }

  const selesai = detail.statusPelaksanaan === 'selesai';
  return (
    <>
      <div className="notice warn">
        <strong>
          {selesai ? 'This action is completed' : 'Fundraising has closed'}
        </strong>
        <span>
          The period ended on {formatTanggal(detail.selesai)}. You can still
          read the progress reports.
        </span>
      </div>
      <button type="button" className="btn btn-block" aria-disabled="true">
        Donations closed
      </button>
    </>
  );
}
