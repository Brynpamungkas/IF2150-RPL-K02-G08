import { IkonTangan } from '@/components/ui/Ikon';
import type { DetailAksi } from '@/shared/detail';

export function TombolRelawan({ detail }: { detail: DetailAksi }) {
  if (detail.terbukaRelawan) {
    return (
      <button type="button" className="btn btn-ghost btn-block">
        <IkonTangan /> Volunteer for this
      </button>
    );
  }

  const penuh = (detail.relawanDiterima ?? 0) >= (detail.kuotaRelawan ?? 0);
  return (
    <>
      <div className="notice warn">
        <strong>
          {penuh ? 'Volunteer spots are full' : 'Volunteer sign-up is closed'}
        </strong>
        <span>You can still help with a donation.</span>
      </div>
      <button type="button" className="btn btn-block" aria-disabled="true">
        Sign-up closed
      </button>
    </>
  );
}
