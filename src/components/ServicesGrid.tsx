import { services } from '../data/content'
import Reveal from './Reveal'
export default function ServicesGrid() {
  return (
    <section id="why-us" className="py-24 lg:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl"><p className="eyebrow">Why Choose ORIGIN Conferences?</p><h2 className="h2">Every part of a conference, handled with care</h2></Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: I, title, text }, k) => {
            const dark = (k + Math.floor(k / 3)) % 2 === 0
            return (
              <Reveal key={title} delay={(k % 3) * 0.08} className={`p-8 ${dark ? 'bg-navy-900 text-white' : 'bg-white'}`}>
                <span className={`grid h-12 w-12 place-items-center rounded-full ${dark ? 'bg-gold text-navy-950' : 'bg-navy-900 text-gold'}`}><I size={22} /></span>
                <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
                <p className={`mt-3 text-sm ${dark ? 'text-white/70' : 'text-charcoal/70'}`}>{text}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
