import { ClipboardCheck, Globe2, Users } from 'lucide-react'
import Reveal from './Reveal'
const highlights = [
  { icon: ClipboardCheck, t: 'Conference Planning & Management' },
  { icon: Globe2, t: 'Global Speaker Engagement' },
  { icon: Users, t: 'Professional Networking Experiences' }
]
export default function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <img loading="lazy" src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1000&q=70" alt="Speaker presenting to a conference audience" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl" />
<img loading="lazy" src="https://images.unsplash.com/photo-1515161665709-19b0f4c1d2c5?auto=format&fit=crop&w=1000&q=70" alt="Conference hall with audience" className="mt-4 w-full rounded-2xl object-cover shadow-2xl" />
          <img loading="lazy" src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=70" alt="Delegates networking" className="absolute -bottom-8 -right-2 hidden w-1/2 rounded-2xl border-8 border-white object-cover shadow-xl sm:block md:-right-8" />
          <div className="absolute left-4 top-4 rounded-xl bg-navy-900/90 px-5 py-4 text-white backdrop-blur sm:-left-6 sm:top-10">
            <p className="font-display text-3xl text-gold">00+</p><p className="text-xs text-white/70">Placeholder statistic</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">About ORIGIN Conferences</p>
          <h2 className="h2">Creating Experiences That Move Ideas Forward</h2>
          <p className="mt-6 text-lg leading-relaxed text-charcoal/75">ORIGIN Conferences is a conference and event services provider that brings professionals together for knowledge sharing, networking, collaboration and industry advancement. [Edit this copy with your confirmed company profile.]</p>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: I, t }) => <li key={t} className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 text-gold"><I size={20} /></span><span className="font-medium">{t}</span></li>)}
          </ul>
          <a href="#why-us" className="btn btn-dark mt-10">Discover Our Story</a>
        </Reveal>
      </div>
    </section>
  )
}
