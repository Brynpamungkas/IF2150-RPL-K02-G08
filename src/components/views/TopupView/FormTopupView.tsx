'use client';

import { useEffect, useRef, useState } from 'react';
import type { ApiGagal } from '@/shared/donasi';
import {
  LABEL_METODE,
  NOMINAL_TOPUP,
  nominalTopupValid,
  type HasilTopup,
  type InfoTopup,
  type MetodeTopup,
} from '@/shared/topup';
import { IkonPanah } from '../../ui/Ikon';
import { Modal } from '../../ui/Modal';
import { rupiah, waktuLokal } from '../DonasiView/format';
import { panggilApi } from '../DonasiView/panggilApi';

interface Props {
  onTutup: () => void;
  /** Dipanggil setelah saldo bertambah, mis. untuk memuat ulang saldo di halaman. */
  onBerhasil?: (hasil: HasilTopup) => void;
  /** Nominal terpilih saat modal dibuka (mis. kekurangan saldo donasi). */
  nominalAwal?: number;
  /** Bila ada, layar selesai menampilkan "Continue donating" alih-alih "Done". */
  onLanjutDonasi?: () => void;
}

type Langkah = 'pilih' | 'bayar' | 'selesai';

const NAMA_METODE: Record<MetodeTopup, string> = {
  va: 'Bank transfer (virtual account)',
  qr: 'E-wallet (QR)',
};

/** Nomor VA tiruan untuk simulasi; tidak ada pembayaran sungguhan. */
const NOMOR_VA = '8808 0812 3344 5566';

function IkonCentang() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Modal top-up saldo simulasi (prototipe: modal topup). Tambahan di luar use case,
 * dicatat pada Tabel B.1 baris 1. Tiga langkah seperti prototipe:
 * pilih nominal dan metode -> halaman pembayaran simulasi -> bukti top-up.
 * Saldo baru ditambahkan server saat "I've paid" ditekan, dalam satu transaksi.
 */
export function FormTopupView({
  onTutup,
  onBerhasil,
  nominalAwal,
  onLanjutDonasi,
}: Props) {
  const [langkah, setLangkah] = useState<Langkah>('pilih');
  const [info, setInfo] = useState<InfoTopup | null>(null);
  const [galatMuat, setGalatMuat] = useState<ApiGagal | null>(null);
  const [nominal, setNominal] = useState<number>(
    nominalAwal && nominalTopupValid(nominalAwal) ? nominalAwal : 100_000,
  );
  const [metode, setMetode] = useState<MetodeTopup>('va');
  const [galatNominal, setGalatNominal] = useState<string | null>(null);
  const [galat, setGalat] = useState<ApiGagal | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const [hasil, setHasil] = useState<HasilTopup | null>(null);
  const [batasBayar] = useState(() =>
    new Date(Date.now() + 86_400_000).toISOString(),
  );

  const sedangKirim = useRef(false); // penjaga sinkron klik ganda

  useEffect(() => {
    let batal = false;
    panggilApi<InfoTopup>('/api/topup').then((h) => {
      if (batal) return;
      if (h.ok) setInfo(h.data);
      else setGalatMuat(h);
    });
    return () => {
      batal = true;
    };
  }, []);

  /** Modal tidak boleh ditutup selama proses, agar hasil top-up tidak hilang. */
  function tutupBilaBoleh() {
    if (!sedangKirim.current) onTutup();
  }

  function pilihNominal(n: number) {
    setNominal(n);
    setGalatNominal(null);
  }

  function lanjutBayar() {
    if (!nominalTopupValid(nominal)) {
      setGalatNominal('Choose a top-up amount.');
      return;
    }
    setGalat(null);
    setLangkah('bayar');
  }

  async function konfirmasiBayar() {
    if (sedangKirim.current) return;
    sedangKirim.current = true;
    setMengirim(true);
    setGalat(null);
    try {
      const h = await panggilApi<HasilTopup>('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nominal, metode }),
      });
      if (h.ok) {
        setHasil(h.data);
        setInfo({ saldo: h.data.saldoSesudah });
        setLangkah('selesai');
        onBerhasil?.(h.data);
        return;
      }
      if (h.kode === 'NOMINAL_TOPUP_TIDAK_VALID') {
        setGalatNominal(h.pesan);
        setLangkah('pilih');
        return;
      }
      setGalat(h);
    } finally {
      sedangKirim.current = false;
      setMengirim(false);
    }
  }

  function noticeGalat(g: ApiGagal, judul: string) {
    return (
      <div className="notice bad" role="alert">
        <strong>{judul}</strong>
        <span>{g.pesan}</span>
      </div>
    );
  }

  if (langkah === 'selesai' && hasil) {
    return (
      <Modal open onClose={tutupBilaBoleh} title="Balance topped up">
        <div className="receipt">
          <span className="tick">
            <IkonCentang />
          </span>
          <p className="lead" style={{ textAlign: 'center' }}>
            <b>{rupiah(hasil.nominal)}</b> was added to your donation balance.
          </p>
          <dl>
            <dt>Transaction ID</dt>
            <dd>{hasil.idTopup}</dd>
            <dt>Method</dt>
            <dd>{hasil.metode}</dd>
            <dt>Time</dt>
            <dd>{waktuLokal(hasil.waktu)}</dd>
            <dt>Current balance</dt>
            <dd>{rupiah(hasil.saldoSesudah)}</dd>
          </dl>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            {onLanjutDonasi ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onLanjutDonasi}
              >
                Continue donating
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onTutup}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  if (langkah === 'bayar') {
    return (
      <Modal
        open
        onClose={tutupBilaBoleh}
        title="Complete your payment"
        subtitle="This is a simulation. No real money moves."
      >
        <div className="sum">
          <div className="r">
            <span>Amount</span>
            <b>{rupiah(nominal)}</b>
          </div>
          <div className="r">
            <span>Method</span>
            <b>{NAMA_METODE[metode]}</b>
          </div>
        </div>

        {metode === 'va' ? (
          <div className="field">
            <span className="lbl">Virtual account number</span>
            <span className="va">{NOMOR_VA}</span>
            <span className="hint">
              Transfer exactly {rupiah(nominal)} before {waktuLokal(batasBayar)}
              .
            </span>
          </div>
        ) : (
          <div className="qr-wrap">
            <div className="qr-sim" role="img" aria-label="Simulated QR code" />
            <span className="small muted">Scan with your e-wallet app</span>
          </div>
        )}

        {galat ? noticeGalat(galat, 'Top-up not processed') : null}

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => void konfirmasiBayar()}
          disabled={mengirim}
          aria-busy={mengirim}
        >
          {mengirim ? 'Checking payment…' : "I've paid"}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => setLangkah('pilih')}
          disabled={mengirim}
        >
          Change amount or method
        </button>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={tutupBilaBoleh}
      title="Top up balance"
      subtitle={
        <>
          Your balance is used for donations. Payments in this prototype are{' '}
          <b>simulated only</b>.
        </>
      }
    >
      {galatMuat ? (
        <>
          {noticeGalat(galatMuat, 'Top-up not available')}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onTutup}
          >
            Close
          </button>
        </>
      ) : (
        <>
          <div className="sum" aria-live="polite">
            <div className="r">
              <span>Current balance</span>
              <b>{info ? rupiah(info.saldo) : '…'}</b>
            </div>
          </div>

          <div className="field">
            <span className="lbl">Choose an amount</span>
            <div className="amounts">
              {NOMINAL_TOPUP.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={nominal === n ? 'on' : undefined}
                  aria-pressed={nominal === n}
                  onClick={() => pilihNominal(n)}
                >
                  {rupiah(n)}
                </button>
              ))}
            </div>
            {!(NOMINAL_TOPUP as readonly number[]).includes(nominal) &&
            nominalTopupValid(nominal) ? (
              <span className="hint">
                Suggested to cover your donation: <b>{rupiah(nominal)}</b>
              </span>
            ) : null}
            {galatNominal ? (
              <span className="err-msg" role="alert">
                {galatNominal}
              </span>
            ) : null}
          </div>

          <fieldset
            className="field"
            style={{ border: 0, padding: 0, margin: 0 }}
          >
            <legend className="lbl" style={{ marginBottom: 8 }}>
              Method
            </legend>
            <div className="pay-method">
              {(Object.keys(LABEL_METODE) as MetodeTopup[]).map((m) => (
                <label key={m}>
                  <input
                    type="radio"
                    name="metode-topup"
                    value={m}
                    checked={metode === m}
                    onChange={() => setMetode(m)}
                  />
                  {NAMA_METODE[m]}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={lanjutBayar}
            disabled={!info}
          >
            Continue to payment <IkonPanah />
          </button>
        </>
      )}
    </Modal>
  );
}
