'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NOMINAL_MAKS,
  type ApiGagal,
  type FormDonasiInfo,
  type HasilDonasi,
  type JenisTujuan,
  type PermintaanDonasi,
} from '@/shared/dto';
import { Modal } from '../../ui/Modal';
import { rupiah } from '../format';
import { panggilApi } from '../panggilApi';

interface Props {
  jenisTujuan: JenisTujuan;
  idTujuan: string;
  onTutup: () => void;
  /** Dipanggil setelah donasi berhasil, dengan ringkasan untuk struk. */
  onBerhasil: (hasil: HasilDonasi) => void;
}

/** Nominal cepat pada prototipe I-06. */
const NOMINAL_CEPAT = [25_000, 50_000, 100_000, 250_000];

/** Galat yang ditampilkan sebagai layar "Donation not processed" dengan tombol Try again. */
const GALAT_ULANG = new Set(['GAGAL_KONEKSI', 'TRANSAKSI_GAGAL']);

const angkaDari = (nilai: string) => Number(nilai.replace(/\D/g, '')) || 0;

const kunciBaru = () => crypto.randomUUID();

/**
 * C30 - FormDonasiView (Boundary). Modal donasi.
 * tekanDonasi() ada pada tombol "Donate now" di halaman pemanggil yang memunculkan modal ini.
 *
 * Idempotency key dibangkitkan sekali per formulir (DPPL C30) dan dipakai ulang saat
 * "Try again", sehingga server menolak permintaan yang sama bila ternyata sudah diproses
 * (KF18). Donasi yang ditolak/di-rollback tidak menyimpan key, jadi key tetap bisa dipakai.
 */
export function FormDonasiView({
  jenisTujuan,
  idTujuan,
  onTutup,
  onBerhasil,
}: Props) {
  const [info, setInfo] = useState<FormDonasiInfo | null>(null);
  const [galatMuat, setGalatMuat] = useState<ApiGagal | null>(null);
  const [nominal, setNominal] = useState('');
  const [pesan, setPesan] = useState('');
  const [galat, setGalat] = useState<ApiGagal | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const [kunci] = useState(kunciBaru);
  const sedangKirim = useRef(false);

  // bukaFormDonasi: ambil nama tujuan dan saldo terbaru dari server.
  const ambilForm = useCallback(
    () =>
      panggilApi<FormDonasiInfo>(
        `/api/donasi/form?jenis=${jenisTujuan}&id=${encodeURIComponent(idTujuan)}`,
      ),
    [jenisTujuan, idTujuan],
  );

  useEffect(() => {
    let batal = false;
    ambilForm().then((h) => {
      if (batal) return;
      if (h.ok) setInfo(h.data);
      else setGalatMuat(h);
    });
    return () => {
      batal = true;
    };
  }, [ambilForm]);

  const nominalAngka = angkaDari(nominal);

  // isiNominal: menerima nominal dari tombol cepat atau kolom teks.
  function isiNominal(nilai: string) {
    setNominal(nilai.replace(/\D/g, '').slice(0, 13));
    setGalat(null);
  }

  // konfirmasiPembayaran: mengirim permintaan donasi dengan key milik formulir ini.
  async function konfirmasiPembayaran() {
    if (sedangKirim.current) return; // cegah klik ganda
    sedangKirim.current = true;
    setMengirim(true);
    setGalat(null);

    const minta: PermintaanDonasi = {
      jenisTujuan,
      idTujuan,
      nominal: nominalAngka,
      pesan: pesan.trim() || undefined,
      idempotencyKey: kunci,
    };
    const h = await panggilApi<HasilDonasi>('/api/donasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minta),
    });

    sedangKirim.current = false;
    setMengirim(false);
    if (h.ok) {
      onBerhasil(h.data);
      return;
    }
    setGalat(h);
    // Saldo bisa berubah di tab lain; tampilkan angka terbaru.
    if (h.kode === 'SALDO_KURANG') {
      const segar = await ambilForm();
      if (segar.ok) setInfo(segar.data);
    }
  }

  // tampilkanPesanKesalahan: saldo kurang, nominal tidak valid, tujuan ditutup, duplikasi.
  function tampilkanPesanKesalahan(g: ApiGagal | null) {
    if (!g) return null;
    return (
      <div className="notice bad" role="alert">
        <strong>Donation not processed</strong>
        <span>
          {g.pesan}
          {g.kode === 'SALDO_KURANG' && info
            ? ` Your balance is ${rupiah(info.saldo)}.`
            : null}
        </span>
      </div>
    );
  }

  // tampilkanFormulir: isi modal donasi beserta saldo Donatur.
  function tampilkanFormulir(data: FormDonasiInfo) {
    const kurang = nominalAngka > data.saldo;
    const melebihiMaks = nominalAngka > NOMINAL_MAKS;
    const bisaKirim = nominalAngka > 0 && !kurang && !melebihiMaks && !mengirim;

    return (
      <>
        <div className="grid gap-2">
          <span className="text-[16px] font-extrabold">Choose an amount</span>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {NOMINAL_CEPAT.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={nominalAngka === n}
                onClick={() => isiNominal(String(n))}
                className={`rounded-[14px] border-[1.5px] px-1.5 py-3.5 text-[15px] font-extrabold sm:text-[16px] ${
                  nominalAngka === n
                    ? 'border-[#3F6B3E] bg-[#E5ECDC]'
                    : 'border-[#CBD2C3] bg-white hover:border-[#3F6B3E]'
                }`}
              >
                {rupiah(n)}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-[16px] font-extrabold">
          Or enter another amount
          <span className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-[#4A544B]">
              Rp
            </span>
            <input
              inputMode="numeric"
              autoFocus
              value={
                nominalAngka > 0 ? nominalAngka.toLocaleString('en-US') : ''
              }
              onChange={(e) => isiNominal(e.target.value)}
              placeholder="0"
              aria-invalid={melebihiMaks}
              className="min-h-[52px] w-full rounded-[14px] border-[1.5px] border-[#CBD2C3] bg-white py-[13px] pl-12 pr-4 text-[17px] font-normal focus:border-[#3F6B3E] focus:outline-none focus:ring-[3px] focus:ring-[#3F6B3E]/[0.18]"
            />
          </span>
          {melebihiMaks ? (
            <span className="text-[15px] font-bold text-[#B3261E]">
              The maximum donation is {rupiah(NOMINAL_MAKS)}.
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-[16px] font-extrabold">
          <span>
            Message for the organizer{' '}
            <span className="font-semibold text-[#4A544B]">(optional)</span>
          </span>
          <input
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            maxLength={200}
            placeholder="Good luck to the team on the ground"
            className="min-h-[52px] w-full rounded-[14px] border-[1.5px] border-[#CBD2C3] bg-white px-4 py-[13px] text-[17px] font-normal focus:border-[#3F6B3E] focus:outline-none focus:ring-[3px] focus:ring-[#3F6B3E]/[0.18]"
          />
        </label>

        <div className="grid gap-2 rounded-2xl bg-[#F7F6F2] px-[18px] py-4">
          <div className="flex justify-between gap-2.5 text-[16px]">
            <span>Your donation balance</span>
            <b>{rupiah(data.saldo)}</b>
          </div>
          <div className="flex justify-between gap-2.5 text-[16px]">
            <span>Donation amount</span>
            <b>−{rupiah(nominalAngka)}</b>
          </div>
          <div className="flex justify-between border-t border-[#DCE0D6] pt-2.5 text-[18px]">
            <span className="font-extrabold">Balance after donation</span>
            <b className={kurang ? 'text-[#B3261E]' : ''}>
              {kurang ? 'Not enough' : rupiah(data.saldo - nominalAngka)}
            </b>
          </div>
        </div>

        {kurang ? (
          <div className="notice warn">
            <strong>You are {rupiah(nominalAngka - data.saldo)} short</strong>
            <span>
              Top up first, then come back here. The amount you chose will be
              kept.
            </span>
          </div>
        ) : null}

        {tampilkanPesanKesalahan(galat)}

        <button
          type="button"
          onClick={konfirmasiPembayaran}
          disabled={!bisaKirim}
          className="btn btn-primary btn-block disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mengirim ? 'Processing donation…' : 'Confirm donation'}
        </button>

        <p className="small muted text-center">
          Your balance is deducted and the donation recorded in{' '}
          <b>a single transaction</b>. If any step fails, everything is
          cancelled.
        </p>
      </>
    );
  }

  // Layar gagal pada prototipe: koneksi putus atau transaksi di-rollback.
  if (galat && GALAT_ULANG.has(galat.kode)) {
    return (
      <Modal open onClose={onTutup} title="Donation not processed">
        <div className="notice bad" role="alert">
          <strong>
            {galat.kode === 'GAGAL_KONEKSI'
              ? 'The connection dropped while processing the transaction'
              : 'The transaction was cancelled'}
          </strong>
          <span>{galat.pesan}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={konfirmasiPembayaran}
            disabled={mengirim}
          >
            {mengirim ? 'Processing donation…' : 'Try again'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onTutup}>
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={onTutup}
      title="Donate"
      subtitle={
        info ? (
          <>
            to <b className="text-[#1F2420]">{info.tujuan.nama}</b>
          </>
        ) : undefined
      }
    >
      {info ? (
        tampilkanFormulir(info)
      ) : (
        <>
          {!galatMuat ? <p className="muted">Loading donation form…</p> : null}
          {tampilkanPesanKesalahan(galatMuat)}
          {galatMuat ? (
            <button
              type="button"
              onClick={onTutup}
              className="btn btn-primary btn-block"
            >
              Close
            </button>
          ) : null}
        </>
      )}
    </Modal>
  );
}
