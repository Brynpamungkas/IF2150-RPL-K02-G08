'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { FormVolunteerManagementView } from '@/components/views/RelawanView/FormVolunteerManagementView';
import type { DetailAksi } from '@/shared/detail';
import type { PendaftaranRelawanDto } from '@/shared/relawan';

/**
 * Tombol khusus pemilik project di panel samping halaman detail.
 * Pemilik dikenali dari jawaban peladen: daftar pendaftar hanya terbuka bagi
 * pembuat project, jadi 401/403 berarti pengunjung biasa dan tidak ada yang
 * ditampilkan.
 */
export function AksiPemilik({ detail }: { detail: DetailAksi }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pendaftar, setPendaftar] = useState<PendaftaranRelawanDto[] | null>(
    null,
  );
  const [kelolaTerbuka, setKelolaTerbuka] = useState(false);
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

  if (!adalahProject || pendaftar === null) return null;

  const menunggu = pendaftar.filter((p) => p.status === 'pending').length;

  return (
    <>
      <button
        type="button"
        className="btn btn-light btn-block"
        onClick={() => setKelolaTerbuka(true)}
      >
        Manage volunteers{menunggu > 0 ? ` (${menunggu} pending)` : ''}
      </button>
      {kelolaTerbuka && (
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
