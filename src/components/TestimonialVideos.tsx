import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { testimonials as initialTestimonials, type Testimonial } from '../data/content'
import { getTestimonials } from '../lib/supabase'
import Modal from './Modal'
import Reveal from './Reveal'

export default function TestimonialVideos() {
  const [items, setItems] = useState<Testimonial[]>(initialTestimonials)
  const [active, setActive] = useState<Testimonial | null>(null)

  useEffect(() => {
    function load() {
      getTestimonials().then(setItems)
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])
  return (
    <section id="testimonials" className="bg-gradient-to-b from-navy-950 to-navy-800 py-24 text-white lg:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 className="h2">Voices That Inspire Confidence</h2>
          <p className="mt-4 text-white/70">Discover the experiences and perspectives of our conference community.</p>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {items.map((t, k) => (
            <Reveal key={t.id} delay={k * 0.1}>
              <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur transition hover:-translate-y-1">
                <button onClick={() => setActive(t)} aria-label={`Play testimonial video from ${t.name}`} className="relative block aspect-video w-full overflow-hidden">
                  <img loading="lazy" src={t.thumbnail} alt={`${t.name}, ${t.role}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-navy-950/40" />
                  <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-navy-950 shadow-lg transition group-hover:scale-110"><Play fill="currentColor" /></span>
                </button>
                <div className="p-6">
                  <p className="text-sm italic text-white/80">“{t.quote}”</p>
                  <p className="mt-4 font-semibold">{t.name}</p>
                  <p className="text-sm text-gold">{t.role}</p>
                  <p className="text-xs text-white/50">{t.event}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-white/40">Demo content. Replace with real testimonials in src/data/content.ts.</p>
      </div>
      {active && (
        <Modal title={`Testimonial from ${active.name}`} onClose={() => setActive(null)}>
          <video src={active.video} poster={active.thumbnail} controls autoPlay playsInline className="aspect-video w-full rounded-xl bg-black" />
        </Modal>
      )}
    </section>
  )
}
