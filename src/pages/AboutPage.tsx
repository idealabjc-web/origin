import { motion } from 'framer-motion'
import { Award, Globe2, Target, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { stats } from '../data/content'

export default function AboutPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const pillars = [
    {
      icon: Target,
      title: 'Academic & Scientific Rigor',
      description: 'Every session, plenary lecture, and peer-reviewed abstract adheres to international academic benchmarks and CME/CPD accreditation standards.'
    },
    {
      icon: Globe2,
      title: 'Global Inclusivity',
      description: 'Connecting clinicians, researchers, and venture founders across 40+ nations through seamless hybrid technology and in-person summits.'
    },
    {
      icon: ShieldCheck,
      title: 'Ethical Governance',
      description: 'Transparent conference governance, unbiased scientific committee reviews, and dedicated delegate safeguarding protocols.'
    },
    {
      icon: Sparkles,
      title: 'Translational Impact',
      description: 'Bridging the critical gap between groundbreaking laboratory discovery and frontline clinical & enterprise implementation.'
    }
  ]

  const milestones = [
    { year: '2020', title: 'Inception of ORIGIN', desc: 'Founded with a clear vision: to modernize scientific and executive conference experiences worldwide.' },
    { year: '2022', title: 'Pioneered Hybrid Delivery', desc: 'Engineered custom low-latency streaming infrastructure connecting 3,000+ remote delegates across 25 countries.' },
    { year: '2024', title: 'Global Healthcare Expansion', desc: 'Launched premier congresses in Clinical Nursing Science, Digital Dentistry, and Entrepreneurial Leadership.' },
    { year: '2027', title: 'The Next Generation', desc: 'Hosting flagship congresses across London, Paris, and Geneva with CPD-accredited scientific agendas.' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal pt-[72px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-navy-950/80 to-navy-950" />
        <div className="container-x relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold text-gold uppercase tracking-wider">
              <Award size={14} /> About ORIGIN Conferences
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Convening the Minds That Shape Our Global Future
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              ORIGIN Conferences is an international conference organizer dedicated to curating world-class summits in Healthcare, Dental Sciences, Business Leadership, and Academic Research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="bg-navy-900 border-y border-white/10 py-10 text-white">
        <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-3xl font-extrabold text-gold lg:text-4xl">
                {s.value}{s.suffix}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/70 font-medium">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Our Mission &amp; Purpose</p>
            <h2 className="h2 mt-2">Transforming Academic Exchange into Real-World Progress</h2>
            <p className="mt-6 text-base text-charcoal/80 leading-relaxed">
              We believe meaningful innovation doesn't occur in silos. It happens when university researchers, clinical practitioners, hospital leaders, and venture innovators gather under one roof to challenge orthodoxy.
            </p>
            <p className="mt-4 text-sm text-charcoal/70 leading-relaxed">
              From our flagship Global Nursing Science Congress in London to the World Euro Dental Congress in Paris and our Global Business Leadership summit in Geneva, ORIGIN provides meticulously orchestrated environments where scholarly discussion translates into measurable outcomes.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Full CME/CPD Accreditation on all medical & clinical programs',
                'Peer-reviewed oral & poster presentation tracks with published abstracts',
                'Global hybrid live-stream infrastructure with interactive Q&A',
                'Bespoke executive roundtables and cross-sector networking receptions'
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-navy-950">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
                alt="Conference auditorium hall"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 backdrop-blur-md shadow-lg border border-white/20">
                <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">Secretariat Headquarters</p>
                <p className="font-display text-base font-bold text-navy-950 mt-1">Dedicated Conference Committees</p>
                <p className="text-xs text-charcoal/70 mt-0.5">Operating across the United Kingdom, Switzerland, and the European Union.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="bg-white py-20 lg:py-28 border-t border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Our Guiding Values</p>
            <h2 className="h2 mt-2">The Pillars of ORIGIN Conferences</h2>
            <p className="mt-4 text-sm text-charcoal/60">
              Every conference we organize is anchored in four uncompromising commitments to scientific excellence.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-slate-50 p-8 border border-slate-200/80 shadow-sm transition-all hover:shadow-xl hover:border-gold/50"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/20 text-gold-dark mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy-950">{p.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-charcoal/70">{p.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Chronological Milestones */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Our Journey</p>
            <h2 className="h2 mt-2">Milestones of Global Excellence</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <div key={i} className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <span className="font-mono text-xs font-bold text-gold-dark bg-gold/15 px-2.5 py-1 rounded-md">
                  {m.year}
                </span>
                <h3 className="font-display text-base font-bold text-navy-950 mt-4">{m.title}</h3>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-navy-950 py-16 text-white text-center">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-white">
            Ready to Join Our Next World Congress?
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Browse our official 2027 calendar of accredited conferences or register as an active speaker.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('/conferences')}
              className="btn btn-gold text-sm font-bold px-8 py-3.5 shadow-xl flex items-center gap-2"
            >
              <span>Explore Conferences</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="btn btn-ghost text-sm font-bold px-8 py-3.5"
            >
              Contact Secretariat
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
