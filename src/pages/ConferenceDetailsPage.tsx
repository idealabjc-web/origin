import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CalendarDays, MapPin,
  Globe, Share2, Ticket, ChevronRight,
  Sparkles, Layers, Image as ImageIcon,
  Send, X, Maximize2
} from 'lucide-react'
import { type Conference } from '../data/content'
import { submitEventRegistration, getConferences } from '../lib/supabase'

interface ConferenceDetailsPageProps {
  conference: Conference
  onBack: () => void
  onHome?: () => void
  onNavigateToConference?: (id: string) => void
}

function parseSessionsList(val: string[] | string | undefined | null): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return val.split(/[,;\n•]+/).map((s) => s.trim()).filter(Boolean)
}

export default function ConferenceDetailsPage({
  conference,
  onBack,
  onHome,
  onNavigateToConference
}: ConferenceDetailsPageProps) {
  const [copied, setCopied] = useState(false)
  const [otherConferences, setOtherConferences] = useState<Conference[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Registration form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [attendanceType, setAttendanceType] = useState<'In-Person' | 'Virtual Hybrid'>('In-Person')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'ok' | 'error' | 'info'; msg: string } | null>(null)

  // Load other conferences dynamically from CMS / Supabase
  useEffect(() => {
    getConferences().then((data) => {
      if (Array.isArray(data)) {
        setOtherConferences(data.filter((c) => c.id !== conference.id))
      }
    })
  }, [conference.id])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [conference.id])

  const sessions = parseSessionsList(conference.sessions)
  const middleImages = Array.isArray(conference.images) ? conference.images : []
  const aboutParagraphs = conference.description
    ? conference.description.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean)
    : []

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      return setStatus({ kind: 'error', msg: 'Full name and email are required.' })
    }

    setSubmitting(true)
    const res = await submitEventRegistration({
      event_id: conference.id,
      event_name: conference.title,
      full_name: name.trim(),
      email: email.trim(),
      organization: org.trim() || undefined,
      ticket_type: attendanceType,
    })
    setSubmitting(false)

    if (res.success) {
      setStatus({
        kind: 'ok',
        msg: 'Registration confirmed! A delegate package and itinerary details have been sent to your inbox.',
      })
      setName('')
      setEmail('')
      setOrg('')
    } else {
      setStatus({ kind: 'error', msg: res.error || 'Failed to submit registration. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-navy-950 font-sans">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-50 flex h-[72px] sm:h-[84px] md:h-[92px] items-center justify-between border-b border-white/10 bg-navy-950/90 px-4 sm:px-6 backdrop-blur-xl">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white/80 transition hover:text-amber-300"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-amber-400" />
          <span className="hidden sm:inline">Back to All Conferences</span>
          <span className="sm:hidden">Conferences</span>
        </button>

        <button
          onClick={onHome || onBack}
          className="group hidden sm:flex items-center gap-2 transition cursor-pointer"
        >
          <img
            src="/origin-logo.png"
            alt="ORIGIN Global Conferences"
            className="h-11 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md"
          />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            <Share2 size={13} className="text-amber-400" />
            <span>{copied ? 'Link Copied!' : 'Share Congress'}</span>
          </button>
          <a
            href="#register-section"
            className="btn btn-gold text-xs py-2 px-3.5 sm:px-5 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition"
          >
            <span className="hidden sm:inline">Register as Delegate</span>
            <span className="sm:hidden">Register</span>
          </a>
        </div>
      </header>

      {/* ── Quick Sub-Navbar with Flow Anchors ── */}
      <nav aria-label="Conference sub-navigation" className="sticky top-[72px] sm:top-[84px] md:top-[92px] z-40 hidden md:block bg-navy-950/85 backdrop-blur-md border-b border-white/5 py-2.5">
        <div className="container-x flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
            <a href="#about" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">About</a>
            {conference.theme && (
              <a href="#theme" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Theme</a>
            )}
            {middleImages.length > 0 && (
              <a href="#gallery" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Gallery ({middleImages.length})</a>
            )}
            {sessions.length > 0 && (
              <a href="#sessions" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Sessions ({sessions.length})</a>
            )}
            <a href="#register-section" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Register</a>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Registration Open • {conference.location}
          </span>
        </div>
      </nav>

      {/* ── CINEMATIC HERO SECTION ── */}
      <section className="relative overflow-hidden bg-navy-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Ambient Glowing Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={conference.image}
            alt={conference.title}
            className="h-full w-full object-cover opacity-20 filter blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-navy-950/90 to-navy-950/80" />
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column (7 cols): Title, Category, Meta, and Actions */}
            <div className="lg:col-span-7">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-400/20 via-amber-500/10 to-transparent px-4 py-1.5 text-xs font-bold text-amber-300 tracking-wide backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="uppercase text-[11px] font-mono">OFFICIAL WORLD CONGRESS</span>
                <span className="text-white/40">•</span>
                <span className="text-white/90">{conference.category}</span>
              </div>

              {/* Conference Title */}
              <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight drop-shadow-md">
                {conference.title}
              </h1>

              {/* Theme highlight if present */}
              {conference.theme && (
                <p className="mt-5 text-base sm:text-lg text-amber-300/90 leading-relaxed max-w-2xl font-medium italic">
                  "{conference.theme}"
                </p>
              )}

              {/* Meta Pills: Date & Location */}
              <div className="mt-8 flex flex-wrap gap-4 max-w-2xl">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-md shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/20 text-amber-400 flex-shrink-0">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Date &amp; Schedule</div>
                    <div className="font-display text-sm font-bold text-white">{conference.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-md shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/20 text-amber-400 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Venue &amp; Location</div>
                    <div className="font-display text-sm font-bold text-white">{conference.location}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#register-section"
                  className="btn btn-gold text-sm font-extrabold px-8 py-4 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] flex items-center gap-2 rounded-full transform hover:scale-105 transition duration-300"
                >
                  <Ticket size={18} />
                  <span>Register as Delegate</span>
                </a>
                {sessions.length > 0 && (
                  <a
                    href="#sessions"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-white hover:bg-white/15 hover:border-amber-400 transition"
                  >
                    <Layers size={17} className="text-amber-400" />
                    <span>View {sessions.length} Sessions</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Cover Image Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900/90 to-navy-950/95 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-navy-950">
                  <img
                    src={conference.image}
                    alt={conference.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-navy-950/90 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-400/30 backdrop-blur-md">
                    {conference.category}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Registration Open
                    </span>
                    <span className="text-amber-300 font-mono text-[11px]">{conference.location}</span>
                  </div>
                </div>

                {/* Quick Info Bar */}
                <div className="mt-5 grid grid-cols-2 divide-x divide-white/10 rounded-2xl bg-slate-950/70 p-4 text-center border border-white/5">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Format</div>
                    <div className="font-display text-sm font-bold text-amber-400 mt-0.5">In-Person &amp; Hybrid</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Program Sessions</div>
                    <div className="font-display text-sm font-bold text-white mt-0.5">
                      {sessions.length > 0 ? `${sessions.length} Sessions` : 'To be announced'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXACT USER FLOW: ABOUT -> THEME -> MIDDLE IMAGES -> SESSIONS ── */}
      <div className="container-x py-16 sm:py-20 lg:py-24 space-y-16 sm:space-y-24 max-w-5xl">

        {/* 1. ABOUT SECTION */}
        <section id="about" className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
            <Sparkles size={16} /> Official Congress Overview
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            About the Conference
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-amber-400" />

          {/* About narrative from CMS */}
          <div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-slate-200">
            {aboutParagraphs.length > 0 ? (
              aboutParagraphs.map((para, idx) => (
                <p key={idx} className={idx === 0 ? 'text-amber-100 font-medium leading-relaxed' : 'leading-relaxed text-slate-300'}>
                  {para}
                </p>
              ))
            ) : (
              <p className="text-slate-400 italic">No description provided yet.</p>
            )}
          </div>
        </section>

        {/* 2. THEME SECTION */}
        {conference.theme && (
          <section id="theme" className="scroll-mt-28 rounded-3xl border border-amber-400/30 bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
              <Globe size={16} /> Central Academic &amp; Industry Theme
            </div>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
              Conference Theme
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-amber-400" />

            <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 sm:p-8 backdrop-blur-md">
              <p className="font-display text-2xl sm:text-3xl font-bold text-amber-300 leading-snug">
                "{conference.theme}"
              </p>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Guiding the academic tracks, keynote presentations, clinical demonstrations, and multidisciplinary roundtable discussions for this congress.
              </p>
            </div>
          </section>
        )}

        {/* 3. MIDDLE IMAGES SECTION (CONFERENCE GALLERY) */}
        {middleImages.length > 0 && (
          <section id="gallery" className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <ImageIcon size={16} /> Summit Atmosphere
                </div>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Conference Gallery
                </h2>
                <div className="mt-4 h-1 w-20 rounded-full bg-amber-400" />
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                {middleImages.length} {middleImages.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>

            <div className={`mt-8 grid gap-4 ${
              middleImages.length === 1
                ? 'grid-cols-1'
                : middleImages.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {middleImages.map((imgUrl, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedImage(imgUrl)}
                  className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-navy-950 cursor-pointer shadow-lg transition duration-300 hover:border-amber-400/50 hover:shadow-2xl"
                >
                  <img
                    loading="lazy"
                    src={imgUrl}
                    alt={`${conference.title} moment ${i + 1}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-xs font-semibold text-white drop-shadow">View High Resolution</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-navy-950 shadow">
                      <Maximize2 size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. SESSIONS SECTION */}
        <section id="sessions" className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                <Layers size={16} /> Program Tracks &amp; Focus Areas
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Conference Sessions
              </h2>
              <div className="mt-4 h-1 w-20 rounded-full bg-amber-400" />
            </div>
            {sessions.length > 0 && (
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'}
              </span>
            )}
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-300">
            Comprehensive session tracks curated for keynote lectures, oral papers, clinical presentations, and interactive discussions.
          </p>

          {sessions.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {sessions.map((sess, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-slate-950/80 p-5 transition-all duration-300 hover:border-amber-400/50 hover:bg-slate-950 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-amber-400/20 text-xs font-black text-amber-400 font-mono">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition leading-snug">
                        {sess}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Oral, Poster &amp; Keynote Track
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-amber-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Official Curriculum Session
                    </span>
                    <span>Accredited</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-sm text-slate-400">
              Detailed session tracks and presentation slots will be published shortly.
            </div>
          )}
        </section>

        {/* 5. DELEGATE REGISTRATION SECTION */}
        <section id="register-section" className="scroll-mt-28 rounded-3xl border border-amber-400/40 bg-gradient-to-b from-slate-900 to-navy-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              <Ticket size={14} className="text-amber-400" /> Delegate Enrollment
            </div>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Register for this Congress
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Secure your place as a registered delegate for <strong className="text-white">{conference.title}</strong>. Receive the full conference agenda, keynote abstracts, and venue pass.
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 max-w-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. j.smith@institution.org"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Organization / Hospital / University
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. National Health Institute"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Attendance Mode
                </label>
                <select
                  value={attendanceType}
                  onChange={(e) => setAttendanceType(e.target.value as any)}
                  className="w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                >
                  <option value="In-Person">In-Person Congress Pass</option>
                  <option value="Virtual Hybrid">Virtual Hybrid Pass (Live Stream)</option>
                </select>
              </div>
            </div>

            {status && (
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm font-medium ${
                  status.kind === 'ok'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : status.kind === 'error'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {status.msg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-gold text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={15} />
              <span>{submitting ? 'Confirming Registration...' : 'Confirm Delegate Registration'}</span>
            </button>
          </form>
        </section>

      </div>

      {/* ── EXPLORE OTHER PREMIER CONFERENCES SECTION ── */}
      {otherConferences.length > 0 && (
        <section className="bg-slate-950 border-t border-white/10 py-20">
          <div className="container-x max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Next Congresses</p>
                <h3 className="font-display text-3xl font-extrabold text-white">
                  Explore Other Premier Summits
                </h3>
              </div>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-white transition"
              >
                <span>Back to All Conferences</span>
                <ArrowLeft size={14} className="rotate-180 text-amber-400" />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {otherConferences.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (onNavigateToConference) {
                      onNavigateToConference(c.id)
                    } else {
                      window.history.pushState(null, '', `/conference/${c.id}`)
                      window.dispatchEvent(new PopStateEvent('popstate'))
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (onNavigateToConference) onNavigateToConference(c.id)
                    }
                  }}
                  className="group cursor-pointer rounded-3xl bg-slate-900/80 p-6 shadow-xl border border-white/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-amber-400/50 flex flex-col justify-between"
                >
                  <div>
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold text-amber-300">
                      {c.category}
                    </span>
                    <h4 className="mt-4 font-display text-xl font-bold text-white group-hover:text-amber-300 transition leading-snug">
                      {c.title}
                    </h4>
                    {c.theme && (
                      <p className="mt-1 text-xs text-amber-400/80 line-clamp-1 italic">
                        {c.theme}
                      </p>
                    )}
                    <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-amber-400" />
                        <span>{c.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-400" />
                        <span>{c.location}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-white">
                    <span>Open Congress Page</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── High-Res Image Lightbox Modal ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 bg-navy-950">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition z-10"
              >
                <X size={18} />
              </button>
              <img
                src={selectedImage}
                alt="Conference Photo Full View"
                className="max-h-[85vh] w-auto object-contain mx-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
