'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  DOKUMENTASI_ACCEPT,
  DOKUMENTASI_PETUNJUK,
  formatUkuran,
} from '@/shared/dokumentasi';
import {
  BATAS_BERKAS_PROGRES,
  BATAS_PROGRES,
  STATUS_PELAKSANAAN,
  periksaBerkasProgres,
  validasiProgres,
  type GalatFormProgres,
  type KolomProgres,
  type MentahProgres,
  type PembaruanProgresDto,
  type StatusPelaksanaan,
} from '@/shared/progres';
import { Modal } from '../../ui/Modal';

interface Props {
  idProject: string;
  judul: string;
  /** Status saat ini; menjadi pilihan awal supaya pemilik cukup mengubahnya bila perlu. */
  statusAwal: StatusPelaksanaan | null;
  onTutup: () => void;
  onBerhasil: (pembaruan: PembaruanProgresDto) => void;
}

type JawabanApi = {
  pesan?: string;
  galat?: GalatFormProgres;
  progres?: PembaruanProgresDto;
};

const LABEL_STATUS: Record<StatusPelaksanaan, string> = {
  persiapan: 'Preparing',
  berjalan: 'In progress',
  ditunda: 'On hold',
  selesai: 'Completed',
};

/** Batas tunggu peladen; lebih longgar karena berkas ikut diunggah. */
const BATAS_WAKTU_MS = 60_000;

const URUTAN_KOLOM: KolomProgres[] = [
  'milestone',
  'statusPelaksanaan',
  'catatan',
  'persentase',
  'danaTerpakai',
  'dokumentasi',
];

/**
 * C37 - FormProgresProjectView (Boundary). Modal pembaruan progres untuk
 * pemilik project (UC09, KF23, KF24, issue #37).
 *
 * Isian diperiksa dengan `validasiProgres` dan `periksaBerkasProgres` yang
 * sama dengan peladen (shared/progres.ts). Hak pembaruan (pemilik atau Admin)
 * dan status terpublikasi diputuskan peladen; pesannya ditampilkan apa adanya.
 */
export function FormProgresProjectView({
  idProject,
  judul,
  statusAwal,
  onTutup,
  onBerhasil,
}: Props) {
  const idDasar = useId();
  const id = (kolom: string) => `${idDasar}-${kolom}`;

  const [milestone, setMilestone] = useState('');
  const [status, setStatus] = useState<string>(statusAwal ?? '');
  const [catatan, setCatatan] = useState('');
  const [persentase, setPersentase] = useState('');
  const [danaTerpakai, setDanaTerpakai] = useState('');
  const [berkas, setBerkas] = useState<File[]>([]);
  const [galat, setGalat] = useState<GalatFormProgres>({});
  const [galatUmum, setGalatUmum] = useState<string | null>(null);
  const [perluLogin, setPerluLogin] = useState(false);
  const [mengirim, setMengirim] = useState(false);

  const sedangKirim = useRef(false); // penjaga sinkron klik ganda
  // Kolom yang harus difokuskan setelah input aktif lagi (galat dari peladen).
  const fokusTertunda = useRef<KolomProgres | null>(null);

  // Saat mengirim semua input `disabled`, jadi `.focus()` tidak berefek.
  // Fokus baru diberikan setelah `mengirim` kembali false.
  useEffect(() => {
    if (mengirim || !fokusTertunda.current) return;
    document.getElementById(`${idDasar}-${fokusTertunda.current}`)?.focus();
    fokusTertunda.current = null;
  }, [mengirim, idDasar]);

  function tutupBilaBoleh() {
    if (!sedangKirim.current) onTutup();
  }

  function fokusKeKolom(kolom: KolomProgres) {
    document.getElementById(id(kolom))?.focus();
  }

  function pilihBerkas(daftar: FileList | null) {
    const baru = daftar ? Array.from(daftar) : [];
    setBerkas(baru);
    const pesan = periksaBerkasProgres(
      baru.map((b) => ({ nama: b.name, tipe: b.type, ukuran: b.size })),
    );
    setGalat((now) => ({ ...now, dokumentasi: pesan }));
  }

  async function kirim() {
    if (sedangKirim.current) return;

    const mentah: MentahProgres = {
      milestone: milestone.trim(),
      statusPelaksanaan: status,
      catatan: catatan.trim(),
      persentase: persentase.trim(),
      danaTerpakai: danaTerpakai.trim(),
    };
    const hasil = validasiProgres(mentah);
    const salah: GalatFormProgres = hasil.valid ? {} : { ...hasil.galat };
    const galatBerkas = periksaBerkasProgres(
      berkas.map((b) => ({ nama: b.name, tipe: b.type, ukuran: b.size })),
    );
    if (galatBerkas) salah.dokumentasi = galatBerkas;

    setGalat(salah);
    setGalatUmum(null);
    setPerluLogin(false);
    const pertama = URUTAN_KOLOM.find((kolom) => salah[kolom]);
    if (pertama) {
      fokusKeKolom(pertama);
      return;
    }

    const badan = new FormData();
    badan.set('milestone', mentah.milestone);
    badan.set('statusPelaksanaan', mentah.statusPelaksanaan);
    badan.set('catatan', mentah.catatan);
    badan.set('persentase', mentah.persentase);
    badan.set('danaTerpakai', mentah.danaTerpakai);
    for (const satu of berkas) badan.append('dokumentasi', satu);

    sedangKirim.current = true;
    setMengirim(true);
    // Tanpa batas waktu, peladen yang menggantung mengunci modal (Cancel dan
    // penutupan dinonaktifkan selama mengirim).
    const pembatal = new AbortController();
    const pewaktu = setTimeout(() => pembatal.abort(), BATAS_WAKTU_MS);
    try {
      // Tanpa header Content-Type: peramban mengisi batas multipart sendiri.
      const respons = await fetch(
        `/api/projects/${encodeURIComponent(idProject)}/progres`,
        { method: 'POST', body: badan, signal: pembatal.signal },
      );
      const isi = (await respons.json().catch(() => ({}))) as JawabanApi;

      if (respons.ok && isi.progres) {
        onBerhasil(isi.progres);
        return;
      }
      if (isi.galat) {
        setGalat(isi.galat);
        const kolom = URUTAN_KOLOM.find((k) => isi.galat?.[k]);
        if (kolom) fokusTertunda.current = kolom;
      }
      setPerluLogin(respons.status === 401);
      setGalatUmum(isi.pesan ?? 'Your progress update could not be saved.');
    } catch {
      setGalatUmum(
        pembatal.signal.aborted
          ? 'The server took too long to respond. Please try again.'
          : 'Connection lost. Check your network and try again.',
      );
    } finally {
      clearTimeout(pewaktu);
      sedangKirim.current = false;
      setMengirim(false);
    }
  }

  function pesanGalat(kolom: KolomProgres) {
    return galat[kolom] ? (
      <span id={id(`${kolom}-err`)} className="err-msg" role="alert">
        {galat[kolom]}
      </span>
    ) : null;
  }

  function atribut(kolom: KolomProgres) {
    return {
      id: id(kolom),
      className: `inp${galat[kolom] ? ' err' : ''}`,
      disabled: mengirim,
      'aria-invalid': galat[kolom] ? (true as const) : undefined,
      'aria-describedby': galat[kolom] ? id(`${kolom}-err`) : undefined,
    };
  }

  return (
    <Modal
      open
      wide
      onClose={tutupBilaBoleh}
      title="Post a progress update"
      subtitle={
        <>
          for <b style={{ color: 'var(--ink)' }}>{judul}</b>
        </>
      }
    >
      <form
        noValidate
        style={{ display: 'grid', gap: 18 }}
        onSubmit={(e) => {
          e.preventDefault();
          void kirim();
        }}
      >
        <div className="field">
          <label htmlFor={id('milestone')}>Milestone</label>
          <input
            {...atribut('milestone')}
            value={milestone}
            maxLength={BATAS_PROGRES.milestone}
            autoFocus
            placeholder="Planting phase 1 complete"
            onChange={(e) => setMilestone(e.target.value)}
          />
          {pesanGalat('milestone')}
        </div>

        <div className="field">
          <label htmlFor={id('statusPelaksanaan')}>Status</label>
          <select
            {...atribut('statusPelaksanaan')}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" disabled>
              Choose a status
            </option>
            {STATUS_PELAKSANAAN.map((s) => (
              <option key={s} value={s}>
                {LABEL_STATUS[s]}
              </option>
            ))}
          </select>
          {pesanGalat('statusPelaksanaan')}
        </div>

        <div className="field">
          <label htmlFor={id('catatan')}>
            Notes <span className="opt">(optional)</span>
          </label>
          <textarea
            {...atribut('catatan')}
            rows={4}
            value={catatan}
            maxLength={BATAS_PROGRES.catatan}
            placeholder="What happened since the last update?"
            onChange={(e) => setCatatan(e.target.value)}
          />
          {pesanGalat('catatan')}
        </div>

        <div
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          }}
        >
          <div className="field">
            <label htmlFor={id('persentase')}>
              Completion % <span className="opt">(optional)</span>
            </label>
            <input
              {...atribut('persentase')}
              value={persentase}
              inputMode="numeric"
              maxLength={3}
              placeholder="35"
              onChange={(e) => setPersentase(e.target.value)}
            />
            {pesanGalat('persentase')}
          </div>
          <div className="field">
            <label htmlFor={id('danaTerpakai')}>
              Funds spent <span className="opt">(optional)</span>
            </label>
            <div className="prefix">
              <span>Rp</span>
              <input
                {...atribut('danaTerpakai')}
                value={danaTerpakai}
                inputMode="numeric"
                placeholder="24500000"
                onChange={(e) => setDanaTerpakai(e.target.value)}
              />
            </div>
            {pesanGalat('danaTerpakai')}
          </div>
        </div>

        <div className="field">
          <label htmlFor={id('dokumentasi')}>
            Documentation <span className="opt">(optional)</span>
          </label>
          <input
            {...atribut('dokumentasi')}
            type="file"
            multiple
            accept={DOKUMENTASI_ACCEPT}
            onChange={(e) => pilihBerkas(e.target.files)}
          />
          <span className="small muted">
            {DOKUMENTASI_PETUNJUK} Up to {BATAS_BERKAS_PROGRES} files per
            update.
          </span>
          {berkas.length > 0 && (
            <ul className="small" style={{ paddingLeft: 18 }}>
              {berkas.map((b) => (
                <li key={`${b.name}-${b.size}-${b.lastModified}`}>
                  {b.name} · {formatUkuran(b.size)}
                </li>
              ))}
            </ul>
          )}
          {pesanGalat('dokumentasi')}
        </div>

        {galatUmum && (
          <div className="notice bad" role="alert">
            <strong>Update not saved</strong>
            <span>{galatUmum}</span>
            {perluLogin && (
              <a className="btn btn-primary btn-sm" href="/login">
                Log in
              </a>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mengirim}
            aria-busy={mengirim}
          >
            {mengirim ? 'Saving…' : 'Post update'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={tutupBilaBoleh}
            disabled={mengirim}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
