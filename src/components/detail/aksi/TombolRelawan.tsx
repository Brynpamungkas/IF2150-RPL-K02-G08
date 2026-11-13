'use client';

import { useState } from 'react';
import { FormPendaftaranRelawanView } from '@/components/views/RelawanView/FormPendaftaranRelawanView';
import { IkonTangan } from '@/components/ui/Ikon';
import type { DetailAksi } from '@/shared/detail';

export function TombolRelawan({ detail }: { detail: DetailAksi }) {
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  if (detail.terbukaRelawan) {
    return (
      <>
        {terkirim ? (
          <div className="notice ok" role="status">
            <strong>Application sent</strong>
            <span>
              The organizer will review it. Check <b>My account</b> for the
              decision.
            </span>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => setFormTerbuka(true)}
          >
            <IkonTangan /> Volunteer for this
          </button>
        )}
        {formTerbuka && (
          <FormPendaftaranRelawanView
            idProject={detail.id}
            judul={detail.judul}
            keahlianOpsi={detail.keahlian}
            mulai={detail.mulai}
            selesai={detail.selesai}
            onTutup={() => setFormTerbuka(false)}
            onBerhasil={() => {
              setFormTerbuka(false);
              setTerkirim(true);
            }}
          />
        )}
      </>
    );
  }

  const penuh = (detail.relawanDiterima ?? 0) >= (detail.kuotaRelawan ?? 0);
  return (
    <>
      <div className="notice warn">
        <strong>
          {penuh ? 'Volunteer spots are full' : 'Volunteer sign-up is closed'}
        </strong>
        <span>You can still help with a donation.</span>
      </div>
      <button type="button" className="btn btn-block" aria-disabled="true">
        Sign-up closed
      </button>
    </>
  );
}
