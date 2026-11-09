import Image from 'next/image';
import Link from 'next/link';
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="KlimPooL home">
      <Image src="/klimpool-badge.png" alt="" width={36} height={36} />
      <span>
        Klim<i>PooL</i>
      </span>
    </Link>
  );
}
