import { AksiPemilik } from '@/components/detail/aksi/AksiPemilik';
import { TombolDonasi } from '@/components/detail/aksi/TombolDonasi';
import { TombolRelawan } from '@/components/detail/aksi/TombolRelawan';
import { HeroDetail } from '@/components/detail/HeroDetail';
import { KerangkaDetail } from '@/components/detail/KerangkaDetail';
import { PanelSamping } from '@/components/detail/PanelSamping';
import type { DetailAksi, TabDetail } from '@/shared/detail';

export function DetailProjectView({
  detail,
  tabAwal,
}: {
  detail: DetailAksi;
  tabAwal?: TabDetail;
}) {
  return (
    <>
      <HeroDetail detail={detail} />
      <KerangkaDetail
        detail={detail}
        tabAwal={tabAwal}
        sisi={
          <PanelSamping
            detail={detail}
            pemilik={<AksiPemilik detail={detail} />}
            donasi={<TombolDonasi detail={detail} />}
            relawan={<TombolRelawan detail={detail} />}
          />
        }
      />
    </>
  );
}
