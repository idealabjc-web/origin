import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CalendarDays } from 'lucide-react'
import { categories, conferences, type Category } from '../data/content'
import Reveal from './Reveal'
export default function FeaturedConferences() {
  const [cat, setCat] = useState<Category | 'All'>('All')
  const list = cat === 'All' ? conferences : conferences.filter((c) => c.category === cat)
  return (
    <section id="conferences" className="bg-slate-50 py-24 lg:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Explore Our Conferences</p>
          <h2 className="h2">Find the conversation that fits your field</h2>
          <p className="mt-4 text-sm text-charcoal/60">Sample conferences shown as demo content until real event details are available.</p>
        </Reveal>
        <div role="tablist" aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2">
          {(['All', ...categories] as const).map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`min-h-[44px] rounded-full border px-5 text-sm font-medium transition ${cat === c ? 'border-navy-900 bg-navy-900 text-white' : 'border-charcoal/20 hover:border-gold'}`}>{c}</button>
          ))}
        </div>
        <motion.div layout className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.article layout key={c.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img loading="lazy" src={c.image} alt={`${c.title} cover`} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy-950">{c.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                  <p className="mt-3 flex items-center gap-2 text-xs text-charcoal/60"><CalendarDays size={14} />{c.date}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-charcoal/60"><MapPin size={14} />{c.location}</p>
                  <p className="mt-3 text-sm text-charcoal/75">{c.description}</p>
                  <a href={c.href} className="mt-5 inline-block text-sm font-semibold text-navy-800 underline decoration-gold decoration-2 underline-offset-4">View Conference</a>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="mt-12 text-center"><a href="#events" className="btn btn-dark">View All Conferences</a></div>
      </div>
    </section>
  )
}
