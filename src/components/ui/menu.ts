import type { MenuItem } from '@/shared/types';

/**
 * Menu navbar, mengikuti prototipe:
 * tamu melihat kelima menu, pengguna yang sudah login hanya Home dan Explore.
 * "How it works" dan "Impact" adalah bagian di halaman beranda (id: how, impact).
 */
const semuaMenu: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'How it works', href: '/#how' },
  { label: 'Start an action', href: '/start' },
  { label: 'Impact', href: '/#impact' },
];

export function getMenu(sudahLogin: boolean): MenuItem[] {
  return sudahLogin ? semuaMenu.slice(0, 2) : semuaMenu;
}

/** Menu mana yang menyala di halaman saat ini (How it works dan Impact tidak pernah menyala). */
export function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/explore') return pathname.startsWith('/explore');
  if (href === '/start') return pathname.startsWith('/start');
  return false;
}
