'use client';

import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { TAB_DETAIL, type DetailAksi, type TabDetail } from '@/shared/detail';
import { PanelDana } from './PanelDana';
import { PanelKebutuhan } from './PanelKebutuhan';
import { PanelProgres } from './PanelProgres';
import { PanelTentang } from './PanelTentang';

export function KerangkaDetail({
  detail,
  sisi,
  tabAwal = 'about',
}: {
  detail: DetailAksi;
  sisi: ReactNode;
  /** Tab awal dari `?tab=`, mis. tautan dari detail riwayat. */
  tabAwal?: TabDetail;
}) {
  const [tab, setTab] = useState<TabDetail>(tabAwal);

  // Project/campaign berbeda memakai komponen yang sama, jadi tab mengikuti
  // URL saat pindah tautan tanpa menimpa pilihan tab pengguna. Disesuaikan saat
  // render (bukan lewat efek) agar tidak ada render ganda dengan tab lama.
  const [tabAwalTerakhir, setTabAwalTerakhir] = useState(tabAwal);
  if (tabAwal !== tabAwalTerakhir) {
    setTabAwalTerakhir(tabAwal);
    setTab(tabAwal);
  }

  const label: Record<TabDetail, string> = {
    about: 'About',
    needs: 'Needs',
    progress: `Progress (${detail.progres.length})`,
    funds: 'Use of funds',
  };

  const geser = (e: KeyboardEvent, dari: number) => {
    const arah = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!arah) return;
    e.preventDefault();
    const berikut =
      TAB_DETAIL[(dari + arah + TAB_DETAIL.length) % TAB_DETAIL.length];
    setTab(berikut);
    document.getElementById(`tab-${berikut}`)?.focus();
  };

  return (
    <section>
      <div className="wrap detail-grid">
        <div style={{ minWidth: 0 }}>
          <div className="tabs" role="tablist">
            {TAB_DETAIL.map((k, i) => (
              <button
                key={k}
                id={`tab-${k}`}
                role="tab"
                type="button"
                aria-selected={tab === k}
                aria-controls="panel-detail"
                tabIndex={tab === k ? 0 : -1}
                className={tab === k ? 'on' : ''}
                onClick={() => setTab(k)}
                onKeyDown={(e) => geser(e, i)}
              >
                {label[k]}
              </button>
            ))}
          </div>
          <div id="panel-detail" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'about' && <PanelTentang detail={detail} />}
            {tab === 'needs' && <PanelKebutuhan detail={detail} />}
            {tab === 'progress' && <PanelProgres progres={detail.progres} />}
            {tab === 'funds' && <PanelDana detail={detail} />}
          </div>
        </div>
        {sisi}
      </div>
    </section>
  );
}
