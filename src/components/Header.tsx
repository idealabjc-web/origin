import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems, site } from '../data/content'
export default function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-colors duration-300 ${
        solid || open
          ? 'bg-navy-950/95 shadow-xl backdrop-blur-md'
          : 'bg-navy-950/90 shadow-md backdrop-blur-md'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <a href="#home" className="font-display text-2xl font-bold tracking-tight text-white">
          ORIGIN<span className="text-gold"> Conferences</span>
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative text-sm font-medium text-white/90 hover:text-white"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a href={site.ctaLinks.conferences} className="btn btn-gold hidden lg:inline-flex">
          Explore Conferences
        </a>
        <button
          className="p-2 text-white lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-navy-950 border-b border-white/10 lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 pb-6">
              {navItems.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-3 text-white"
                >
                  {n.label}
                </a>
              ))}
              <a
                href={site.ctaLinks.conferences}
                onClick={() => setOpen(false)}
                className="btn btn-gold mt-4"
              >
                Explore Conferences
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
