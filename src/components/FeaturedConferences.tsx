import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CalendarDays, ArrowRight } from 'lucide-react'
import { categories, conferences as initialConferences, type Category, type Conference } from '../data/content'
import { getConferences } from '../lib/supabase'
import Reveal from './Reveal'

export default function FeaturedConferences({
  onSelectConference
}: {
  onSelectConference?: (c: Conference) => void
}) {
  const [data, setData] = useState<Conference[]>(initialConferences)
  const [cat, setCat] = useState<Category | 'All'>('All')

  useEffect(() => {
    function load() {
      getConferences().then(setData)
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  function handleCardClick(c: Conference) {
    if (onSelectConference) {
      onSelectConference(c)
    } else {
      window.location.hash = '#/conference/' + c.id
    }
  }

  const list = cat === 'All' ? data : data.filter((c) => c.category === cat)

  return (
    <section id="conferences" className="bg-slate-50 py-24 lg:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Explore Our Conferences</p>
          <h2 className="h2">Find the conversation that fits your field</h2>
          <p className="mt-4 text-sm text-charcoal/60">
            Browse upcoming premier conferences across healthcare, business leadership, and scientific research.
          </p>
        </Reveal>

        <div role="tablist" aria-label="Filter by category" className="mt-8 sm:mt-10 flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-2 sm:pb-0">
          {(['All', ...categories] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`min-h-[42px] sm:min-h-[44px] flex-shrink-0 rounded-full border px-4 sm:px-5 text-xs sm:text-sm font-medium transition ${
                cat === c
                  ? 'border-navy-900 bg-navy-900 text-white shadow-md'
                  : 'border-charcoal/20 hover:border-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.article
                layout
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(c)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(c)
                  }
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:ring-2 hover:ring-gold/40"
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
                    <span className="absolute bottom-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy-950">
                      {c.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-navy-950 group-hover:text-gold-dark transition leading-snug">
                      {c.title}
                    </h3>
                    <p className="mt-4 flex items-center gap-2 text-xs text-charcoal/70 font-medium">
                      <CalendarDays size={15} className="text-gold-dark flex-shrink-0" />
                      <span>{c.date}</span>
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 text-xs text-charcoal/70 font-medium">
                      <MapPin size={15} className="text-gold-dark flex-shrink-0" />
                      <span>{c.location}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-2 flex items-center justify-between border-t border-slate-100/80 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-gold-dark transition">
                    Explore Details &amp; Tracks
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-gold" />
                  </span>
                  <span className="rounded-full bg-navy-950 px-3 py-1 text-[11px] font-semibold text-white group-hover:bg-gold group-hover:text-navy-950 transition">
                    Open Page
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
