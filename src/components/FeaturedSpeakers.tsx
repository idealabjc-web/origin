import { useState, useEffect } from 'react'
import { Linkedin, Sparkles } from 'lucide-react'
import { speakers as initialSpeakers, type Speaker } from '../data/content'
import { getSpeakers } from '../lib/supabase'
import Reveal from './Reveal'

export default function FeaturedSpeakers() {
  const [items, setItems] = useState<Speaker[]>(initialSpeakers)

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

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((sp) => (
            <article
              key={sp.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/5 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-900 mb-5">
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
                      className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-gold text-navy-950 shadow-md transition hover:scale-110"
                    >
                      <Linkedin size={15} />
                    </a>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-white group-hover:text-gold transition">
                  {sp.name}
                </h3>
                <p className="text-sm font-semibold text-gold/90 mt-0.5">{sp.role}</p>
                {sp.organization && (
                  <p className="text-xs text-white/60 mt-0.5">{sp.organization}</p>
                )}

                {sp.topic && (
                  <div className="mt-4 rounded-xl bg-white/5 p-3 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold/80">Keynote Topic</p>
                    <p className="text-xs text-white/80 mt-1 line-clamp-2">{sp.topic}</p>
                  </div>
                )}

                {sp.bio && (
                  <p className="mt-3 text-xs text-white/60 line-clamp-2">{sp.bio}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
