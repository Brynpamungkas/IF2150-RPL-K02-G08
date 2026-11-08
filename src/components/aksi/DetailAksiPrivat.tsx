import type { Aksi } from '@/shared/aksi';
import { LABEL_STATUS_AKSI } from '@/shared/aksi';

/** Preview pemilik/admin terpisah dari halaman detail publik milik modul Explore. */
export function DetailAksiPrivat({ aksi }: { aksi: Aksi }) {
  const baris = [
    ['Jenis', aksi.jenis],
    ['Status', LABEL_STATUS_AKSI[aksi.status]],
    ['ID', aksi.id],
    ['Deskripsi', aksi.deskripsi],
    ['Tujuan', aksi.tujuan],
    ['Kategori', aksi.kategori],
    ['Wilayah', `${aksi.kota}, ${aksi.provinsi}`],
    [
      'Koordinat',
      aksi.latitude === null
        ? 'Belum diisi'
        : `${aksi.latitude}, ${aksi.longitude}`,
    ],
    ['Target / kebutuhan dana', `Rp${aksi.targetDana.toLocaleString('id-ID')}`],
    ['Mulai', aksi.mulai ?? 'Belum diisi'],
    ['Selesai', aksi.selesai ?? 'Belum diisi'],
    ['Kebutuhan', aksi.kebutuhan],
    ['Kriteria relawan', aksi.kriteriaRelawan],
    [
      'Kuota relawan',
      aksi.jenis === 'project' ? String(aksi.kuotaRelawan) : '',
    ],
    ['Titik kumpul (privat)', aksi.lokasiKumpul],
    ['Diajukan', aksi.tanggalPengajuan ?? 'Belum diajukan'],
    ['Diverifikasi', aksi.tanggalVerifikasi ?? 'Belum diverifikasi'],
  ];
  return (
    <section aria-label="Detail aksi privat" className="grid gap-5">
      {aksi.alasanPenolakan && (
        <p className="notice bad">Alasan penolakan: {aksi.alasanPenolakan}</p>
      )}
      <dl className="grid gap-4">
        {baris
          .filter(([, nilai]) => nilai !== '')
          .map(([label, nilai]) => (
            <div key={label}>
              <dt className="font-bold">{label}</dt>
              <dd className="whitespace-pre-wrap break-words">{nilai}</dd>
            </div>
          ))}
      </dl>
      {aksi.rincianDana.length > 0 && (
        <div>
          <h3>Rincian penggunaan dana</h3>
          <ul>
            {aksi.rincianDana.map((r, i) => (
              <li key={i}>
                {r.label}: Rp{r.nominal.toLocaleString('id-ID')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
