'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { NavUser } from '@/shared/types';
import { Logo } from './Logo';
import { getMenu, isActive } from './menu';

interface NavbarProps {
  /** null = belum login (tamu) */
  user: NavUser | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onTopupClick: () => void;
  onLogoutClick: () => void;
}

const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('en-US');

const inisial = (nama: string) =>
  nama
    .split(' ')
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join('');

export function Navbar({
  user,
  onLoginClick,
  onSignupClick,
  onTopupClick,
  onLogoutClick,
}: NavbarProps) {
  const pathname = usePathname();
  const [akunTerbuka, setAkunTerbuka] = useState(false);
  const [panelTerbuka, setPanelTerbuka] = useState(false);
  const akunRef = useRef<HTMLDivElement>(null);
  const menu = getMenu(user !== null);
  const isAdmin = user?.peran === 'admin';

  // Tutup menu akun saat klik di luar atau tekan Esc
  useEffect(() => {
    if (!akunTerbuka) return;
    const onDown = (e: MouseEvent) => {
      if (!akunRef.current?.contains(e.target as Node)) setAkunTerbuka(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAkunTerbuka(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [akunTerbuka]);

  return (
    <div className="nav-shell">
      <div className="wrap">
        <nav className="nav" aria-label="Main navigation">
          <Logo />

          <div className="nav-links">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={isActive(m.href, pathname) ? 'on' : ''}
                aria-current={isActive(m.href, pathname) ? 'page' : undefined}
              >
                {m.label}
              </Link>
            ))}
          </div>

          <div className="nav-right" ref={akunRef}>
            {user && !isAdmin && (
              <button
                type="button"
                className="saldo-chip"
                onClick={onTopupClick}
                title="Top up balance"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="6" width="18" height="13" rx="3" />
                  <path d="M16 12.5h2M3 9h18" />
                </svg>
                <span>Balance</span> {rupiah(user.saldo)}
              </button>
            )}

            {user ? (
              <button
                type="button"
                className="avatar"
                onClick={() => setAkunTerbuka((v) => !v)}
                aria-expanded={akunTerbuka}
                aria-label={`Account menu for ${user.nama}`}
              >
                {inisial(user.nama)}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={onLoginClick}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm btn-galang"
                  onClick={onSignupClick}
                >
                  Sign up
                </button>
              </>
            )}

            <button
              type="button"
              className="menu-btn"
              onClick={() => setPanelTerbuka((v) => !v)}
              aria-expanded={panelTerbuka}
              aria-label="Open menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            {akunTerbuka && user && (
              <div className="user-menu">
                <div className="who">
                  <strong>{user.nama}</strong>
                  <span className="small muted">{user.email}</span>
                </div>
                {isAdmin ? (
                  <Link href="/admin" onClick={() => setAkunTerbuka(false)}>
                    Review submissions
                  </Link>
                ) : (
                  <>
                    <Link href="/account" onClick={() => setAkunTerbuka(false)}>
                      My activity
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAkunTerbuka(false);
                        onTopupClick();
                      }}
                    >
                      Top up balance
                    </button>
                  </>
                )}
                <button
                  type="button"
                  style={{ color: 'var(--bad)' }}
                  onClick={() => {
                    setAkunTerbuka(false);
                    onLogoutClick();
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className={`mobile-panel${panelTerbuka ? ' open' : ''}`}>
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={isActive(m.href, pathname) ? 'on' : ''}
              onClick={() => setPanelTerbuka(false)}
            >
              {m.label}
            </Link>
          ))}
          {!user && (
            <button
              type="button"
              onClick={() => {
                setPanelTerbuka(false);
                onSignupClick();
              }}
            >
              Sign up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
