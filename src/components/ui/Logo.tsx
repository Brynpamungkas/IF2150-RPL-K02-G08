import Image from 'next/image';
import Link from 'next/link';

/** Logo KlimPooL: lencana + wordmark. Gambar: public/klimpool-badge.png (dari prototipe). */
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
