import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Phone, Send, CheckCircle2, AlertCircle,
  ChevronDown, Clock, ShieldCheck, Globe2
} from 'lucide-react'
import { submitContactMessage, isSupabaseConfigured } from '../lib/supabase'

export default function ContactPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error' | 'info'; msg: string }>({ kind: 'idle', msg: '' })

  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How do I submit an academic abstract for oral or poster presentation?',
      a: 'Navigate to the dedicated conference page (e.g. Global Nursing Science Congress 2027) and click "Register as Delegate", selecting "Oral Presenter" or "Poster Presenter". You may also email your abstract draft directly to our secretariat.'
    },
    {
      q: 'Are ORIGIN Conferences CME / CPD accredited?',
      a: 'Yes, all our healthcare, clinical nursing, and dental congresses are formally accredited by international Continuing Professional Development bodies, providing verified credit certificates upon completion.'
    },
    {
      q: 'Can international delegates request official visa support letters?',
      a: 'Yes. Once your registration is confirmed in our system, our international coordination team automatically issues an official stamped Invitation Letter for your visa application.'
    },
    {
      q: 'How do virtual/hybrid attendees participate?',
      a: 'Virtual delegates receive dedicated encrypted portal access 7 days prior to the summit, featuring multi-angle 4K ballroom streams, real-time audio Q&A, and access to recorded sessions for 90 days.'
    },
    {
      q: 'What is the refund, cancellation, or participant substitution policy?',
      a: 'Speaker cancellations received 90+ days before the conference qualify for a 75% refund; 60–89 days qualify for a 50% refund; fewer than 60 days are non-refundable. Alternatively, registration fees may be carried over as credit toward a future event, or a substitute Speaker/Delegate may attend with prior written approval from the conference manager.'
    }
  ]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      return setStatus({ kind: 'error', msg: 'Please provide your name, email, and message.' })
    }

    if (!isSupabaseConfigured) {
      return setStatus({
        kind: 'info',
        msg: 'Supabase is not configured yet. Add your credentials in .env to save messages.',
      })
    }

    setSubmitting(true)
    const res = await submitContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || undefined,
      message: message.trim()
    })
    setSubmitting(false)

    if (res.success) {
      setStatus({
        kind: 'ok',
        msg: 'Thank you for reaching out! Your message has been routed to the conference secretariat. We typically respond within 12 business hours.'
      })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } else {
      setStatus({ kind: 'error', msg: res.error || 'Failed to submit message. Please try again.' })
    }
  }

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
              <Mail size={14} /> Contact &amp; Secretariat
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Connect with Our Team
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
              Have questions regarding speaking invitations, registration support, or institutional delegations? Our secretariat is here to assist.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Grid: Form + Info */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container-x grid gap-10 sm:gap-12 lg:grid-cols-12">
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white p-5 sm:p-8 md:p-10 shadow-sm border border-slate-200">
            <h2 className="font-display text-2xl font-bold text-navy-950 sm:text-3xl">
              Send an Inquiry
            </h2>
            <p className="mt-2 text-xs text-charcoal/70">
              Fill out the form below and an ORIGIN coordinator will respond promptly.
            </p>

            {status.kind === 'ok' ? (
              <div className="my-8 rounded-2xl bg-emerald-50 p-8 text-center border border-emerald-200">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="font-display text-lg font-bold text-emerald-950 mt-3">Message Received</h3>
                <p className="mt-2 text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">{status.msg}</p>
                <button
                  onClick={() => setStatus({ kind: 'idle', msg: '' })}
                  className="btn btn-dark text-xs mt-6"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jordan Hayes"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                      Work / Academic Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan.hayes@hospital.org"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Subject / Conference Topic
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Group Registration for GNSC 2027 London"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your query, number of delegates, or sponsorship requirements..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-navy-900"
                  />
                </div>

                {status.kind === 'error' && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-600">
                    <AlertCircle size={14} /> {status.msg}
                  </p>
                )}

                {status.kind === 'info' && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    {status.msg}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-dark text-sm font-bold flex items-center justify-center gap-2 py-3 px-8 w-full sm:w-auto disabled:opacity-50"
                  >
                    <Send size={15} />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Details & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-navy-950 p-8 text-white shadow-xl">
              <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold text-gold uppercase tracking-wider">
                Direct Channels
              </span>
              <h3 className="font-display text-2xl font-bold mt-3">Secretariat Office</h3>
              <p className="mt-1 text-xs text-white/60">
                Operating hubs across London, Geneva, and Paris.
              </p>

              <div className="mt-8 space-y-5 text-sm text-white/85">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold">General Inquiries</p>
                    <a href="mailto:contact@originconferences.com" className="font-semibold hover:text-gold transition">
                      contact@originconferences.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Telephone Support</p>
                    <p className="font-semibold">+44 (0) 20 7946 0912</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Working Hours</p>
                    <p className="text-xs">Monday – Friday: 08:30 – 18:00 GMT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold flex-shrink-0">
                    <Globe2 size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Global Secretariat</p>
                    <p className="text-xs">London EC2A 4NE, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h4 className="font-display font-bold text-sm text-navy-950 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={18} /> Official Policies &amp; Governance
              </h4>
              <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                All registrations, personal data, and refund requests are governed by our official conference policies.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onNavigate) onNavigate('/terms')
                  }}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-gold/20 transition"
                >
                  Terms &amp; Conditions
                </a>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onNavigate) onNavigate('/privacy')
                  }}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-gold/20 transition"
                >
                  Privacy Policy
                </a>
                <a
                  href="/refund-policy"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onNavigate) onNavigate('/refund-policy')
                  }}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-gold/20 transition"
                >
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-white py-20 lg:py-28 border-t border-slate-200">
        <div className="container-x max-w-4xl">
          <div className="text-center">
            <p className="eyebrow">Got Questions?</p>
            <h2 className="h2 mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-display text-base font-bold text-navy-950 pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-gold-dark flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 text-xs text-charcoal/75 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
