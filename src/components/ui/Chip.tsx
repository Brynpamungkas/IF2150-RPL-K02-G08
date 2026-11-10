import type { ItemKatalog } from '@/shared/katalog';
import { labelStatus, labelTipe, type ItemStatus } from '@/shared/explore';

/** chip tipe: Action project (sage) atau Fundraising campaign (krem keemasan). */
export function ChipTipe({ tipe }: { tipe: ItemKatalog['tipe'] }) {
  return tipe === 'project' ? (
    <span className="chip soft">{labelTipe(tipe)}</span>
  ) : (
    <span
      className="chip soft"
      style={{ background: '#F3E7CF', color: '#6B4A12' }}
    >
      {labelTipe(tipe)}
    </span>
  );
}

/** chip status: Completed, Donations closed, Volunteer spots full, atau status pelaksanaan. */
export function ChipStatus({ item }: { item: ItemStatus }) {
  const { kelas, teks } = labelStatus(item);
  return <span className={`chip ${kelas}`.trim()}>{teks}</span>;
}
