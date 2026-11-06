'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { HasilKatalog, ItemKatalog, OpsiKatalog } from '@/shared/katalog';
import {
  FILTER_KOSONG,
  adaFilter,
  keQueryApi,
  keQueryUrl,
  type FilterExplore,
} from '@/shared/explore';
import { KartuHasil } from '@/components/ui/KartuHasil';
import { IkonCari } from '@/components/ui/Ikon';
import { FormPencarianView } from './FormPencarianView';
import { FormPetaWilayahView } from './FormPetaWilayahView';

const JEDA_KETIK_MS = 300;

interface Termuat {
  kunci: string;
  data: ItemKatalog[];
  total: number;
  halaman: number;
}

interface Gagal {
  kunci: string;
  pesan: string;
}

const PESAN_GALAT_UMUM = 'The actions could not be loaded. Please try again.';

async function ambilKatalog(
  query: URLSearchParams,
  signal: AbortSignal,
): Promise<HasilKatalog> {
  const res = await fetch(`/api/katalog?${query.toString()}`, { signal });
  if (!res.ok) {
    const isi = (await res.json().catch(() => null)) as {
      pesan?: string;
    } | null;
    throw new Error(
      res.status === 400 && isi?.pesan ? isi.pesan : PESAN_GALAT_UMUM,
    );
  }
  return (await res.json()) as HasilKatalog;
}
export function ExploreView({ awal }: { awal: FilterExplore }) {
  const [filter, setFilter] = useState<FilterExplore>(awal);
  const [teks, setTeks] = useState(awal.q);
  const [termuat, setTermuat] = useState<Termuat | null>(null);
  const [gagal, setGagal] = useState<Gagal | null>(null);
  const [memuatLagi, setMemuatLagi] = useState(false);
  const [percobaan, setPercobaan] = useState(0);
  const [opsi, setOpsi] = useState<OpsiKatalog>({ kategori: [], provinsi: [] });
  const [terpilihId, setTerpilihId] = useState<string | null>(null);
  const [sorotId, setSorotId] = useState<string | null>(null);
  const [kunciAwal] = useState(() => keQueryApi(awal).toString());

  const kunci = keQueryApi(filter).toString();

  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/katalog/opsi', { signal: ac.signal })
      .then((r) => (r.ok ? (r.json() as Promise<OpsiKatalog>) : null))
      .then((hasil) => hasil && setOpsi(hasil))
      .catch(() => {
      });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    if (teks === filter.q) return;
    const t = setTimeout(
      () => setFilter((f) => ({ ...f, q: teks })),
      JEDA_KETIK_MS,
    );
    return () => clearTimeout(t);
  }, [teks, filter.q]);

  useEffect(() => {
    const ac = new AbortController();
    ambilKatalog(new URLSearchParams(kunci), ac.signal)
      .then((h) => {
        setGagal(null);
        setTermuat({
          kunci,
          data: h.data,
          total: h.total,
          halaman: h.halaman,
        });
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        setGagal({
          kunci,
          pesan: e instanceof Error ? e.message : PESAN_GALAT_UMUM,
        });
      });
    return () => ac.abort();
  }, [kunci, percobaan]);

  useEffect(() => {
    const qs = keQueryUrl(filter);
    window.history.replaceState(null, '', qs ? `/explore?${qs}` : '/explore');
  }, [filter]);

  const ubahFilter = useCallback((ubah: Partial<FilterExplore>) => {
    setFilter((f) => ({ ...f, ...ubah }));
    setTerpilihId(null);
  }, []);

  const hapusFilter = () => {
    setTeks('');
    setFilter(FILTER_KOSONG);
    setTerpilihId(null);
  };

  const muatLagi = async () => {
    if (!termuat || memuatLagi) return;
    setMemuatLagi(true);
    try {
      const h = await ambilKatalog(
        keQueryApi(filter, termuat.halaman + 1),
        new AbortController().signal,
      );
      setTermuat((lama) =>
        lama && lama.kunci === kunci
          ? {
              ...lama,
              data: [...lama.data, ...h.data],
              total: h.total,
              halaman: h.halaman,
            }
          : lama,
      );
    } catch {
      setGagal({ kunci, pesan: PESAN_GALAT_UMUM });
    } finally {
      setMemuatLagi(false);
    }
  };

  const sesuai = termuat !== null && termuat.kunci === kunci;
  const sedangMemuat = !sesuai && !(gagal && gagal.kunci === kunci);
  const daftar = termuat?.data ?? [];
  const total = termuat?.total ?? 0;
  const animasi = termuat?.kunci === kunciAwal;

  return (
    <>
      <section className="page-top">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Explore</span>
          </div>
          <h1>Explore climate actions</h1>
          <p className="lead">
            Only actions that <b>have passed review</b> appear here. Pick one on
            the map or filter by what you care about.
          </p>
          <FormPencarianView
            teks={teks}
            onTeks={setTeks}
            onCari={() => ubahFilter({ q: teks })}
            filter={filter}
            onFilter={ubahFilter}
            kategori={opsi.kategori}
            provinsi={opsi.provinsi}
          />
        </div>
      </section>

      <section className="band" style={{ paddingTop: 40 }}>
        <div className="wrap" id="exploreRes">
          {gagal && gagal.kunci === kunci && !sesuai ? (
            <div className="empty" role="alert">
              <span className="ic" style={{ color: 'var(--ink-2)' }}>
                <IkonCari />
              </span>
              <h3>Could not load actions</h3>
              <p>{gagal.pesan}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPercobaan((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="result-line">
                <h2 aria-live="polite">
                  {termuat === null ? (
                    'Loading actions…'
                  ) : (
                    <>
                      <span className="num">{total}</span>{' '}
                      {total === 1 ? 'action' : 'actions'} found
                    </>
                  )}
                </h2>
                {adaFilter(filter) && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={hapusFilter}
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="explore" aria-busy={sedangMemuat}>
                <FormPetaWilayahView
                  hasil={daftar}
                  terpilihId={terpilihId}
                  sorotId={sorotId}
                  onPilih={setTerpilihId}
                />

                <div className="list-col" onMouseLeave={() => setSorotId(null)}>
                  {termuat === null ? null : daftar.length > 0 ? (
                    <>
                      {daftar.map((item) => (
                        <KartuHasil
                          key={`${item.tipe}-${item.id}`}
                          item={item}
                          terpilih={terpilihId === item.id}
                          animasi={animasi}
                          onHover={setSorotId}
                        />
                      ))}
                      {daftar.length < total && (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={muatLagi}
                          disabled={memuatLagi}
                        >
                          {memuatLagi ? 'Loading…' : 'Show more'}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="empty">
                      <span className="ic" style={{ color: 'var(--ink-2)' }}>
                        <IkonCari />
                      </span>
                      <h3>No matching actions yet</h3>
                      <p>
                        Nothing matches{' '}
                        <b>{filter.q.trim() || 'these filters'}</b>. Try another
                        keyword, or remove some filters.
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={hapusFilter}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
