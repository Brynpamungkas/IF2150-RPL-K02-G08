import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <Logo />
            <p style={{ maxWidth: '34ch' }}>
              A climate action and donation platform for Indonesia. Every action
              is checked by our review team before it goes live.
            </p>
          </div>
          <div>
            <h4>Get involved</h4>
            <ul>
              <li>
                <Link href="/explore">Explore actions</Link>
              </li>
              <li>
                <Link href="/explore?type=campaign">Donate to a campaign</Link>
              </li>
              <li>
                <Link href="/explore?status=volunteer">
                  Find volunteer work
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>For organizers</h4>
            <ul>
              <li>
                <Link href="/start?type=project">Submit an action project</Link>
              </li>
              <li>
                <Link href="/start?type=campaign">
                  Start a fundraising campaign
                </Link>
              </li>
              <li>
                <Link href="/#how">Review process</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 KlimPooL · IF2150 RPL K02 Group 08</span>
        </div>
      </div>
    </footer>
  );
}
