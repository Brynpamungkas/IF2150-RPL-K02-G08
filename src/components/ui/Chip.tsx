import type { ItemKatalog } from '@/shared/katalog';
import { labelStatus, labelTipe } from '@/shared/explore';

/** chip tipe: action project (sage) atau fundraising campaign. */
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

/** chip status: completed, donations closed, volunteer spots full, atau status pelaksanaan. */
export function ChipStatus({ item }: { item: ItemKatalog }) {
  const { kelas, teks } = labelStatus(item);
  return <span className={`chip ${kelas}`.trim()}>{teks}</span>;
}
