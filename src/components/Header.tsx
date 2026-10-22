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
      <div className="container-x flex h-[72px] items-center justify-between">
        <a
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="font-display text-2xl font-bold tracking-tight text-white cursor-pointer"
        >
          ORIGIN<span className="text-gold"> Conferences</span>
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
            <div className="container-x flex flex-col gap-1 pb-6 pt-2">
              {navItems.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => handleNav(n.href, e)}
                  className={`border-b border-white/10 py-3 text-sm font-semibold transition ${
                    activeRoute === n.href ? 'text-gold' : 'text-white'
                  }`}
                >
                  {n.label}
                </a>
              ))}
              <a
                href="/conferences"
                onClick={(e) => handleNav('/conferences', e)}
                className="btn btn-gold mt-4 text-xs font-bold text-center"
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

