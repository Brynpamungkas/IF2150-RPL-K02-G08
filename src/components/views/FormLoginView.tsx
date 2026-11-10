'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Field } from '@/components/ui/Field';
import { useSesi } from '@/components/ui/SesiContext';
import { useToast } from '@/components/ui/Toast';
import type { PenggunaDto } from '@/shared/autentikasi';
import { kirimJson } from './DonasiView/panggilApi';

const PASSWORD_DEMO = 'klimpool123';
const AKUN_DEMO = [
  { label: 'Andi · donor & volunteer', email: 'andi@klimpool.id' },
  { label: 'Sari · project organizer', email: 'sari@klimpool.id' },
  { label: 'Admin', email: 'admin@klimpool.id' },
];

/** C15 FormLoginView */
export function FormLoginView({
  emailAwal,
  onSelesai,
}: {
  emailAwal: string;
  onSelesai: () => void;
}) {
  const { setPengguna } = useSesi();
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState(emailAwal);
  const [password, setPassword] = useState('');
  const [galat, setGalat] = useState<{ pesan: string; bidang?: string } | null>(
    null,
  );
  const [mengirim, setMengirim] = useState(false);

  async function masuk(emailMasuk: string, passwordMasuk: string) {
    setMengirim(true);
    setGalat(null);
    const res = await kirimJson<PenggunaDto>('/api/auth/masuk', {
      email: emailMasuk,
      password: passwordMasuk,
    });
    setMengirim(false);
    if (!res.ok) {
      setGalat({ pesan: res.pesan, bidang: res.bidang });
      return;
    }
    setPengguna(res.data);
    showToast(
      <>
        Welcome back, <b>{res.data.nama.split(' ')[0]}</b>.
      </>,
      'ok',
    );
    onSelesai();
    router.refresh();
  }

  function kirim(e: FormEvent) {
    e.preventDefault();
    void masuk(email, password);
  }

  const galatBidang = (k: string) =>
    galat?.bidang === k ? galat.pesan : undefined;

  return (
    <>
      {galat && !galat.bidang && (
        <div className="err-summary" role="alert">
          <strong>{galat.pesan}</strong>
        </div>
      )}
      <form className="form" style={{ gap: 16 }} onSubmit={kirim} noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@email.com"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          galat={galatBidang('email')}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          galat={galatBidang('password')}
        />
        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={mengirim}
        >
          {mengirim ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <div className="demo-acc">
        <b className="small">Demo accounts (password: {PASSWORD_DEMO})</b>
        <div className="btns">
          {AKUN_DEMO.map((a) => (
            <button
              key={a.email}
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={mengirim}
              onClick={() => void masuk(a.email, PASSWORD_DEMO)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
