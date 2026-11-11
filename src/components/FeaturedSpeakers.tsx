import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Sparkles, Building2, Mic, X } from 'lucide-react'
import { speakers as initialSpeakers, type Speaker } from '../data/content'
import { getSpeakers } from '../lib/supabase'
import Reveal from './Reveal'

export default function FeaturedSpeakers() {
  const [items, setItems] = useState<Speaker[]>(initialSpeakers)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)

  useEffect(() => {
    function load() {
      getSpeakers().then(setItems)
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  if (items.length === 0) return null

  return (
    <section id="speakers-grid" className="bg-navy-950 py-24 text-white lg:py-32 border-t border-white/5">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-1.5 text-gold">
            <Sparkles size={14} />
            Distinguished Faculty & Keynotes
          </p>
          <h2 className="h2">World-Class Speakers</h2>
          <p className="mt-4 text-white/70">
            Learn from global thought leaders, pioneering researchers, and enterprise visionaries driving real-world impact.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((sp) => (
            <article
              key={sp.id}
              onClick={() => setSelectedSpeaker(sp)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-900 mb-3">
                  <img
                    loading="lazy"
                    src={sp.image}
                    alt={sp.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60" />
                  {sp.linkedin && sp.linkedin !== '#' && (
                    <a
                      href={sp.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${sp.name} LinkedIn`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-gold text-navy-950 shadow-md transition hover:scale-110"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-gold transition line-clamp-1">
                  {sp.name}
                </h3>
                {(sp.profession || (sp.role && sp.role !== 'Keynote Speaker')) && (
                  <p className="text-xs font-semibold text-gold/90 mt-0.5">{sp.profession || sp.role}</p>
                )}
                {sp.bio ? (
                  <p className="mt-1.5 text-xs text-white/70 line-clamp-2 leading-relaxed">{sp.bio}</p>
                ) : sp.organization ? (
                  <p className="text-xs text-white/60 mt-1 line-clamp-1">{sp.organization}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Speaker Full Information Popup Modal */}
      <AnimatePresence>
        {selectedSpeaker && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto text-charcoal"
            onClick={() => setSelectedSpeaker(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Top Banner */}
              <div className="relative bg-navy-950 px-6 sm:px-8 pt-8 pb-6 text-white overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950 to-navy-950" />

                <button
                  onClick={() => setSelectedSpeaker(null)}
                  className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-gold/40 shadow-xl bg-navy-900">
                    <img
                      src={selectedSpeaker.image}
                      alt={selectedSpeaker.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-0.5 text-[11px] font-bold text-gold uppercase tracking-wider">
                      <Mic size={12} /> Keynote Speaker
                    </span>
                    <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      {selectedSpeaker.name}
                    </h3>

                    {(selectedSpeaker.profession || selectedSpeaker.role) && (
                      <p className="mt-1.5 text-sm font-semibold text-gold leading-relaxed">
                        {selectedSpeaker.profession || selectedSpeaker.role}
                      </p>
                    )}

                    {selectedSpeaker.organization && (
                      <p className="mt-1.5 text-xs text-white/70 flex items-center justify-center sm:justify-start gap-1.5">
                        <Building2 size={13} className="text-gold" />
                        <span>{selectedSpeaker.organization}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
                {selectedSpeaker.topic && (
                  <div className="rounded-2xl bg-amber-50/90 border border-amber-200/80 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-600" />
                      Keynote Presentation Topic
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy-950 leading-snug">
                      {selectedSpeaker.topic}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-display text-base font-bold text-navy-950">
                    Biography &amp; Professional Background
                  </h4>
                  <div className="mt-2.5 text-sm leading-relaxed text-charcoal/80 space-y-2 whitespace-pre-line">
                    {selectedSpeaker.bio ? (
                      <p>{selectedSpeaker.bio}</p>
                    ) : selectedSpeaker.profession ? (
                      <p>{selectedSpeaker.profession}</p>
                    ) : (
                      <p className="italic text-charcoal/50">Full biography will be published alongside official session proceedings.</p>
                    )}
                  </div>
                </div>

                {selectedSpeaker.linkedin && selectedSpeaker.linkedin !== '#' && (
                  <div className="pt-3 border-t border-slate-100">
                    <a
                      href={selectedSpeaker.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/20 px-4 py-2 text-xs font-bold text-[#0077b5] transition"
                    >
                      <Linkedin size={15} />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedSpeaker(null)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-charcoal hover:bg-slate-100 transition shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
