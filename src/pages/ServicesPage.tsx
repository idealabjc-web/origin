import { motion } from 'framer-motion'
import {
  ClipboardCheck, Globe2, Users, MonitorPlay, Handshake, Megaphone,
  CheckCircle2, ArrowRight, Sparkles
} from 'lucide-react'

export default function ServicesPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const serviceCards = [
    {
      icon: ClipboardCheck,
      title: 'End-to-End Conference Management',
      desc: 'Complete turnkey logistics from scientific agenda structuring, venue procurement, AV staging, and catering to on-site delegate flow coordination.',
      features: ['Venue contract negotiation across Europe & UK', 'Scientific abstract submission portal', 'CME / CPD certification issuance', 'On-site registration desk & delegate badges']
    },
    {
      icon: Globe2,
      title: 'International Speaker Coordination',
      desc: 'Dedicated concierge management for keynote faculty, academic deans, and distinguished clinical researchers from initial invitation to podium delivery.',
      features: ['VIP travel & 5-star lodging arrangements', 'Slide deck technical rehearsal & dry-runs', 'Honorarium & visa compliance administration', 'Customized executive speaker kits']
    },
    {
      icon: Users,
      title: 'Delegate Registration & Payment Gateways',
      desc: 'Seamless, multi-currency registration workflows with automated invoice generation, group hospital bookings, and instant delegate confirmations.',
      features: ['Tiered pass types (Academic, Regular, VIP, Virtual)', 'Integrated Supabase & Stripe/PayPal processing', '24/7 dedicated delegate support ticketing', 'Automated attendee visa invitation letters']
    },
    {
      icon: MonitorPlay,
      title: 'Hybrid & Broadcast Streaming Solutions',
      desc: 'Ultra-low-latency 4K interactive broadcasting that immerses global virtual attendees directly into live ballroom discussions and Q&A sessions.',
      features: ['Dual-camera broadcast production & live switching', 'Interactive live polling & attendee chat', 'On-demand encrypted session archive replay', 'Digital poster session galleries']
    },
    {
      icon: Handshake,
      title: 'Sponsorship & Exhibition Management',
      desc: 'Structured high-ROI exhibitor packages that connect innovative medical device, pharmaceutical, and enterprise sponsors with verified decision makers.',
      features: ['Exhibition floor plan layout & booth buildouts', 'Sponsored symposium & breakfast workshop slots', 'Lead capture badge scanners for exhibitors', 'Comprehensive post-event ROI analytics reports']
    },
    {
      icon: Megaphone,
      title: 'Global Conference Promotion & Outreach',
      desc: 'Targeted multi-channel campaigns reaching academic institutions, specialized medical societies, professional associations, and industry executives.',
      features: ['Direct academic mailing lists reaching 100,000+ clinicians', 'Digital marketing campaigns on LinkedIn & Google Scholar', 'Strategic media partner distribution', 'Official conference press release syndication']
    }
  ]

  const workflowSteps = [
    { step: '01', title: 'Strategic Inception', desc: 'We align on congress objectives, target scientific themes, and establish the governing committee.' },
    { step: '02', title: 'Speaker & Call for Papers', desc: 'Launch the abstract portal, secure keynote visionaries, and coordinate peer reviews.' },
    { step: '03', title: 'Delegate Campaigns & Logistics', desc: 'Open multi-tier registration, activate targeted outreach, and finalize venue staging.' },
    { step: '04', title: 'Flawless Podium Execution', desc: 'On-site execution, live hybrid streaming, CPD accreditation, and post-conference publishing.' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal pt-[72px] sm:pt-[84px] md:pt-[92px]">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy-950 py-14 sm:py-20 text-white lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950/80 to-navy-950" />
        <div className="container-x relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold text-gold uppercase tracking-wider">
              <Sparkles size={14} /> Comprehensive Event Operations
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              World-Class Conference Services
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              From initial call-for-papers to final plenary applause, ORIGIN provides end-to-end management for prestigious academic and corporate congresses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/contact')}
                className="btn btn-gold text-sm font-bold px-8 py-3.5 shadow-xl flex items-center gap-2"
              >
                <span>Request a Proposal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">What We Deliver</p>
            <h2 className="h2 mt-2">Specialized Congress Operations</h2>
            <p className="mt-3 text-sm text-charcoal/60">
              Every detail engineered for scholarly prestige, financial sustainability, and unforgettable delegate experiences.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((s, idx) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm transition-all hover:shadow-2xl hover:border-gold/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/20 text-gold-dark mb-6">
                      <Icon size={28} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-navy-950">{s.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-charcoal/70">{s.desc}</p>

                    <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                      {s.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-charcoal/85">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy-900">
                    <span>Inquire for this service</span>
                    <span className="text-gold">→</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4-Step Methodology */}
      <section className="bg-white py-20 lg:py-28 border-t border-slate-200">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Our Proven Methodology</p>
            <h2 className="h2 mt-2">How We Execute Global Summits</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((w, i) => (
              <div key={i} className="relative rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <span className="font-display text-2xl font-black text-gold">
                  {w.step}
                </span>
                <h3 className="font-display text-base font-bold text-navy-950 mt-4">{w.title}</h3>
                <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Strip */}
      <section className="bg-navy-950 py-16 text-white text-center">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-white">
            Organizing an Upcoming Scientific or Corporate Congress?
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Let ORIGIN take the operational burden off your faculty or executive committee so you can focus purely on content.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('/contact')}
              className="btn btn-gold text-sm font-bold px-8 py-3.5 shadow-xl"
            >
              Contact Conference Secretariat
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
