import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems } from '../data/content'

export default function Header({
  activeRoute = '/',
  onNavigate
}: {
  activeRoute?: string
  onNavigate?: (path: string) => void
}) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  function handleNav(href: string, e?: React.MouseEvent) {
    if (e) e.preventDefault()
    setOpen(false)
    if (onNavigate) {
      onNavigate(href)
    } else {
      window.history.pushState(null, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-colors duration-300 ${
        solid || open
          ? 'bg-navy-950/95 shadow-xl backdrop-blur-md'
          : 'bg-navy-950/90 shadow-md backdrop-blur-md'
      }`}
    >
      <div className="container-x flex h-[72px] sm:h-[84px] md:h-[92px] items-center justify-between">
        <a
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="flex items-center gap-2 cursor-pointer group py-1"
        >
          <img
            id="header-origin-logo"
            src="/origin-logo.png"
            alt="ORIGIN Global Conferences"
            className="h-11 sm:h-14 md:h-18 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {navItems.map((n) => {
            const isActive = activeRoute === n.href
            return (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => handleNav(n.href, e)}
                className={`group relative text-sm font-semibold transition ${
                  isActive ? 'text-gold' : 'text-white/80 hover:text-white'
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            )
          })}
        </nav>

        <a
          href="/conferences"
          onClick={(e) => handleNav('/conferences', e)}
          className="btn btn-gold hidden lg:inline-flex text-xs font-bold py-2.5 px-5 shadow-lg"
        >
          Explore Conferences
        </a>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 active:bg-white/20 transition lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-h-[calc(100vh-72px)] sm:max-h-[calc(100vh-84px)] overflow-y-auto bg-navy-950/98 backdrop-blur-2xl border-b border-white/10 lg:hidden shadow-2xl"
          >
            <div className="container-x flex flex-col gap-1 pb-8 pt-3">
              {navItems.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => handleNav(n.href, e)}
                  className={`flex items-center justify-between border-b border-white/10 py-3.5 text-base font-semibold transition active:text-gold ${
                    activeRoute === n.href ? 'text-gold' : 'text-white'
                  }`}
                >
                  <span>{n.label}</span>
                  <span className="text-xs text-white/30">→</span>
                </a>
              ))}
              <a
                href="/conferences"
                onClick={(e) => handleNav('/conferences', e)}
                className="btn btn-gold mt-5 text-sm font-bold text-center py-3.5 shadow-lg shadow-gold/20"
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

