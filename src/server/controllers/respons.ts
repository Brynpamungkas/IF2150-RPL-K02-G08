import { NextResponse } from 'next/server';
import { GalatAplikasi, STATUS_HTTP } from '@/shared/galat';
import type { ResponsApi } from '@/shared/dto';

export function sukses<T>(data: T, status = 200): NextResponse<ResponsApi<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

/** Galat terkontrol → pesan ke pengguna; selainnya → 500 generik (detail hanya di log server). */
export function gagal(error: unknown): NextResponse<ResponsApi<never>> {
  if (error instanceof GalatAplikasi) {
    return NextResponse.json(
      {
        ok: false,
        galat: { kode: error.kode, pesan: error.message, bidang: error.bidang },
      },
      { status: STATUS_HTTP[error.kode] },
    );
  }
  console.error(error);
  return NextResponse.json(
    {
      ok: false,
      galat: {
        kode: 'INTERNAL',
        pesan: 'Something went wrong. Please try again.',
      },
    },
    { status: 500 },
  );
}

/** Isi body JSON sebagai objek; selain itu dianggap kosong. */
export async function bacaJson(
  request: Request,
): Promise<Record<string, unknown>> {
  try {
    const nilai: unknown = await request.json();
    return typeof nilai === 'object' && nilai !== null
      ? (nilai as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export const teks = (v: unknown): string => (typeof v === 'string' ? v : '');
