import Link from 'next/link';

const LANGKAH = [
  {
    judul: 'Find an action',
    isi: 'Browse climate campaigns and field projects across Indonesia, on the map or as a list.',
  },
  {
    judul: 'Give or join in',
    isi: 'Donate from your balance, or sign up as a volunteer for a project near you.',
  },
  {
    judul: 'See the proof',
    isi: 'Every action is checked by our review team before it goes live, and each donation comes with a receipt.',
  },
];

// DATA STATIS: angka contoh. Ganti dengan query ke database (campaign dan transaksi_donasi) kalau sempat.
const DAMPAK = [
  { nilai: '24', label: 'Active actions' },
  { nilai: '1,280', label: 'Donors' },
  { nilai: 'Rp184 M', label: 'Funds raised' },
  { nilai: '640', label: 'Volunteers' },
];

function Panah() {
  return (
    <svg
      className="arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section id="hero" className="home-hero">
        <div className="wrap">
          <span className="chip soft">Climate action for Indonesia</span>
          <h1 className="home-judul">
            Fund the work that protects our climate.
          </h1>
          <p className="lead">
            KlimPooL connects donors and volunteers with verified climate
            actions, from mangrove planting to community solar. Every action is
            checked by our review team before it goes live.
          </p>
          <div className="home-aksi">
            <Link href="/explore" className="btn btn-primary">
              Explore actions <Panah />
            </Link>
            <Link href="/#how" className="btn btn-light">
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section id="how" className="band">
        <div className="wrap">
          <div className="home-kepala">
            <h2>How it works</h2>
            <p className="lead">Three steps from curiosity to impact.</p>
          </div>
          <ol className="home-langkah">
            {LANGKAH.map((l, i) => (
              <li key={l.judul} className="home-kartu">
                <span className="home-nomor" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{l.judul}</h3>
                <p className="muted">{l.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="impact" className="band dark">
        <div className="wrap">
          <div className="home-kepala">
            <h2>Our impact</h2>
            <p className="home-terang">
              What the KlimPooL community has done together.
            </p>
          </div>
          <dl className="home-statistik">
            {DAMPAK.map((d) => (
              <div key={d.label}>
                <dd className="home-nilai num">{d.nilai}</dd>
                <dt className="home-label">{d.label}</dt>
              </div>
            ))}
          </dl>
          <p className="home-catatan">Sample data, not yet live figures.</p>
        </div>
      </section>

      <section className="band cream">
        <div className="wrap home-cta">
          <h2>Ready to make a difference?</h2>
          <p className="lead">
            Pick an action that matters to you and take part today.
          </p>
          <Link href="/explore" className="btn btn-primary">
            Start exploring <Panah />
          </Link>
        </div>
      </section>
    </>
  );
}
