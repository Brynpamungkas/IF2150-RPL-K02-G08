import Link from 'next/link';
import { sesiAksi } from '@/server/auth/aksesAksi';
import { AksiService } from '@/server/services/AksiService';
import { GalatValidasi } from '@/shared/galat';
import { MyActions } from './MyActions';

/** Server-only isi slot Account. Sesi/daftar tidak disimpan dalam cache bersama. */
export async function TabMyActions() {
  try {
    const pengguna = await sesiAksi();
    if (pengguna.peran === 'admin') {
      return (
        <section aria-label="My Actions" className="grid gap-4">
          <h2>My Actions</h2>
          <p className="notice info">
            Administrators review actions through the verification queue.
          </p>
          <Link href="/admin" className="btn btn-light">
            Review submissions
          </Link>
        </section>
      );
    }
    if (pengguna.peran !== 'pembuat_project') {
      return (
        <section aria-label="My Actions" className="grid gap-4">
          <h2>My Actions</h2>
          <p className="notice info">
            Creating and managing actions is available to project creators. You
            can still donate or volunteer.
          </p>
        </section>
      );
    }
    return <MyActions aksi={await AksiService.milikSaya(pengguna)} />;
  } catch (error) {
    if (error instanceof GalatValidasi && error.status === 401) {
      return (
        <section aria-label="My Actions" className="grid gap-4">
          <h2>My Actions</h2>
          <p className="notice warn" role="status">
            Log in to see your actions. Use the Log in button in the navigation
            above.
          </p>
        </section>
      );
    }
    // Termasuk interupsi prerender Next dan kegagalan DB: jangan disamarkan jadi daftar kosong.
    throw error;
  }
}
