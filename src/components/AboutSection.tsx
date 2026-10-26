import { ShieldCheck, Award, Globe2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import Reveal from './Reveal'

const features = [
  {
    icon: Award,
    title: 'Accredited Academic & Clinical Rigor',
    desc: 'CPD and CME accredited tracks, peer-reviewed sessions, and high-impact clinical and industry workshops.'
  },
  {
    icon: Globe2,
    title: 'Global Delegate & Speaker Network',
    desc: 'Convening visionary thought leaders, scholars, and industry decision-makers from over 40 countries.'
  },
  {
    icon: ShieldCheck,
    title: 'Turnkey Summit Production',
    desc: 'Full-spectrum event management from world capital venue curation to hybrid streaming and delegate concierge.'
  }
]

export default function AboutSection() {
  return (
    <section id="about" className="relative scroll-mt-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 lg:py-28 overflow-hidden">
      {/* Target for #why-us anchor links */}
      <span id="why-us" className="absolute -top-24" />

      {/* Subtle decorative background glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-navy-900/5 blur-3xl" />

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Premium Multi-Layer Visual Showcase */}
          <Reveal className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Main Image: Lit auditorium / keynote */}
              <div className="relative overflow-hidden rounded-3xl border border-navy-900/10 bg-navy-950 shadow-2xl transition duration-500 hover:shadow-gold/10">
                <img
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
                  alt="ORIGIN Global Conference Main Auditorium Keynote"
                  className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">Flagship Plenary</p>
                  <p className="mt-1 text-sm font-medium text-white/90">Curating Premier Scientific & Executive Summits Worldwide</p>
                </div>
              </div>

              {/* Secondary Overlapping Image: Networking session */}
              <div className="absolute -bottom-8 -right-4 hidden w-1/2 overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block md:-right-6 md:w-5/12">
                <img
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
                  alt="Delegates networking at ORIGIN summit"
                  className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>

              {/* Floating Highlight Badge: Global Standard */}
              <div className="absolute -left-4 -top-5 rounded-2xl border border-white/20 bg-navy-950/90 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:-left-6 sm:px-5 sm:py-3.5">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Global Standard</span>
                </div>
                <p className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">50+</p>
                <p className="text-xs text-white/70">Summits Curated Worldwide</p>
              </div>

              {/* Floating Credential Pill */}
              <div className="absolute -bottom-6 left-6 hidden items-center gap-2 rounded-full border border-charcoal/10 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm sm:flex">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-navy-950">CPD & CME Accredited Programs</span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Editorial Copy & Value Pillars */}
          <Reveal delay={0.15} className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-navy-950">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              About ORIGIN Conferences
            </div>

            <h2 className="h2 mt-4 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl lg:text-5xl">
              Creating Experiences That Move Ideas Forward
            </h2>

            <p className="mt-5 text-base leading-relaxed text-charcoal/80 sm:text-lg">
              ORIGIN Conferences is a premier global event and scientific summit organizer. We unite distinguished clinicians, academic researchers, enterprise innovators, and industry pioneers across Europe, the Middle East, and worldwide to accelerate knowledge exchange, foster high-value partnerships, and shape tomorrow’s breakthroughs.
            </p>

            {/* Feature Cards Grid */}
            <div className="mt-8 space-y-4 sm:space-y-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group flex items-start gap-4 rounded-xl border border-charcoal/10 bg-white/80 p-4 shadow-sm transition hover:border-gold/50 hover:bg-white hover:shadow-md"
                >
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gold/15 text-navy-950 transition group-hover:bg-gold group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy-950">{title}</h3>
                    <p className="mt-1 text-sm text-charcoal/70">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#conferences" className="btn btn-dark group flex items-center gap-2 shadow-md">
                <span>Explore Conferences</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#services" className="btn btn-outline border-navy-950/20 text-navy-950 hover:border-navy-950 hover:bg-navy-950 hover:text-white">
                Our Event Services
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

