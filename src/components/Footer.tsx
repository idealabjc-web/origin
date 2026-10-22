import { categories, navItems, site } from '../data/content'
export default function Footer() {
  return (
    <footer className="bg-navy-950 pt-16 text-sm text-white/70">
      <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-white">ORIGIN<span className="text-gold"> Conferences</span></p>
          <p className="mt-4">A conference and event services provider connecting professionals through knowledge sharing and networking.</p>
        </div>
        <div><h3 className="font-semibold text-white">Quick Links</h3><ul className="mt-4 space-y-2">{navItems.map((n) => <li key={n.href}><a className="hover:text-gold" href={n.href}>{n.label}</a></li>)}<li><a className="hover:text-gold" href="#newsletter">Newsletter</a></li></ul></div>
        <div><h3 className="font-semibold text-white">Conference Categories</h3><ul className="mt-4 space-y-2">{categories.map((c) => <li key={c}><a className="hover:text-gold" href="#conferences">{c}</a></li>)}</ul></div>
        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-2"><li>{site.contact.address}</li><li>{site.contact.phone}</li><li>{site.contact.email}</li></ul>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">{site.social.map((s) => <a key={s.label} href={s.href} className="hover:text-gold" rel="noreferrer">{s.label}</a>)}</div>
        </div>
      </div>
      <div className="container-x mt-12 flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs sm:flex-row">
        <p>© {new Date().getFullYear()} ORIGIN Conferences. All rights reserved.</p>
        <p className="flex gap-5"><a href={site.legal.privacy} className="hover:text-gold">Privacy Policy</a><a href={site.legal.terms} className="hover:text-gold">Terms &amp; Conditions</a></p>
      </div>
    </footer>
  )
}
