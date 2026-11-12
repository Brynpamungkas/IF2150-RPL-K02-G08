'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { SesiContext } from '@/components/ui/SesiContext';
import { useToast } from '@/components/ui/Toast';
import { FormProgresProjectView } from '@/components/views/ProgresView/FormProgresProjectView';
import { FormVolunteerManagementView } from '@/components/views/RelawanView/FormVolunteerManagementView';
import type { DetailAksi } from '@/shared/detail';
import type { PendaftaranRelawanDto } from '@/shared/relawan';

/**
 * Tombol khusus pemilik project di panel samping halaman detail.
 * Pemilik dikenali dari jawaban peladen: daftar pendaftar hanya terbuka bagi
 * pembuat project, jadi 401/403 berarti bukan pemilik.
 *
 * Admin Sistem boleh memperbarui progres project mana pun (UC09, KF14), jadi
 * ia mendapat tombol progres saja. Mengelola relawan tetap khusus pemilik
 * (KF21), sehingga tombolnya hanya muncul bila daftar pendaftar terbuka.
 * Peran hanya menentukan tombol yang tampil; peladen yang memutuskan akses.
 */
export function AksiPemilik({ detail }: { detail: DetailAksi }) {
  const router = useRouter();
  const { showToast } = useToast();
  const adalahAdmin = useContext(SesiContext)?.pengguna?.peran === 'admin';
  const [pendaftar, setPendaftar] = useState<PendaftaranRelawanDto[] | null>(
    null,
  );
  const [kelolaTerbuka, setKelolaTerbuka] = useState(false);
  const [progresTerbuka, setProgresTerbuka] = useState(false);
  const adalahProject = detail.tipe === 'project';

  useEffect(() => {
    if (!adalahProject) return;
    let batal = false;
    fetch(`/api/projects/${encodeURIComponent(detail.id)}/relawan`)
      .then(async (respons) => {
        if (!respons.ok) return null;
        const isi = (await respons.json()) as {
          pendaftar?: PendaftaranRelawanDto[];
        };
        return isi.pendaftar ?? null;
      })
      .then((daftar) => {
        if (!batal) setPendaftar(daftar);
      })
      .catch(() => {
        if (!batal) setPendaftar(null);
      });
    return () => {
      batal = true;
    };
  }, [adalahProject, detail.id]);

  const adalahPemilik = pendaftar !== null;
  if (!adalahProject || (!adalahPemilik && !adalahAdmin)) return null;

  const menunggu = (pendaftar ?? []).filter(
    (p) => p.status === 'pending',
  ).length;

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => setProgresTerbuka(true)}
      >
        Post a progress update
      </button>
      {adalahPemilik && (
        <button
          type="button"
          className="btn btn-light btn-block"
          onClick={() => setKelolaTerbuka(true)}
        >
          Manage volunteers{menunggu > 0 ? ` (${menunggu} pending)` : ''}
        </button>
      )}
      {progresTerbuka && (
        <FormProgresProjectView
          idProject={detail.id}
          judul={detail.judul}
          statusAwal={detail.statusPelaksanaan}
          onTutup={() => setProgresTerbuka(false)}
          onBerhasil={() => {
            setProgresTerbuka(false);
            showToast('Progress update posted.', 'ok');
            // timeline dan status project dibaca ulang dari peladen
            router.refresh();
          }}
        />
      )}
      {kelolaTerbuka && pendaftar !== null && (
        <FormVolunteerManagementView
          idProject={detail.id}
          judul={detail.judul}
          kuota={detail.kuotaRelawan ?? 0}
          pendaftar={pendaftar}
          onTutup={() => setKelolaTerbuka(false)}
          onKeputusan={(baru) => {
            setPendaftar((now) =>
              (now ?? []).map((p) =>
                p.idPendaftaran === baru.idPendaftaran ? baru : p,
              ),
            );
            showToast(
              baru.status === 'accepted'
                ? 'Volunteer accepted.'
                : 'Application rejected.',
              baru.status === 'accepted' ? 'ok' : 'info',
            );
            // kuota "x of y people" di panel samping dibaca ulang dari peladen
            router.refresh();
          }}
        />
      )}
    </>
  );
}
