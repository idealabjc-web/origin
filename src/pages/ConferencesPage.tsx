import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, MapPin, Search, ArrowRight } from 'lucide-react'
import { categories, conferences as initialConferences, type Category, type Conference } from '../data/content'
import { getConferences } from '../lib/supabase'

export default function ConferencesPage({
  onSelectConference
}: {
  onSelectConference: (id: string) => void
}) {
  const [data, setData] = useState<Conference[]>(initialConferences)
  const [cat, setCat] = useState<Category | 'All'>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    function load() {
      getConferences().then((res) => {
        if (res && res.length > 0) setData(res)
      })
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  const filtered = data
    .filter((c) => cat === 'All' || c.category === cat)
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal pt-[72px] sm:pt-[84px] md:pt-[92px]">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy-950 py-14 sm:py-20 text-white lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950/80 to-navy-950" />
        <div className="container-x relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block rounded-full bg-gold px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy-950">
              Official 2027 Calendar
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Premier Global Conferences
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
              Explore our internationally accredited congresses spanning Healthcare, Dental Sciences, and Executive Entrepreneurship.
            </p>
          </motion.div>

          {/* Search bar inside hero */}
          <div className="mt-8 sm:mt-10 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-white/50" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by conference name, medical specialty, or venue..."
                className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-sm text-white placeholder-white/50 backdrop-blur-md outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container-x">
          {/* Category Tabs */}
          <div role="tablist" aria-label="Filter by category" className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-4 sm:pb-8 border-b border-slate-200">
            {(['All', ...categories] as const).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`min-h-[42px] sm:min-h-[44px] flex-shrink-0 rounded-full border px-4 sm:px-5 text-xs sm:text-sm font-semibold transition ${
                  cat === c
                    ? 'border-navy-950 bg-navy-950 text-white shadow-md'
                    : 'border-slate-200 bg-white text-charcoal/80 hover:border-gold hover:text-navy-950'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-charcoal/60">
            <span>Showing {filtered.length} premier {filtered.length === 1 ? 'conference' : 'conferences'}</span>
            {search && (
              <button onClick={() => setSearch('')} className="text-gold-dark hover:underline font-semibold">
                Clear search
              </button>
            )}
          </div>

          {/* Conference Cards Grid */}
          <motion.div layout className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((c) => (
                <motion.article
                  layout
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectConference(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectConference(c.id)
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-200 hover:border-gold/60"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        loading="lazy"
                        src={c.image}
                        alt={`${c.title} cover`}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy-950 shadow-md">
                        {c.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-navy-950 group-hover:text-gold-dark transition leading-snug">
                        {c.title}
                      </h3>
                      {c.theme && (
                        <p className="mt-1.5 text-xs font-semibold text-gold-dark line-clamp-1 italic">
                          {c.theme}
                        </p>
                      )}
                      <div className="mt-4 space-y-2 text-xs text-charcoal/70 font-medium">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-gold-dark flex-shrink-0" />
                          <span>{c.date}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={15} className="text-gold-dark flex-shrink-0" />
                          <span>{c.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-gold-dark transition">
                      View Full Congress Page
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-gold" />
                    </span>
                    <span className="rounded-full bg-navy-950 px-3 py-1 text-[11px] font-semibold text-white group-hover:bg-gold group-hover:text-navy-950 transition">
                      Explore
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="my-16 rounded-3xl bg-white p-12 text-center border border-slate-200">
              <p className="font-display text-lg font-bold text-navy-950">No conferences match your filter.</p>
              <p className="mt-2 text-xs text-charcoal/60">Try clearing your search query or selecting "All Categories".</p>
              <button
                onClick={() => { setCat('All'); setSearch('') }}
                className="btn btn-dark mt-6 text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
