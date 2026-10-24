import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Linkedin, Building2, BookOpen, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { speakers as fallbackSpeakers, type Speaker } from '../data/content'
import { getSpeakers, submitSpeakerApplication, isSupabaseConfigured } from '../lib/supabase'
import Modal from '../components/Modal'

export default function SpeakersPage() {
  const [speakersList, setSpeakersList] = useState<Speaker[]>(fallbackSpeakers)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Speaker Application Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [field, setField] = useState('Healthcare & Life Sciences')
  const [abstractText, setAbstractText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error' | 'info'; msg: string }>({ kind: 'idle', msg: '' })

  useEffect(() => {
    function load() {
      getSpeakers().then((data) => {
        if (data && data.length > 0) setSpeakersList(data)
      })
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  async function handleApplySpeaker(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !abstractText.trim()) {
      return setStatus({ kind: 'error', msg: 'Please fill in your name, email, and proposed topic abstract.' })
    }

    if (!isSupabaseConfigured) {
      return setStatus({
        kind: 'info',
        msg: 'Supabase is not configured yet. Configure credentials in .env to save proposals.',
      })
    }

    setSubmitting(true)
    const res = await submitSpeakerApplication({
      full_name: name.trim(),
      email: email.trim(),
      affiliation: affiliation.trim() || undefined,
      field,
      proposal_abstract: abstractText.trim()
    })
    setSubmitting(false)

    if (res.success) {
      setStatus({
        kind: 'ok',
        msg: 'Your speaking proposal has been received! Our Scientific Advisory Committee will review your submission.'
      })
      setName('')
      setEmail('')
      setAffiliation('')
      setAbstractText('')
    } else {
      setStatus({ kind: 'error', msg: res.error || 'Failed to submit proposal. Please try again.' })
    }
  }

  const filtered = speakersList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      (s.organization && s.organization.toLowerCase().includes(search.toLowerCase())) ||
      (s.topic && s.topic.toLowerCase().includes(search.toLowerCase()))
  )

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
              <Mic size={14} /> World-Renowned Faculty
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Distinguished Keynotes &amp; Visionaries
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
              Meet the global pioneers, clinical professors, and industry authorities headlining our 2027 congresses.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-gold text-sm font-bold px-8 py-3.5 shadow-xl flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>Apply as a Speaker</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Speakers Roster */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200">
            <div>
              <p className="eyebrow">Our Faculty</p>
              <h2 className="h2 mt-1">Confirmed Keynote Speakers</h2>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search speakers by name, topic, institution..."
              className="rounded-full border border-slate-300 px-5 py-2.5 text-xs outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 w-full sm:w-72 bg-white"
            />
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((s) => (
              <motion.article
                key={s.id}
                whileHover={{ y: -6 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-2xl hover:border-gold/50"
              >
                <div>
                  <div className="relative aspect-[4/4] overflow-hidden bg-slate-100">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    {s.linkedin && s.linkedin !== '#' && (
                      <a
                        href={s.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${s.name} LinkedIn`}
                        className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-navy-950 shadow hover:bg-gold transition opacity-0 group-hover:opacity-100"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-navy-950 group-hover:text-gold-dark transition">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-gold-dark">{s.role}</p>

                    {s.organization && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal/65">
                        <Building2 size={13} className="flex-shrink-0 text-navy-900" />
                        <span className="truncate">{s.organization}</span>
                      </p>
                    )}

                    {s.topic && (
                      <div className="mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <p className="flex items-center gap-1 text-[11px] font-bold text-navy-900 uppercase tracking-wider">
                          <BookOpen size={12} className="text-gold-dark" /> Keynote Subject
                        </p>
                        <p className="mt-1 text-xs text-charcoal/80 line-clamp-2 leading-relaxed">
                          {s.topic}
                        </p>
                      </div>
                    )}

                    {s.bio && (
                      <p className="mt-3 text-xs text-charcoal/65 line-clamp-3 leading-relaxed">
                        {s.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] font-bold text-navy-900">
                  <span>Plenary Speaker</span>
                  <span className="rounded-full bg-navy-950 px-2.5 py-0.5 text-white">2027</span>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="my-16 rounded-3xl bg-white p-12 text-center border border-slate-200">
              <p className="font-display text-lg font-bold text-navy-950">No speakers match your search.</p>
              <button onClick={() => setSearch('')} className="btn btn-dark mt-4 text-xs">
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Speaker Application Modal */}
      {modalOpen && (
        <Modal title="Apply as a Speaker" onClose={() => setModalOpen(false)}>
          <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-charcoal shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-navy-950">
              Submit a Speaking Proposal
            </h3>
            <p className="mt-1 text-xs text-charcoal/70">
              Join our international faculty. Accepted presenters receive official faculty credentials and abstract publication.
            </p>

            {status.kind === 'ok' ? (
              <div className="mt-6 flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="mt-4 font-semibold text-emerald-800 text-sm">{status.msg}</p>
                <button onClick={() => setModalOpen(false)} className="btn btn-dark mt-6 text-xs">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySpeaker} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Full Name &amp; Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prof. / Dr. Jane Doe, MD"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Academic / Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@university.edu"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Institution / Hospital / Organization
                  </label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="University College London / Mayo Clinic"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Scientific Discipline
                  </label>
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-navy-900"
                  >
                    <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sciences (Nursing / Clinical)</option>
                    <option value="Dental Sciences">Dental Sciences (Digital Dentistry / Prosthodontics)</option>
                    <option value="Business & Leadership">Business &amp; Entrepreneurial Leadership</option>
                    <option value="Research & Academia">Academic &amp; Pedagogical Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                    Proposed Talk Title &amp; Abstract *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    placeholder="Outline your research focus, methodology, clinical trial outcomes, or practical leadership framework..."
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

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-dark text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
