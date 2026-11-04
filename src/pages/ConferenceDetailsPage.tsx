import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CalendarDays, MapPin,
  Share2, Ticket, ChevronRight,
  Layers, Send, X, Maximize2,
  BookOpen, Quote, ArrowUpRight, Sparkles,
  Download, FileText, CheckCircle2, Phone, Mail, User, Loader2
} from 'lucide-react'
import { getConferenceTopic, parseSessionsList, type Conference } from '../data/content'
import { submitEventRegistration, submitContactInquiry, getConferences, getCachedConferences, unpackConferenceData, supabase, isSupabaseConfigured } from '../lib/supabase'

interface ConferenceDetailsPageProps {
  conference: Conference
  onBack: () => void
  onHome?: () => void
  onNavigateToConference?: (id: string) => void
  onNavigate?: (path: string) => void
}

export default function ConferenceDetailsPage({
  conference,
  onBack,
  onHome,
  onNavigateToConference,
  onNavigate
}: ConferenceDetailsPageProps) {
  const [currentConf, setCurrentConf] = useState<Conference>(conference)
  const [copied, setCopied] = useState(false)
  const [otherConferences, setOtherConferences] = useState<Conference[]>(() =>
    getCachedConferences().filter((c) => c.id !== conference.id)
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Registration form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [attendanceType, setAttendanceType] = useState<'In-Person' | 'Virtual Hybrid'>('In-Person')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'ok' | 'error' | 'info'; msg: string } | null>(null)

  // Download Form Modal State (Brochure / Abstract)
  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean
    type: 'brochure' | 'abstract'
  } | null>(null)

  const [downloadForm, setDownloadForm] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [downloadSubmitting, setDownloadSubmitting] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [directDownloadUrl, setDirectDownloadUrl] = useState('')

  // Sync when prop changes
  useEffect(() => {
    setCurrentConf(conference)
  }, [conference])

  // Hydrate full Theme, Sessions, Description, and Images
  useEffect(() => {
    let isMounted = true

    function syncConference() {
      const all = getCachedConferences()
      const found = all.find((c) => c.id.toLowerCase() === conference.id.toLowerCase())
      if (found && isMounted) {
        setCurrentConf((prev) => ({
          ...prev,
          ...found,
          theme: found.theme || prev.theme,
          sessions: found.sessions || prev.sessions,
          description: found.description || prev.description,
          images: (found.images && found.images.length > 0) ? found.images : prev.images,
          brochureUrl: found.brochureUrl || prev.brochureUrl,
          abstractUrl: found.abstractUrl || prev.abstractUrl,
        }))
      }
    }

    syncConference()
    window.addEventListener('origin:data-updated', syncConference)

    // Direct single query fallback if theme or sessions are not yet hydrated
    const needsHydration = !currentConf.theme || !currentConf.sessions || !currentConf.description
    if (needsHydration && isSupabaseConfigured && supabase) {
      supabase
        .from('conferences')
        .select('*')
        .eq('id', conference.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data && isMounted) {
            const { description: cleanDesc, theme: metaTheme, sessions: metaSessions, images: metaImages, brochureUrl: metaBrochure, abstractUrl: metaAbstract } = unpackConferenceData(data.description)
            setCurrentConf((prev) => ({
              ...prev,
              id: data.id,
              title: data.title,
              category: data.category,
              date: data.date,
              location: data.location,
              description: cleanDesc || data.description || '',
              image: data.image || prev.image,
              href: data.href || '#',
              theme: data.theme || metaTheme || '',
              sessions: data.sessions || metaSessions || '',
              images: (Array.isArray(data.images) && data.images.length > 0)
                ? data.images
                : (metaImages && metaImages.length > 0 ? metaImages : prev.images),
              brochureUrl: data.brochure_url || data.brochureUrl || metaBrochure || prev.brochureUrl || '',
              abstractUrl: data.abstract_url || data.abstractUrl || metaAbstract || prev.abstractUrl || ''
            }))
          }
        })
    }

    return () => {
      isMounted = false
      window.removeEventListener('origin:data-updated', syncConference)
    }
  }, [conference.id])

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

  // Extract resilient theme, sessions, images, and brochure/abstract (from direct columns or embedded metadata)
  const unpacked = unpackConferenceData(currentConf.description)
  const effectiveTheme = currentConf.theme || unpacked.theme || ''
  const effectiveSessions = currentConf.sessions || unpacked.sessions || ''
  const effectiveImages = (Array.isArray(currentConf.images) && currentConf.images.length > 0)
    ? currentConf.images
    : (unpacked.images.length > 0 ? unpacked.images : [])
  const effectiveBrochureUrl = currentConf.brochureUrl || unpacked.brochureUrl || ''
  const effectiveAbstractUrl = currentConf.abstractUrl || unpacked.abstractUrl || ''
  const sessions = parseSessionsList(effectiveSessions)
  const middleImages = effectiveImages
  const cleanDescription = (unpacked.description || currentConf.description || '')
    .replace(/<!--ORIGIN_DATA:[\s\S]*?-->/, '')
    .trim()
  const aboutParagraphs = cleanDescription
    ? cleanDescription.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean)
    : []

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  function openDownloadModal(type: 'brochure' | 'abstract') {
    setDownloadModal({ isOpen: true, type })
    setDownloadSuccess(false)
    setDirectDownloadUrl('')
  }

  function closeDownloadModal() {
    setDownloadModal(null)
    setDownloadSuccess(false)
    setDirectDownloadUrl('')
  }

  function triggerDocumentDownload(conf: Conference, type: 'brochure' | 'abstract') {
    const isBrochure = type === 'brochure'
    const targetUrl = isBrochure
      ? (conf.brochureUrl || effectiveBrochureUrl)
      : (conf.abstractUrl || effectiveAbstractUrl)

    if (targetUrl && targetUrl.trim()) {
      setDirectDownloadUrl(targetUrl.trim())
      const link = document.createElement('a')
      link.href = targetUrl.trim()
      link.target = '_blank'
      link.download = `${conf.title.replace(/[^a-zA-Z0-9]/g, '_')}_${isBrochure ? 'Brochure' : 'Abstract'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // Auto-generate official printable conference document if no custom file uploaded yet
    const docTitle = isBrochure ? `Official Conference Brochure` : `Call for Abstracts & Submission Guidelines`
    const docContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${docTitle} - ${conf.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
          .logo span { color: #d97706; }
          .title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 15px 0 10px; line-height: 1.3; }
          .meta { font-size: 14px; color: #475569; margin-bottom: 8px; }
          .theme { font-style: italic; color: #b45309; font-weight: 600; font-size: 16px; margin: 15px 0; background: #fef3c7; padding: 12px 18px; border-radius: 8px; }
          h2 { font-size: 18px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 30px; text-transform: uppercase; letter-spacing: 0.5px; }
          p { margin: 10px 0; font-size: 14px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 6px; font-size: 14px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
          .btn-print { background: #0f172a; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 20px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">Print or Save as PDF</button>
        <div class="header">
          <div class="logo">ORIGIN <span>GLOBAL CONFERENCES</span></div>
          <div class="title">${conf.title}</div>
          <div class="meta"><strong>Date & Schedule:</strong> ${conf.date}</div>
          <div class="meta"><strong>Location:</strong> ${conf.location}</div>
          <div class="meta"><strong>Category:</strong> ${conf.category}</div>
          ${conf.theme ? `<div class="theme">"${conf.theme}"</div>` : ''}
        </div>
        ${isBrochure ? `
          <h2>Executive Overview</h2>
          <p>${(conf.description || '').replace(/\\n/g, '<br/>')}</p>
          <h2>Scientific Sessions & Tracks</h2>
          <ul>
            ${parseSessionsList(conf.sessions).map(s => `<li>${s}</li>`).join('')}
          </ul>
          <h2>Delegate Registration & Inquiries</h2>
          <p>For registrations, group accommodations, or sponsorships, contact our delegate desk at <strong>contact@originconferences.com</strong>.</p>
        ` : `
          <h2>Call for Abstracts & Guidelines</h2>
          <p>Researchers, academicians, and clinicians are cordially invited to submit their original abstracts for oral, poster, and virtual presentations at <strong>${conf.title}</strong>.</p>
          <h2>Track Categories</h2>
          <ul>
            ${parseSessionsList(conf.sessions).map(s => `<li>${s}</li>`).join('')}
          </ul>
          <h2>Submission Requirements</h2>
          <ul>
            <li>Abstract length: 250 - 300 words.</li>
            <li>Include: Title, Author names, Affiliations, and 3 - 5 Keywords.</li>
            <li>Format: Introduction, Methods, Results, and Conclusion.</li>
            <li>Submit directly via contact@originconferences.com or through your delegate advisor.</li>
          </ul>
        `}
        <div class="footer">
          ORIGIN Global Conferences • https://www.originconferences.com • contact@originconferences.com
        </div>
      </body>
      </html>
    `
    const blob = new Blob([docContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setDirectDownloadUrl(url)
    const newTab = window.open(url, '_blank')
    if (!newTab) {
      const link = document.createElement('a')
      link.href = url
      link.download = `${conf.title.replace(/[^a-zA-Z0-9]/g, '_')}_${isBrochure ? 'Brochure' : 'Abstract'}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  async function handleDownloadSubmit(e: FormEvent) {
    e.preventDefault()
    if (!downloadForm.name.trim() || !downloadForm.email.trim() || !downloadForm.phone.trim()) {
      return
    }

    setDownloadSubmitting(true)
    const isBrochure = downloadModal?.type === 'brochure'
    const docTypeLabel = isBrochure ? 'Brochure' : 'Abstract'

    try {
      await submitContactInquiry({
        name: downloadForm.name.trim(),
        email: downloadForm.email.trim(),
        phone: downloadForm.phone.trim(),
        inquiry_type: isBrochure ? 'brochure_download' : 'abstract_download',
        message: `[Delegate Materials Download] Requested ${docTypeLabel} for "${currentConf.title}" (${currentConf.date}, ${currentConf.location}). Mobile: ${downloadForm.phone.trim()}`,
      })
    } catch (err) {
      console.warn('Inquiry submission notice:', err)
    }

    triggerDocumentDownload(currentConf, isBrochure ? 'brochure' : 'abstract')
    setDownloadSubmitting(false)
    setDownloadSuccess(true)
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      return setStatus({ kind: 'error', msg: 'Full name and email are required.' })
    }

    setSubmitting(true)
    const res = await submitEventRegistration({
      event_id: currentConf.id,
      event_name: currentConf.title,
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
      <header className="sticky top-0 z-50 h-[72px] sm:h-[84px] md:h-[92px] border-b border-white/10 bg-navy-950/90 backdrop-blur-xl">
        <div className="w-full max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-full flex items-center justify-between">
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
        </div>
      </header>

      {/* ── Quick Sub-Navbar with Flow Anchors ── */}
      <nav aria-label="Conference sub-navigation" className="sticky top-[72px] sm:top-[84px] md:top-[92px] z-40 hidden md:block bg-navy-950/85 backdrop-blur-md border-b border-white/5 py-2.5">
        <div className="container-x flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
            <a href="#about" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">About</a>
            {effectiveTheme && (
              <a href="#theme" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Theme</a>
            )}
            <a href="#downloads" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Brochure &amp; Abstract</a>
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
            Registration Open • {currentConf.location}
          </span>
        </div>
      </nav>

      {/* ── CINEMATIC HERO SECTION ── */}
      <section className="relative overflow-hidden bg-navy-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Ambient Glowing Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={currentConf.image}
            alt={currentConf.title}
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
                <span className="text-white/90">{getConferenceTopic(currentConf)}</span>
              </div>

              {/* Conference Title */}
              <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight drop-shadow-md">
                {currentConf.title}
              </h1>

              {/* Theme highlight if present */}
              {effectiveTheme && (
                <p className="mt-5 text-base sm:text-lg text-amber-300/90 leading-relaxed max-w-2xl font-medium italic">
                  "{effectiveTheme}"
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
                    <div className="font-display text-sm font-bold text-white">{currentConf.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-md shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/20 text-amber-400 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Venue &amp; Location</div>
                    <div className="font-display text-sm font-bold text-white">{currentConf.location}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#register-section"
                  className="btn btn-gold text-sm font-extrabold px-7 py-3.5 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] flex items-center gap-2 rounded-full transform hover:scale-105 transition duration-300"
                >
                  <Ticket size={17} />
                  <span>Register as Delegate</span>
                </a>
                <button
                  type="button"
                  onClick={() => openDownloadModal('brochure')}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 transition shadow-lg"
                >
                  <Download size={16} />
                  <span>Brochure</span>
                </button>
                <button
                  type="button"
                  onClick={() => openDownloadModal('abstract')}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 transition shadow-lg"
                >
                  <FileText size={16} />
                  <span>Abstract</span>
                </button>
                {sessions.length > 0 && (
                  <a
                    href="#sessions"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/15 hover:border-amber-400 transition"
                  >
                    <Layers size={16} className="text-amber-400" />
                    <span>{sessions.length} Sessions</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column (5 cols): Cover Image Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900/90 to-navy-950/95 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-navy-950">
                  <img
                    src={currentConf.image}
                    alt={currentConf.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-navy-950/90 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-400/30 backdrop-blur-md">
                    {currentConf.category}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Registration Open
                    </span>
                    <span className="text-amber-300 font-mono text-[11px]">{currentConf.location}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXACT USER FLOW: ABOUT -> THEME -> MIDDLE IMAGES -> SESSIONS ── */}
      <div className="w-full max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-10 lg:space-y-12">

        {/* 1. ABOUT SECTION */}
        <section id="about" className="scroll-mt-28 w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 mb-2">
              <BookOpen size={15} /> Overview
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              About the Conference
            </h2>
            <div className="mt-3 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />

            <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed">
              {aboutParagraphs.length > 0 ? (
                aboutParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'text-slate-100 font-medium text-lg sm:text-xl leading-relaxed border-l-2 border-amber-400/80 pl-5 bg-gradient-to-r from-amber-400/[0.06] via-amber-400/[0.02] to-transparent py-3 rounded-r-2xl'
                        : 'text-slate-300/90 leading-relaxed'
                    }
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-slate-400 italic">No description provided yet.</p>
              )}
            </div>
          </div>
        </section>

        {/* 2. THEME SECTION */}
        {effectiveTheme && (
          <section id="theme" className="scroll-mt-28 w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 mb-2">
                <Sparkles size={15} /> Conference Theme
              </div>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                Official Congress Theme
              </h2>
              <div className="mt-3 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />

              <div className="mt-5 relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.08] via-slate-900/80 to-navy-950 p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(245,158,11,0.15)] backdrop-blur-md">
                <Quote className="absolute -top-2 -left-2 text-amber-400/15 pointer-events-none" size={60} />
                <p className="relative font-display text-base sm:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 leading-relaxed italic">
                  "{effectiveTheme}"
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. SIDE-BY-SIDE DOWNLOADS: BROCHURE & ABSTRACT ── */}
        <section id="downloads" className="scroll-mt-28 w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 mb-2">
              <Download size={15} /> Official Materials
            </div>
            <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Conference Brochure &amp; Abstract
            </h2>
            <div className="mt-3 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
            <p className="mt-3 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Access the official delegate documentation. Download the comprehensive conference brochure and abstract submission guidelines below.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* 1. BROCHURE CARD */}
            <div className="relative group overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-slate-900/90 via-navy-950/90 to-slate-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-amber-400/60 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider font-mono">
                    <BookOpen size={12} /> Official Agenda
                  </span>
                  <span className="text-[11px] text-white/50 font-mono">PDF Document</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  Conference Brochure
                </h3>
                <p className="mt-3 text-sm text-slate-300/90 leading-relaxed">
                  Download the complete multi-day schedule, keynote speaker line-up, technical session tracks, venue details, and delegate registration packages.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Full session tracks &amp; plenary timings
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Keynote speakers &amp; travel guidelines
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openDownloadModal('brochure')}
                  className="w-full btn btn-gold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition"
                >
                  <Download size={16} />
                  <span>Download Brochure</span>
                </button>
              </div>
            </div>

            {/* 2. ABSTRACT CARD */}
            <div className="relative group overflow-hidden rounded-2xl border border-blue-400/30 bg-gradient-to-br from-slate-900/90 via-navy-950/90 to-slate-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-blue-400/60 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/15 border border-blue-400/30 px-3 py-1 text-[11px] font-bold text-blue-300 uppercase tracking-wider font-mono">
                    <FileText size={12} /> Call for Papers
                  </span>
                  <span className="text-[11px] text-white/50 font-mono">PDF / DOCX</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  Conference Abstract
                </h3>
                <p className="mt-3 text-sm text-slate-300/90 leading-relaxed">
                  Download the official abstract formatting template, presentation submission guidelines (Oral, Poster, Virtual), review criteria, and deadlines.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Abstract submission rules &amp; word count
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Formatting template &amp; subject tracks
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openDownloadModal('abstract')}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 py-3.5 px-6 font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:brightness-110 transition"
                >
                  <Download size={16} />
                  <span>Download Abstract</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. MIDDLE IMAGES SECTION (CONFERENCE GALLERY) */}
        {middleImages.length > 0 && (
          <section id="gallery" className="scroll-mt-28 w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 mb-2">
                <Sparkles size={15} /> Highlights
              </div>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                Conference Gallery
              </h2>
              <div className="mt-3 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
            </div>

            <div className={`mt-6 grid gap-4 sm:gap-6 ${middleImages.length === 1
                ? 'grid-cols-1'
                : middleImages.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : middleImages.length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
              {middleImages.map((imgUrl, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedImage(imgUrl)}
                  className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-navy-950 cursor-pointer shadow-lg transition duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:-translate-y-1"
                >
                  <img
                    loading="lazy"
                    src={imgUrl}
                    alt={`${currentConf.title} moment ${i + 1}`}
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
        {sessions.length > 0 && (
          <section id="sessions" className="scroll-mt-28 w-full rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 mb-2">
                <Layers size={15} /> Curriculum
              </div>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                Sessions
              </h2>
              <div className="mt-3 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((sess, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-navy-950/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-amber-400/60 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-8px_rgba(245,158,11,0.25)] flex items-start gap-4"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/70 transition-all duration-500" />
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-500/10 border border-amber-400/40 text-sm font-black text-amber-300 font-mono shadow-[0_0_12px_rgba(251,191,36,0.2)] group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-navy-950 group-hover:border-amber-300 transition-all duration-300">
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug flex-1 pt-1">
                    {sess}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="text-amber-400/40 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 mt-1"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. DELEGATE REGISTRATION SECTION */}
        <section id="register-section" className="scroll-mt-28 w-full rounded-3xl border border-amber-400/40 bg-gradient-to-b from-slate-900 via-navy-950 to-slate-900 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center relative">
            {/* Left Column: Heading */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
                <Ticket size={15} /> Delegate Pass
              </div>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl xl:text-5xl tracking-tight leading-tight">
                Register for this Conference
              </h2>
              <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                Register your participation for <strong className="text-white">{currentConf.title}</strong>.
              </p>
            </div>

            {/* Right Column: Registration Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleRegister} className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 sm:p-8 space-y-4 shadow-xl">
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
                    className={`p-4 rounded-xl text-xs sm:text-sm font-medium ${status.kind === 'ok'
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
                  className="w-full sm:w-auto btn btn-gold text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Confirming Registration...' : 'Confirm Delegate Registration'}</span>
                </button>

                <p className="pt-2 text-xs text-slate-400 leading-relaxed">
                  By completing your registration, you agree to our{' '}
                  <a
                    href="/terms"
                    onClick={(e) => {
                      e.preventDefault()
                      if (onNavigate) onNavigate('/terms')
                    }}
                    className="text-amber-300 hover:underline font-medium"
                  >
                    Terms &amp; Conditions
                  </a>
                  ,{' '}
                  <a
                    href="/privacy"
                    onClick={(e) => {
                      e.preventDefault()
                      if (onNavigate) onNavigate('/privacy')
                    }}
                    className="text-amber-300 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                  , and{' '}
                  <a
                    href="/refund-policy"
                    onClick={(e) => {
                      e.preventDefault()
                      if (onNavigate) onNavigate('/refund-policy')
                    }}
                    className="text-amber-300 hover:underline font-medium"
                  >
                    Refund &amp; Cancellation Policy
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* ── EXPLORE OTHER PREMIER CONFERENCES SECTION ── */}
      {otherConferences.length > 0 && (
        <section className="bg-slate-950 border-t border-white/10 py-16 sm:py-20">
          <div className="w-full max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Next Congresses</p>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                      {getConferenceTopic(c)}
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

      {/* ── Download Lead Capture Modal (Brochure / Abstract) ── */}
      <AnimatePresence>
        {downloadModal?.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={closeDownloadModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900 via-navy-950 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

              {/* Close Button */}
              <button
                onClick={closeDownloadModal}
                className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {!downloadSuccess ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
                      {downloadModal.type === 'brochure' ? <Download size={22} /> : <FileText size={22} />}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                        Instant Access
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        {downloadModal.type === 'brochure' ? 'Download Brochure' : 'Download Abstract'}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Please provide your contact details to access the official {downloadModal.type === 'brochure' ? 'conference brochure, itinerary, and speaker line-up' : 'call for abstracts, formatting templates, and submission guidelines'} for{' '}
                    <span className="text-white font-semibold">{currentConf.title}</span>.
                  </p>

                  <form onSubmit={handleDownloadSubmit} className="mt-6 space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Full Name <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                          type="text"
                          required
                          value={downloadForm.name}
                          onChange={(e) => setDownloadForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Dr. Alex Morgan"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                          type="email"
                          required
                          value={downloadForm.email}
                          onChange={(e) => setDownloadForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. alex.morgan@university.edu"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Mobile Number <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                          type="tel"
                          required
                          value={downloadForm.phone}
                          onChange={(e) => setDownloadForm((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. +1 (555) 234-5678"
                          className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal pt-1">
                      By submitting, you agree to receive official conference communications. We respect your privacy.
                    </p>

                    <button
                      type="submit"
                      disabled={downloadSubmitting}
                      className="mt-2 w-full btn btn-gold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition disabled:opacity-50"
                    >
                      {downloadSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Preparing Document...</span>
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          <span>Download {downloadModal.type === 'brochure' ? 'Brochure' : 'Abstract'} Now</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-extrabold text-white">
                    Download Initiated!
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 max-w-sm mx-auto">
                    Thank you, <span className="text-white font-semibold">{downloadForm.name}</span>. Your {downloadModal.type === 'brochure' ? 'brochure' : 'abstract document'} is downloading.
                  </p>

                  {directDownloadUrl && (
                    <div className="mt-5">
                      <a
                        href={directDownloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                      >
                        <Download size={14} /> Click here if your download didn't start automatically
                      </a>
                    </div>
                  )}

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={closeDownloadModal}
                      className="rounded-xl border border-white/20 bg-white/10 px-8 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
