import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CalendarDays, ArrowRight } from 'lucide-react'
import { getConferenceTopic, type Conference } from '../data/content'
import { getConferences, getCachedConferences, hasLoadedConferences } from '../lib/supabase'
import Reveal from './Reveal'

export default function FeaturedConferences({
  onSelectConference
}: {
  onSelectConference?: (c: Conference) => void
}) {
  const [data, setData] = useState<Conference[]>(() => getCachedConferences())
  const [loading, setLoading] = useState<boolean>(() => !hasLoadedConferences())
  const [selectedTopic, setSelectedTopic] = useState<string>('All')

  useEffect(() => {
    function load() {
      const cached = getCachedConferences()
      if (cached.length > 0) {
        setData(cached)
        setLoading(false)
      }
      getConferences().then((res) => {
        setData(res)
        setLoading(false)
      })
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  const topics = useMemo(() => {
    const unique = Array.from(new Set(data.map((c) => getConferenceTopic(c)).filter(Boolean)))
    return ['All', ...unique]
  }, [data])

  const list = useMemo(() => {
    if (selectedTopic === 'All') return data
    return data.filter((c) => getConferenceTopic(c) === selectedTopic)
  }, [data, selectedTopic])

  function handleCardClick(c: Conference) {
    if (onSelectConference) {
      onSelectConference(c)
    } else {
      window.location.hash = '#/conference/' + c.id
    }
  }

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

        {!loading && topics.length > 1 && (
          <div
            role="tablist"
            aria-label="Filter by conference topic"
            className="mt-8 sm:mt-10 flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-2 sm:pb-0"
          >
            {topics.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={selectedTopic === t}
                onClick={() => setSelectedTopic(t)}
                className={`min-h-[42px] sm:min-h-[44px] flex-shrink-0 rounded-full border px-4 sm:px-5 text-xs sm:text-sm font-medium transition ${
                  selectedTopic === t
                    ? 'border-navy-900 bg-navy-900 text-white shadow-md'
                    : 'border-charcoal/20 bg-white hover:border-gold'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 animate-pulse"
              >
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((c) => {
                const topicLabel = getConferenceTopic(c)
                return (
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
                          {topicLabel}
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
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
