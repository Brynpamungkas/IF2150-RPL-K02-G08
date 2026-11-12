'use client';

import { useRef, useState } from 'react';
import { formatTanggal } from '@/shared/detail';
import type {
  KeputusanPendaftaran,
  PendaftaranRelawanDto,
  StatusPendaftaran,
} from '@/shared/relawan';
import { Modal } from '../../ui/Modal';

interface Props {
  idProject: string;
  judul: string;
  kuota: number;
  pendaftar: PendaftaranRelawanDto[];
  onTutup: () => void;
  /** Dipanggil setelah satu keputusan tersimpan, dengan data terbaru dari server. */
  onKeputusan: (pendaftaran: PendaftaranRelawanDto) => void;
}

const LABEL_STATUS: Record<StatusPendaftaran, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};
const KELAS_STATUS: Record<StatusPendaftaran, string> = {
  pending: 'warn',
  accepted: 'ok',
  rejected: 'bad',
};
const URUTAN: Record<StatusPendaftaran, number> = {
  pending: 0,
  accepted: 1,
  rejected: 2,
};

type JawabanApi = { pesan?: string; pendaftaran?: PendaftaranRelawanDto };

/** Batas tunggu peladen; lewat dari ini permintaan dibatalkan. */
const BATAS_WAKTU_MS = 15_000;

/**
 * C35 - FormVolunteerManagementView (Boundary). Daftar pendaftar relawan
 * untuk pemilik project; menerima atau menolak satu per satu (UC08, KF20,
 * KF21, issue #34). Kuota dan status dijaga peladen; pesan penolakannya
 * (mis. kuota penuh) ditampilkan di bawah pendaftar yang bersangkutan.
 */
export function FormVolunteerManagementView({
  idProject,
  judul,
  kuota,
  pendaftar,
  onTutup,
  onKeputusan,
}: Props) {
  const [diproses, setDiproses] = useState<string | null>(null);
  // Pendaftar yang penolakannya sedang menunggu konfirmasi.
  const [konfirmasiTolak, setKonfirmasiTolak] = useState<string | null>(null);
  const sedangProses = useRef(false); // penjaga sinkron klik ganda
  const [galat, setGalat] = useState<{ id: string; pesan: string } | null>(
    null,
  );

  const diterima = pendaftar.filter((p) => p.status === 'accepted').length;
  // `kuota > 0`: kuota 0 berarti belum diketahui, jangan mengunci tombol.
  const penuh = kuota > 0 && diterima >= kuota;
  const urut = [...pendaftar].sort(
    (a, b) =>
      URUTAN[a.status] - URUTAN[b.status] ||
      a.tanggalDaftar.localeCompare(b.tanggalDaftar),
  );

  async function putuskan(
    pendaftaran: PendaftaranRelawanDto,
    keputusan: KeputusanPendaftaran,
  ) {
    if (sedangProses.current) return;
    sedangProses.current = true;
    setDiproses(pendaftaran.idPendaftaran);
    setKonfirmasiTolak(null);
    setGalat(null);
    // Tanpa batas waktu, peladen yang menggantung mengunci modal selamanya.
    const pembatal = new AbortController();
    const pewaktu = setTimeout(() => pembatal.abort(), BATAS_WAKTU_MS);
    try {
      const respons = await fetch(
        `/api/projects/${encodeURIComponent(idProject)}/relawan/${encodeURIComponent(pendaftaran.idPendaftaran)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keputusan }),
          signal: pembatal.signal,
        },
      );
      const isi = (await respons.json().catch(() => ({}))) as JawabanApi;
      if (respons.ok && isi.pendaftaran) {
        onKeputusan(isi.pendaftaran);
      } else {
        setGalat({
          id: pendaftaran.idPendaftaran,
          pesan: isi.pesan ?? 'Your decision could not be saved.',
        });
      }
    } catch {
      setGalat({
        id: pendaftaran.idPendaftaran,
        pesan: pembatal.signal.aborted
          ? 'The server took too long to respond. Please try again.'
          : 'Connection lost. Check your network and try again.',
      });
    } finally {
      clearTimeout(pewaktu);
      sedangProses.current = false;
      setDiproses(null);
    }
  }

  return (
    <Modal
      open
      wide
      onClose={() => {
        if (!sedangProses.current) onTutup();
      }}
      title="Manage volunteers"
      subtitle={
        <>
          <b style={{ color: 'var(--ink)' }}>{judul}</b> · {diterima} of {kuota}{' '}
          spots filled
        </>
      }
    >
      {urut.length === 0 ? (
        <div className="empty">
          <h3>No applications yet</h3>
          <p>Applications will appear here as soon as volunteers sign up.</p>
        </div>
      ) : (
        <ul style={{ display: 'grid', gap: 14, listStyle: 'none', padding: 0 }}>
          {urut.map((p) => (
            <li
              key={p.idPendaftaran}
              style={{
                border: '1.5px solid #dce0d6',
                borderRadius: 16,
                padding: 16,
                display: 'grid',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <b>{p.dataDiri.nama || 'Unnamed volunteer'}</b>
                <span className={`chip ${KELAS_STATUS[p.status]}`}>
                  {LABEL_STATUS[p.status]}
                </span>
              </div>
              <p className="small muted">
                {p.dataDiri.telepon} · {p.dataDiri.kota} · applied{' '}
                {formatTanggal(p.tanggalDaftar)}
              </p>
              <p className="small">
                <b>Skills:</b> {p.keahlian.join(', ') || '-'}
              </p>
              <p className="small">
                <b>Experience:</b> {p.pengalaman || '-'}
              </p>
              <p className="small">
                <b>Available:</b> {p.jadwal.join(' · ') || '-'}
              </p>

              {galat?.id === p.idPendaftaran && (
                <div className="notice bad" role="alert">
                  <strong>Decision not saved</strong>
                  <span>{galat.pesan}</span>
                </div>
              )}

              {p.status === 'pending' && penuh && (
                <p className="small muted">
                  All {kuota} spots are filled. You can still reject this
                  application.
                </p>
              )}

              {p.status === 'pending' &&
                konfirmasiTolak === p.idPendaftaran && (
                  <div className="notice warn" role="alertdialog">
                    <strong>
                      Reject {p.dataDiri.nama || 'this volunteer'}?
                    </strong>
                    <span>This cannot be undone.</span>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={diproses !== null}
                        aria-busy={diproses === p.idPendaftaran}
                        onClick={() => void putuskan(p, 'rejected')}
                      >
                        Yes, reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={diproses !== null}
                        onClick={() => setKonfirmasiTolak(null)}
                      >
                        Keep
                      </button>
                    </div>
                  </div>
                )}

              {p.status === 'pending' &&
                konfirmasiTolak !== p.idPendaftaran && (
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={diproses !== null || penuh}
                      aria-busy={diproses === p.idPendaftaran}
                      aria-label={`Accept ${p.dataDiri.nama}`}
                      onClick={() => void putuskan(p, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={diproses !== null}
                      aria-label={`Reject ${p.dataDiri.nama}`}
                      onClick={() => {
                        setGalat(null);
                        setKonfirmasiTolak(p.idPendaftaran);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
