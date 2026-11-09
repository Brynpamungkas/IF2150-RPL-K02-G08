'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type {
  ApiGagal,
  FormDonasiInfo,
  HasilDonasi,
  JenisTujuan,
  PermintaanDonasi,
} from '@/shared/donasi';
import { Modal } from '../../ui/Modal';
import { rupiah } from './format';
import {
  NOMINAL_CEPAT,
  angkaDari,
  bersihkanMasukan,
  buatIdempotencyKey,
  formatMasukan,
  pesanSaldoKurang,
  ringkasanSaldo,
  validasiFormDonasi,
} from './logikaDonasi';
import { panggilApi } from './panggilApi';

interface Props {
  jenisTujuan: JenisTujuan;
  idTujuan: string;
  onTutup: () => void;
  /** Dipanggil setelah donasi berhasil, dengan ringkasan untuk struk dan nominalnya. */
  onBerhasil: (hasil: HasilDonasi, nominal: number) => void;
  /** Bila ada, galat BELUM_LOGIN menampilkan tombol "Log in". TODO(#14). */
  onPerluLogin?: () => void;
  /**
   * Bila ada, notice saldo kurang menampilkan "Top up now" (I-07).
   * Menerima nominal yang dipilih (agar bisa dipertahankan) dan kekurangannya.
   */
  onTopup?: (nominal: number, kekurangan: number) => void;
  /** Nominal yang sudah terisi saat formulir dibuka, mis. setelah kembali dari top up. */
  nominalAwal?: number;
}

/** Galat yang ditampilkan sebagai layar "Donation not processed" dengan tombol Try again. */
const GALAT_ULANG = new Set<ApiGagal['kode']>([
  'GAGAL_KONEKSI',
  'TRANSAKSI_GAGAL',
]);
/** Galat yang membuat formulir ini tidak boleh dikirim lagi. */
const GALAT_KUNCI = new Set<ApiGagal['kode']>(['TUJUAN_DITUTUP', 'DUPLIKAT']);

function IkonPanah() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * C30 - FormDonasiView (Boundary). Modal donasi I-06.
 * tekanDonasi() ada pada tombol "Donate now" di pemanggil (lihat AlurDonasi).
 *
 * Idempotency key dibangkitkan sekali per formulir (DPPL C30) dan dipakai ulang pada
 * setiap kiriman dari formulir yang sama, termasuk "Try again". Bila kiriman sebelumnya
 * ternyata sudah masuk, server menolak kiriman ulang sebagai DUPLIKAT (KF18). Kiriman
 * yang ditolak/di-rollback tidak menyimpan key, jadi key tetap boleh dipakai lagi.
 */
export function FormDonasiView({
  jenisTujuan,
  idTujuan,
  onTutup,
  onBerhasil,
  onPerluLogin,
  onTopup,
  nominalAwal,
}: Props) {
  const idDasar = useId();
  const idNominal = `${idDasar}-damt`;
  const idGalatNominal = `${idDasar}-damt-err`;
  const idPesan = `${idDasar}-dmsg`;

  const [info, setInfo] = useState<FormDonasiInfo | null>(null);
  const [galatMuat, setGalatMuat] = useState<ApiGagal | null>(null);
  const [nominal, setNominal] = useState(() =>
    nominalAwal ? bersihkanMasukan(String(nominalAwal)) : '',
  );
  const [pesan, setPesan] = useState('');
  const [galatNominal, setGalatNominal] = useState<string | null>(null);
  const [galat, setGalat] = useState<ApiGagal | null>(null);
  const [setelahUlang, setSetelahUlang] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [kunci] = useState(buatIdempotencyKey);

  const sedangKirim = useRef(false); // penjaga sinkron klik ganda
  const pernahGagalKirim = useRef(false); // sudah pernah GAGAL_KONEKSI/TRANSAKSI_GAGAL
  const inputNominal = useRef<HTMLInputElement>(null);

  // bukaFormDonasi (Algo-120): nama tujuan dan saldo terbaru dari server.
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
  const terkunci = galat !== null && GALAT_KUNCI.has(galat.kode);

  /** Modal tidak boleh ditutup selama proses, agar hasil donasi tidak hilang. */
  function tutupBilaBoleh() {
    if (!sedangKirim.current) onTutup();
  }

  // isiNominal: dari tombol cepat atau kolom teks. Key TIDAK diganti.
  function isiNominal(teks: string) {
    setNominal(bersihkanMasukan(teks));
    setGalatNominal(null);
  }

  async function muatUlangSaldo(): Promise<number | null> {
    const h = await ambilForm();
    if (!h.ok) return null;
    setInfo(h.data);
    return h.data.saldo;
  }

  // konfirmasiPembayaran: validasi di client (I-06.8), lalu kirim.
  function konfirmasiPembayaran() {
    if (!info || sedangKirim.current || terkunci) return;
    const pesanGalat = validasiFormDonasi(nominalAngka, info.saldo);
    if (pesanGalat) {
      setGalatNominal(pesanGalat);
      inputNominal.current?.focus();
      return;
    }
    void kirim();
  }

  /** Mengirim permintaan donasi dengan key milik formulir ini (dipakai juga oleh Try again). */
  async function kirim() {
    if (sedangKirim.current) return;
    sedangKirim.current = true;
    setMengirim(true);
    setGalat(null);
    setGalatNominal(null);

    const minta: PermintaanDonasi = {
      jenisTujuan,
      idTujuan,
      nominal: nominalAngka,
      pesan: pesan.trim() || undefined,
      idempotencyKey: kunci,
    };
    try {
      const h = await panggilApi<HasilDonasi>('/api/donasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minta),
      });
      if (h.ok) {
        onBerhasil(h.data, minta.nominal);
        return;
      }
      await tanganiGalat(h);
    } finally {
      sedangKirim.current = false;
      setMengirim(false);
    }
  }

  // tampilkanPesanKesalahan: memilih tempat dan isi pesan per kode galat (AC4).
  async function tanganiGalat(h: ApiGagal) {
    switch (h.kode) {
      case 'GAGAL_KONEKSI':
      case 'TRANSAKSI_GAGAL':
        pernahGagalKirim.current = true;
        setGalat(h);
        return;
      case 'NOMINAL_TIDAK_VALID':
        setGalatNominal(h.pesan);
        inputNominal.current?.focus();
        return;
      case 'SALDO_KURANG': {
        const saldo = (await muatUlangSaldo()) ?? info?.saldo ?? 0;
        setGalatNominal(pesanSaldoKurang(nominalAngka, saldo));
        inputNominal.current?.focus();
        return;
      }
      case 'DUPLIKAT':
        setSetelahUlang(pernahGagalKirim.current);
        setGalat(h);
        void muatUlangSaldo();
        return;
      default:
        setGalat(h);
    }
  }

  function tombolLogin(g: ApiGagal) {
    if (g.kode !== 'BELUM_LOGIN' || !onPerluLogin) return null;
    return (
      <button type="button" className="btn btn-primary" onClick={onPerluLogin}>
        Log in
      </button>
    );
  }

  function noticeGalat(g: ApiGagal, judul: string) {
    const duplikatUlang = g.kode === 'DUPLIKAT' && setelahUlang;
    return (
      <div className="notice bad" role="alert">
        <strong>
          {duplikatUlang ? 'This donation was already processed' : judul}
        </strong>
        <span>
          {duplikatUlang
            ? 'Your earlier attempt went through, so it was not charged again. Check My activity for the receipt.'
            : g.pesan}
        </span>
        {tombolLogin(g)}
      </div>
    );
  }

  // tampilkanFormulir: isi modal donasi beserta saldo Donatur (AC1).
  function tampilkanFormulir(data: FormDonasiInfo) {
    const { kurang, sisa, selisih } = ringkasanSaldo(data.saldo, nominalAngka);

    return (
      <>
        <div className="field">
          <span className="lbl">Choose an amount</span>
          <div className="amounts">
            {NOMINAL_CEPAT.map((n) => (
              <button
                key={n}
                type="button"
                className={nominalAngka === n ? 'on' : undefined}
                aria-pressed={nominalAngka === n}
                disabled={mengirim}
                onClick={() => isiNominal(String(n))}
              >
                {rupiah(n)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor={idNominal}>Or enter another amount</label>
          <div className="prefix">
            <span>Rp</span>
            <input
              ref={inputNominal}
              id={idNominal}
              className={`inp${galatNominal ? ' err' : ''}`}
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              placeholder="0"
              value={formatMasukan(nominalAngka)}
              onChange={(e) => isiNominal(e.target.value)}
              disabled={mengirim}
              aria-invalid={galatNominal ? true : undefined}
              aria-describedby={galatNominal ? idGalatNominal : undefined}
            />
          </div>
          {galatNominal ? (
            <span id={idGalatNominal} className="err-msg" role="alert">
              {galatNominal}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={idPesan}>
            Message for the organizer <span className="opt">(optional)</span>
          </label>
          <input
            id={idPesan}
            className="inp"
            value={pesan}
            maxLength={200}
            placeholder="Good luck to the team on the ground"
            onChange={(e) => setPesan(e.target.value)}
            disabled={mengirim}
          />
        </div>

        <div className="sum" aria-live="polite">
          <div className="r">
            <span>Your donation balance</span>
            <b>{rupiah(data.saldo)}</b>
          </div>
          <div className="r">
            <span>Donation amount</span>
            <b>−{rupiah(nominalAngka)}</b>
          </div>
          <div className="r total">
            <span>
              <b>Balance after donation</b>
            </span>
            <b style={{ color: kurang ? 'var(--bad)' : 'var(--ink)' }}>
              {kurang ? 'Not enough' : rupiah(sisa)}
            </b>
          </div>
        </div>

        {kurang ? (
          <div className="notice warn">
            <strong>You are {rupiah(selisih)} short</strong>
            <span>
              Top up first, then come back here. The amount you chose will be
              kept.
            </span>
            {onTopup ? (
              <button
                type="button"
                className="link-arrow"
                onClick={() => onTopup(nominalAngka, selisih)}
                disabled={mengirim}
              >
                Top up now <IkonPanah />
              </button>
            ) : null}
          </div>
        ) : null}

        {galat ? noticeGalat(galat, 'Donation not processed') : null}

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={konfirmasiPembayaran}
          disabled={mengirim || terkunci}
          aria-busy={mengirim}
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

  // Layar gagal (prototipe m.failed): koneksi putus atau transaksi di-rollback.
  if (galat && GALAT_ULANG.has(galat.kode)) {
    const koneksi = galat.kode === 'GAGAL_KONEKSI';
    return (
      <Modal open onClose={tutupBilaBoleh} title="Donation not processed">
        <div className="notice bad" role="alert">
          <strong>
            {koneksi
              ? 'The connection dropped while processing the transaction'
              : 'The transaction was cancelled'}
          </strong>
          <span>
            {koneksi ? (
              galat.pesan
            ) : (
              <>
                The whole process was cancelled.{' '}
                <b>Your balance is unchanged</b>
                {info ? ` (${rupiah(info.saldo)})` : ''} and no transaction was
                recorded.
              </>
            )}
          </span>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void kirim()}
            disabled={mengirim}
            aria-busy={mengirim}
          >
            {mengirim ? 'Processing donation…' : 'Try again'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={tutupBilaBoleh}
            disabled={mengirim}
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={tutupBilaBoleh}
      title="Donate"
      subtitle={
        info ? (
          <>
            to <b style={{ color: 'var(--ink)' }}>{info.tujuan.nama}</b>
          </>
        ) : undefined
      }
    >
      {info ? (
        tampilkanFormulir(info)
      ) : galatMuat ? (
        <>
          {noticeGalat(galatMuat, 'Donation form not available')}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onTutup}
          >
            Close
          </button>
        </>
      ) : (
        <p className="muted">Loading donation form…</p>
      )}
    </Modal>
  );
}
