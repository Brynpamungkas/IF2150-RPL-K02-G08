import Link from 'next/link';
import { FormAksi } from '@/components/aksi/FormAksi';
import { sesiAksi, wajibPeranAksi } from '@/server/auth/aksesAksi';
import { halamanAksi } from '@/server/halamanAksi';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  return halamanAksi(async () => {
    wajibPeranAksi(await sesiAksi(), 'pembuat_project');
    const jenis =
      (await searchParams).type === 'project' ? 'project' : 'campaign';
    return (
      <div className="wrap py-12">
        <div className="mx-auto grid max-w-3xl gap-7">
          <header>
            <h1>Mulai aksi iklim</h1>
            <p>Siapkan Draft, lalu ajukan untuk ditinjau admin.</p>
          </header>
          <nav aria-label="Jenis aksi" className="flex flex-wrap gap-3">
            <Link
              className={`btn ${jenis === 'campaign' ? 'btn-primary' : 'btn-light'}`}
              href="/start?type=campaign"
              aria-current={jenis === 'campaign' ? 'page' : undefined}
            >
              Campaign
            </Link>
            <Link
              className={`btn ${jenis === 'project' ? 'btn-primary' : 'btn-light'}`}
              href="/start?type=project"
              aria-current={jenis === 'project' ? 'page' : undefined}
            >
              Project
            </Link>
            <Link href="/my-actions" className="btn btn-ghost">
              My Actions
            </Link>
          </nav>
          <FormAksi key={jenis} jenis={jenis} />
        </div>
      </div>
    );
  });
}
