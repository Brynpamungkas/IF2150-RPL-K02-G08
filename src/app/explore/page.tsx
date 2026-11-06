import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExploreView } from '@/components/views/ExploreView';
import { bacaFilterUrl } from '@/shared/explore';

export const metadata: Metadata = {
  title: 'Explore climate actions | KlimPooL',
  description:
    'Search and filter climate actions that have passed review. Pick one on the map or filter by category, province, status, and period.',
};

type Params = Record<string, string | string[] | undefined>;

/** membaca filter dari URL. dipisah supaya akses searchParams berada di dalam Suspense. */
async function ExploreDenganFilterUrl({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  return <ExploreView awal={bacaFilterUrl(await searchParams)} />;
}

/** kerangka statis yang tampil sementara URL dibaca: judul halaman saja. */
function KerangkaExplore() {
  return (
    <section className="page-top">
      <div className="wrap">
        <h1>Explore climate actions</h1>
        <p className="lead">
          Only actions that <b>have passed review</b> appear here. Pick one on
          the map or filter by what you care about.
        </p>
      </div>
    </section>
  );
}

/**
 * UC05: halaman Explore. filter awal dibaca dari URL supaya tautan seperti
 * /explore?type=campaign atau /explore?status=volunteer (di Footer) langsung berfungsi.
 */
export default function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  return (
    <Suspense fallback={<KerangkaExplore />}>
      <ExploreDenganFilterUrl searchParams={searchParams} />
    </Suspense>
  );
}
