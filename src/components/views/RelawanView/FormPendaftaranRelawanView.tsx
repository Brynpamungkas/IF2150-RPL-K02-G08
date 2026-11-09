'use client';

import { useId, useRef, useState } from 'react';
import {
  BATAS_FORM,
  bersihkanForm,
  validasiFormPendaftaran,
  type GalatForm,
  type KolomForm,
  type PendaftaranRelawanDto,
} from '@/shared/relawan';
import { Modal } from '../../ui/Modal';
import { opsiJadwal } from './opsiJadwal';

interface Props {
  idProject: string;
  judul: string;
  /** Keahlian yang dicari project (dipilih dengan satu klik). */
  keahlianOpsi: string[];
  /** Tanggal mulai dan selesai project (YYYY-MM-DD), dasar pilihan jadwal. */
  mulai: string | null;
  selesai: string | null;
  onTutup: () => void;
  onBerhasil: (pendaftaran: PendaftaranRelawanDto) => void;
}

type JawabanApi = {
  pesan?: string;
  galat?: GalatForm;
  pendaftaran?: PendaftaranRelawanDto;
};

const URUTAN_KOLOM: KolomForm[] = [
  'nama',
  'telepon',
  'kota',
  'keahlian',
  'pengalaman',
  'jadwal',
];

function toggle(daftar: string[], butir: string): string[] {
  return daftar.includes(butir)
    ? daftar.filter((b) => b !== butir)
    : [...daftar, butir];
}

/**
 * C33 - FormPendaftaranRelawanView (Boundary). Modal pendaftaran relawan
 * (UC07, KF19, issue #32).
 *
 * Aturan isian diperiksa dengan `validasiFormPendaftaran` yang sama dengan
 * peladen (shared/relawan.ts), sehingga pesan sebelum dan sesudah kirim
 * selalu sama. Kuota, pendaftaran ganda, dan status project tetap diputuskan
 * peladen; pesannya ditampilkan apa adanya.
 */
export function FormPendaftaranRelawanView({
  idProject,
  judul,
  keahlianOpsi,
  mulai,
  selesai,
  onTutup,
  onBerhasil,
}: Props) {
  const idDasar = useId();
  const id = (kolom: string) => `${idDasar}-${kolom}`;

  const [nama, setNama] = useState('');
  const [telepon, setTelepon] = useState('');
  const [kota, setKota] = useState('');
  const [keahlian, setKeahlian] = useState<string[]>([]);
  const [keahlianLain, setKeahlianLain] = useState('');
  const [pengalaman, setPengalaman] = useState('');
  const [jadwal, setJadwal] = useState<string[]>([]);
  const [galat, setGalat] = useState<GalatForm>({});
  const [galatUmum, setGalatUmum] = useState<string | null>(null);
  const [perluLogin, setPerluLogin] = useState(false);
  const [mengirim, setMengirim] = useState(false);

  const sedangKirim = useRef(false); // penjaga sinkron klik ganda
  const pilihanJadwal = opsiJadwal(mulai, selesai);

  function tutupBilaBoleh() {
    if (!sedangKirim.current) onTutup();
  }

  function fokusKeKolom(kolom: KolomForm) {
    document.getElementById(id(kolom))?.focus();
  }

  async function kirim() {
    if (sedangKirim.current) return;

    const lain = keahlianLain.trim();
    const form = bersihkanForm({
      dataDiri: { nama, telepon, kota },
      keahlian:
        lain && !keahlian.includes(lain) ? [...keahlian, lain] : keahlian,
      pengalaman,
      jadwal,
    });
    const salah = validasiFormPendaftaran(form);
    setGalat(salah);
    setGalatUmum(null);
    setPerluLogin(false);
    const pertama = URUTAN_KOLOM.find((kolom) => salah[kolom]);
    if (pertama) {
      fokusKeKolom(pertama);
      return;
    }

    sedangKirim.current = true;
    setMengirim(true);
    try {
      const respons = await fetch(
        `/api/projects/${encodeURIComponent(idProject)}/relawan`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );
      const isi = (await respons.json().catch(() => ({}))) as JawabanApi;

      if (respons.ok && isi.pendaftaran) {
        onBerhasil(isi.pendaftaran);
        return;
      }
      if (isi.galat) {
        setGalat(isi.galat);
        const kolom = URUTAN_KOLOM.find((k) => isi.galat?.[k]);
        if (kolom) fokusKeKolom(kolom);
      }
      setPerluLogin(respons.status === 401);
      setGalatUmum(isi.pesan ?? 'Pendaftaran belum dapat dikirim.');
    } catch {
      setGalatUmum('Koneksi terputus. Periksa jaringan Anda lalu coba lagi.');
    } finally {
      sedangKirim.current = false;
      setMengirim(false);
    }
  }

  function pesanGalat(kolom: KolomForm) {
    return galat[kolom] ? (
      <span id={id(`${kolom}-err`)} className="err-msg" role="alert">
        {galat[kolom]}
      </span>
    ) : null;
  }

  function atributInput(kolom: KolomForm) {
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
      title="Volunteer application"
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
          <label htmlFor={id('nama')}>Full name</label>
          <input
            {...atributInput('nama')}
            value={nama}
            maxLength={BATAS_FORM.nama}
            autoComplete="name"
            autoFocus
            onChange={(e) => setNama(e.target.value)}
          />
          {pesanGalat('nama')}
        </div>

        <div className="field">
          <label htmlFor={id('telepon')}>Phone number</label>
          <input
            {...atributInput('telepon')}
            value={telepon}
            inputMode="tel"
            autoComplete="tel"
            placeholder="0812-3344-5566"
            onChange={(e) => setTelepon(e.target.value)}
          />
          {pesanGalat('telepon')}
        </div>

        <div className="field">
          <label htmlFor={id('kota')}>City of residence</label>
          <input
            {...atributInput('kota')}
            value={kota}
            maxLength={BATAS_FORM.kota}
            autoComplete="address-level2"
            onChange={(e) => setKota(e.target.value)}
          />
          {pesanGalat('kota')}
        </div>

        <div className="field">
          <span className="lbl" id={id('keahlian-lbl')}>
            Your skills
          </span>
          {keahlianOpsi.length > 0 && (
            <div
              className="amounts"
              role="group"
              aria-labelledby={id('keahlian-lbl')}
              style={{
                gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))',
              }}
            >
              {keahlianOpsi.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={keahlian.includes(k) ? 'on' : undefined}
                  aria-pressed={keahlian.includes(k)}
                  disabled={mengirim}
                  onClick={() => setKeahlian((now) => toggle(now, k))}
                >
                  {k}
                </button>
              ))}
            </div>
          )}
          <input
            {...atributInput('keahlian')}
            value={keahlianLain}
            maxLength={BATAS_FORM.butir}
            placeholder="Another skill (optional if you picked one above)"
            aria-label="Another skill"
            onChange={(e) => setKeahlianLain(e.target.value)}
          />
          {pesanGalat('keahlian')}
        </div>

        <div className="field">
          <label htmlFor={id('pengalaman')}>Relevant experience</label>
          <textarea
            {...atributInput('pengalaman')}
            rows={4}
            value={pengalaman}
            maxLength={BATAS_FORM.pengalaman}
            placeholder="Tell the organizer what you have done before."
            onChange={(e) => setPengalaman(e.target.value)}
          />
          {pesanGalat('pengalaman')}
        </div>

        <div className="field">
          <span className="lbl" id={id('jadwal-lbl')}>
            Days you can attend
          </span>
          <div
            id={id('jadwal')}
            tabIndex={-1}
            className="amounts"
            role="group"
            aria-labelledby={id('jadwal-lbl')}
            style={{
              gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
            }}
          >
            {pilihanJadwal.map((hari) => (
              <button
                key={hari}
                type="button"
                className={jadwal.includes(hari) ? 'on' : undefined}
                aria-pressed={jadwal.includes(hari)}
                disabled={mengirim}
                onClick={() => setJadwal((now) => toggle(now, hari))}
              >
                {hari}
              </button>
            ))}
          </div>
          {pesanGalat('jadwal')}
        </div>

        {galatUmum && (
          <div className="notice bad" role="alert">
            <strong>Application not sent</strong>
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
            {mengirim ? 'Sending…' : 'Send application'}
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
        <p className="small muted">
          The organizer reviews every application. You will see the decision
          under <b>My account</b>.
        </p>
      </form>
    </Modal>
  );
}
