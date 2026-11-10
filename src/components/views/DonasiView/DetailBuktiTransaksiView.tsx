'use client';

import type { ReactNode } from 'react';
import type { HasilDonasi } from '@/shared/donasi';
import { Modal } from '../../ui/Modal';
import { KartuBukti } from './KartuBukti';
import { LembarCetakBukti, TombolCetakBukti } from './LembarCetakBukti';
import { useBukti } from './useBukti';

interface Props {
  idTransaksi: string;
  /** Ada bila dibuka tepat setelah donasi (varian 'baru'); kosong bila dibuka ulang dari riwayat (varian 'arsip'). */
  ringkasan?: HasilDonasi;
  onTutup: () => void;
  /** Bila ada, tampil tombol "View history" (halaman My activity, KF27). */
  onLihatRiwayat?: () => void;
  /**
   * Tombol tambahan varian arsip di kiri bawah, mis. "See use of funds" dan
   * "See progress" (prototipe mHist). Diisi halaman riwayat karena butuh rute detail tujuan.
   */
  aksiArsip?: ReactNode;
}

/**
 * C31 - DetailBuktiTransaksiView (Boundary). Struk donasi dalam modal
 * (prototipe: mDonate cabang receipt; dibuka ulang seperti mHist "Activity details").
 */
export function DetailBuktiTransaksiView({
  idTransaksi,
  ringkasan,
  onTutup,
  onLihatRiwayat,
  aksiArsip,
}: Props) {
  // bukaBukti: meminta bukti transaksi berdasarkan ID transaksi.
  const keadaan = useBukti(idTransaksi);
  const varian = ringkasan ? 'baru' : 'arsip';
  const judulVarian =
    varian === 'baru' ? 'Donation successful' : 'Activity details';

  if (keadaan.status === 'gagal') {
    return (
      <Modal open onClose={onTutup} title="Receipt not available">
        <div className="notice bad" role="alert">
          <strong>Receipt not available</strong>
          <span>{keadaan.galat.pesan}</span>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={onTutup}
        >
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onTutup} title={judulVarian}>
      {keadaan.status === 'memuat' ? (
        <p className="muted">Loading receipt…</p>
      ) : (
        <>
          {/* tampilkanBukti: Donatur, tujuan dana, nominal, waktu, dan status transaksi. */}
          <KartuBukti
            bukti={keadaan.bukti}
            ringkasan={ringkasan}
            varian={varian}
          />
          {varian === 'baru' ? (
            <div className="form-actions justify-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onTutup}
              >
                Done
              </button>
              <TombolCetakBukti bukti={keadaan.bukti} />
              {onLihatRiwayat ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onLihatRiwayat}
                >
                  View history
                </button>
              ) : null}
            </div>
          ) : (
            <div className="form-actions">
              {aksiArsip}
              {/* Print receipt (AC3) hijau di kanan bawah, beda dari tombol ghost di kiri. */}
              <span className="ml-auto">
                <TombolCetakBukti
                  bukti={keadaan.bukti}
                  className="btn btn-primary"
                />
              </span>
            </div>
          )}
          <LembarCetakBukti bukti={keadaan.bukti} />
        </>
      )}
    </Modal>
  );
}
