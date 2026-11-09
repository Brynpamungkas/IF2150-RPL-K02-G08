'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatTanggal } from '@/shared/detail';
import type { PendaftaranSayaDto, StatusPendaftaran } from '@/shared/relawan';

const LABEL_STATUS: Record<StatusPendaftaran, string> = {
  pending: 'Waiting for a decision',
  accepted: 'Accepted',
  rejected: 'Not selected',
};
const KELAS_STATUS: Record<StatusPendaftaran, string> = {
  pending: 'warn',
  accepted: 'ok',
  rejected: 'bad',
};

type Keadaan =
  | { tahap: 'memuat' }
  | { tahap: 'gagal'; pesan: string; perluLogin: boolean }
  | { tahap: 'siap'; daftar: PendaftaranSayaDto[] };

function periode(p: PendaftaranSayaDto): string {
  if (!p.jadwalMulai) return '-';
  const mulai = formatTanggal(p.jadwalMulai);
  const selesai = formatTanggal(p.jadwalSelesai);
  return p.jadwalSelesai && selesai !== mulai ? `${mulai} – ${selesai}` : mulai;
}

/**
 * C36 - DetailStatusPendaftaranView (Boundary). Isi tab "Volunteer
 * applications" pada halaman Account (UC07, KF22, issue #35).
 *
 * Titik kumpul hanya tampil bila pendaftaran diterima. Itu dijaga peladen:
 * untuk pending dan rejected, `lokasiKumpul` memang tidak dikirim.
 */
export function DetailStatusPendaftaranView() {
  const [keadaan, setKeadaan] = useState<Keadaan>({ tahap: 'memuat' });

  useEffect(() => {
    let batal = false;
    fetch('/api/relawan/saya')
      .then(async (respons) => {
        const isi = (await respons.json().catch(() => ({}))) as {
          pesan?: string;
          pendaftaran?: PendaftaranSayaDto[];
        };
        if (batal) return;
        if (respons.ok && isi.pendaftaran) {
          setKeadaan({ tahap: 'siap', daftar: isi.pendaftaran });
        } else {
          setKeadaan({
            tahap: 'gagal',
            pesan: isi.pesan ?? 'Your applications could not be loaded.',
            perluLogin: respons.status === 401,
          });
        }
      })
      .catch(() => {
        if (!batal) {
          setKeadaan({
            tahap: 'gagal',
            pesan: 'Connection lost. Check your network and reload.',
            perluLogin: false,
          });
        }
      });
    return () => {
      batal = true;
    };
  }, []);

  if (keadaan.tahap === 'memuat') {
    return (
      <p className="small muted" role="status">
        Loading your applications…
      </p>
    );
  }

  if (keadaan.tahap === 'gagal') {
    return (
      <div className="notice bad" role="alert">
        <strong>Applications not available</strong>
        <span>{keadaan.pesan}</span>
        {keadaan.perluLogin && (
          <Link className="btn btn-primary btn-sm" href="/login">
            Log in
          </Link>
        )}
      </div>
    );
  }

  if (keadaan.daftar.length === 0) {
    return (
      <div className="empty">
        <h3>No volunteer applications yet</h3>
        <p>
          When you apply to volunteer on a project, its status will appear here.
        </p>
        <Link className="btn btn-primary" href="/explore">
          Find a project
        </Link>
      </div>
    );
  }

  return (
    <ul style={{ display: 'grid', gap: 14, listStyle: 'none', padding: 0 }}>
      {keadaan.daftar.map((p) => (
        <li
          key={p.idPendaftaran}
          style={{
            border: '1.5px solid #dce0d6',
            borderRadius: 16,
            padding: 18,
            display: 'grid',
            gap: 10,
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>
              <Link href={`/project/${encodeURIComponent(p.idProject)}`}>
                {p.namaProject}
              </Link>
            </h3>
            <span className={`chip ${KELAS_STATUS[p.status]}`}>
              {LABEL_STATUS[p.status]}
            </span>
          </div>
          <p className="small muted">
            {p.kota}, {p.provinsi} · applied {formatTanggal(p.tanggalDaftar)}
            {p.tanggalKeputusan
              ? ` · decided ${formatTanggal(p.tanggalKeputusan)}`
              : ''}
          </p>

          {p.status === 'accepted' && (
            <div className="notice ok">
              <strong>You are in. Here is where to go.</strong>
              <span>
                <b>Meeting point:</b>{' '}
                {p.lokasiKumpul ?? 'The organizer has not set it yet.'}
              </span>
              <span>
                <b>Activity period:</b> {periode(p)}
              </span>
              {p.jadwal.length > 0 && (
                <span>
                  <b>Your days:</b> {p.jadwal.join(' · ')}
                </span>
              )}
            </div>
          )}
          {p.status === 'pending' && (
            <p className="small">
              The organizer is still reviewing your application. The meeting
              point is shared once you are accepted.
            </p>
          )}
          {p.status === 'rejected' && (
            <p className="small">
              This time the organizer could not place you. You can still support
              the project with a donation.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
