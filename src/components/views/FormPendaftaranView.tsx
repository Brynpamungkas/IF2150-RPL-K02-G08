'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Field } from '@/components/ui/Field';
import { useSesi } from '@/components/ui/SesiContext';
import { useToast } from '@/components/ui/Toast';
import type { PenggunaDto } from '@/shared/dto';
import { panggilApi } from './panggilApi';

interface Galat {
  pesan: string;
  bidang?: string;
  kode: string;
}

/** C14 FormPendaftaranView. Setelah berhasil, pengguna langsung login. */
export function FormPendaftaranView({
  onSelesai,
  onMasukDenganEmail,
}: {
  onSelesai: () => void;
  onMasukDenganEmail: (email: string) => void;
}) {
  const { setPengguna } = useSesi();
  const { showToast } = useToast();
  const router = useRouter();
  const [nilai, setNilai] = useState({ nama: '', email: '', password: '' });
  const [galat, setGalat] = useState<Galat | null>(null);
  const [mengirim, setMengirim] = useState(false);

  const ubah = (k: keyof typeof nilai) => (e: { target: { value: string } }) =>
    setNilai((n) => ({ ...n, [k]: e.target.value }));
  const galatBidang = (k: string) =>
    galat?.bidang === k ? galat.pesan : undefined;

  async function kirim(e: FormEvent) {
    e.preventDefault();
    setMengirim(true);
    setGalat(null);

    const daftar = await panggilApi<PenggunaDto>(
      '/api/auth/daftar',
      'POST',
      nilai,
    );
    if (!daftar.ok) {
      setMengirim(false);
      setGalat(daftar.galat);
      return;
    }

    const masuk = await panggilApi<PenggunaDto>('/api/auth/masuk', 'POST', {
      email: nilai.email,
      password: nilai.password,
    });
    setMengirim(false);
    if (!masuk.ok) {
      showToast('Account created. Please log in.', 'ok');
      onMasukDenganEmail(nilai.email.trim().toLowerCase());
      return;
    }
    setPengguna(masuk.data);
    showToast(
      <>
        Account created. Welcome to KlimPooL,{' '}
        <b>{masuk.data.nama.split(' ')[0]}</b>.
      </>,
      'ok',
    );
    onSelesai();
    router.refresh();
  }

  const emailTerpakai = galat?.kode === 'EMAIL_TERPAKAI';

  return (
    <>
      {galat && (!galat.bidang || emailTerpakai) && (
        <div className="err-summary" role="alert">
          <strong>
            {emailTerpakai
              ? `${nilai.email.trim().toLowerCase()} is already used by another account. Use a different email, or log in with this one.`
              : galat.pesan}
          </strong>
          {emailTerpakai && (
            <button
              type="button"
              className="link-arrow"
              onClick={() =>
                onMasukDenganEmail(nilai.email.trim().toLowerCase())
              }
            >
              Log in with this email
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
      <form className="form" style={{ gap: 16 }} onSubmit={kirim} noValidate>
        <Field
          label="Full name"
          name="nama"
          autoComplete="name"
          placeholder="Your full name"
          autoFocus
          value={nilai.nama}
          onChange={ubah('nama')}
          galat={galatBidang('nama')}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@email.com"
          value={nilai.email}
          onChange={ubah('email')}
          galat={galatBidang('email')}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={nilai.password}
          onChange={ubah('password')}
          galat={galatBidang('password')}
        />
        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={mengirim}
        >
          {mengirim ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </>
  );
}
