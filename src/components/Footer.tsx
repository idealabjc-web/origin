import { navItems, site } from '../data/content'

export default function Footer({ onNavigate }: { onNavigate?: (path: string) => void }) {
  function handleLinkClick(href: string, e: React.MouseEvent) {
    if (href.startsWith('/')) {
      e.preventDefault()
      if (onNavigate) {
        onNavigate(href)
      } else {
        window.history.pushState(null, '', href)
        window.dispatchEvent(new PopStateEvent('popstate'))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-navy-950 pt-16 text-sm text-white/70">
      <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            className="inline-block group mb-4"
          >
            <img
              src="/origin-logo.png"
              alt="ORIGIN Global Conferences"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md"
            />
          </a>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            A conference and event services provider connecting professionals through knowledge sharing and networking.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {navItems.map((n) => (
              <li key={n.href}>
                <a
                  className="hover:text-gold transition"
                  href={n.href}
                  onClick={(e) => handleLinkClick(n.href, e)}
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a
                className="hover:text-gold transition"
                href="/policies"
                onClick={(e) => handleLinkClick('/policies', e)}
              >
                Policies &amp; Terms
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-2">
            <li>{site.contact.address}</li>
            <li>{site.contact.phone}</li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-gold transition"
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {site.social.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-gold" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-x mt-12 flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} ORIGIN Conferences. All rights reserved.</p>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={site.legal.terms}
            onClick={(e) => handleLinkClick(site.legal.terms, e)}
            className="hover:text-gold transition"
          >
            Terms &amp; Conditions
          </a>
          <a
            href={site.legal.privacy}
            onClick={(e) => handleLinkClick(site.legal.privacy, e)}
            className="hover:text-gold transition"
          >
            Privacy Policy
          </a>
          <a
            href={site.legal.refund}
            onClick={(e) => handleLinkClick(site.legal.refund, e)}
            className="hover:text-gold transition"
          >
            Refund &amp; Cancellation Policy
          </a>
        </p>
      </div>
    </footer>
  )
}
