import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  ShieldCheck,
  RefreshCcw,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  CreditCard,
  Globe,
  Lock,
  Cookie,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

export type PolicySectionId = 'all' | 'terms' | 'privacy' | 'refund'

interface LegalPageProps {
  activeSection?: PolicySectionId
  onNavigate?: (path: string) => void
}

export default function LegalPage({
  activeSection = 'all',
  onNavigate
}: LegalPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSection])

  function handleTabChange(section: PolicySectionId) {
    const pathMap: Record<PolicySectionId, string> = {
      all: '/policies',
      terms: '/terms',
      privacy: '/privacy',
      refund: '/refund-policy'
    }
    const targetPath = pathMap[section]
    if (onNavigate) {
      onNavigate(targetPath)
    } else {
      window.history.pushState(null, '', targetPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function scrollToAnchor(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const showTerms = activeSection === 'all' || activeSection === 'terms'
  const showPrivacy = activeSection === 'all' || activeSection === 'privacy'
  const showRefund = activeSection === 'all' || activeSection === 'refund'

  const heroMeta: Record<
    PolicySectionId,
    { badge: string; title: string; subtitle: string }
  > = {
    all: {
      badge: 'Official Policies & Governance',
      title: 'Terms, Privacy & Refund Policies',
      subtitle:
        'Transparent registration terms, data protection standards, and refund guidelines for all ORIGIN Global Conferences participants.'
    },
    terms: {
      badge: 'Registration Agreement',
      title: 'Terms & Conditions',
      subtitle:
        'Thank you for registering with ORIGIN Conferences. By completing your registration, you agree to the terms below.'
    },
    privacy: {
      badge: 'Data Protection & Security',
      title: 'Privacy Policy',
      subtitle:
        'How ORIGIN Global Conferences collects, uses, and safeguards the personal information of visitors and registrants.'
    },
    refund: {
      badge: 'Cancellations & Credits',
      title: 'Refund and Cancellation Policy',
      subtitle:
        'Official guidelines governing registration cancellations, speaker refund tiers, event credits, and processing timelines.'
    }
  }

  const currentHero = heroMeta[activeSection]

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal pt-[72px] sm:pt-[84px] md:pt-[92px]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-navy-950 py-14 sm:py-20 text-white lg:py-24 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/35 via-navy-950/85 to-navy-950" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

        <div className="container-x relative">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold text-gold uppercase tracking-wider">
              <Scale size={14} /> {currentHero.badge}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {currentHero.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
              {currentHero.subtitle}
            </p>
          </motion.div>

          {/* Policy Section Switcher Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {[
              { id: 'all' as PolicySectionId, label: 'All Policies', icon: FileText },
              { id: 'terms' as PolicySectionId, label: 'Terms & Conditions', icon: Scale },
              { id: 'privacy' as PolicySectionId, label: 'Privacy Policy', icon: ShieldCheck },
              { id: 'refund' as PolicySectionId, label: 'Refund & Cancellation Policy', icon: RefreshCcw }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gold text-navy-950 shadow-lg shadow-gold/25 font-bold'
                      : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/90">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gold-dark">
                Policy Directory
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-navy-950">
                Legal Documents
              </h2>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeSection === 'all') {
                      scrollToAnchor('terms-section')
                    } else {
                      handleTabChange('terms')
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition ${
                    activeSection === 'terms'
                      ? 'bg-navy-950 text-gold shadow-sm'
                      : 'text-charcoal/80 hover:bg-slate-100 hover:text-navy-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Scale size={16} className="text-gold-dark flex-shrink-0" />
                    <span>1. Terms &amp; Conditions</span>
                  </span>
                  <ArrowRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeSection === 'all') {
                      scrollToAnchor('privacy-section')
                    } else {
                      handleTabChange('privacy')
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition ${
                    activeSection === 'privacy'
                      ? 'bg-navy-950 text-gold shadow-sm'
                      : 'text-charcoal/80 hover:bg-slate-100 hover:text-navy-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-gold-dark flex-shrink-0" />
                    <span>2. Privacy Policy</span>
                  </span>
                  <ArrowRight size={14} className="opacity-50" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeSection === 'all') {
                      scrollToAnchor('refund-section')
                    } else {
                      handleTabChange('refund')
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition ${
                    activeSection === 'refund'
                      ? 'bg-navy-950 text-gold shadow-sm'
                      : 'text-charcoal/80 hover:bg-slate-100 hover:text-navy-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <RefreshCcw size={16} className="text-gold-dark flex-shrink-0" />
                    <span>3. Refund &amp; Cancellation</span>
                  </span>
                  <ArrowRight size={14} className="opacity-50" />
                </button>
              </div>

              {activeSection !== 'all' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleTabChange('all')}
                    className="w-full rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-navy-950 hover:bg-gold/20 transition text-center"
                  >
                    View All 3 Policies Together
                  </button>
                </div>
              )}
            </div>

            {/* Direct Support Card */}
            <div className="rounded-3xl bg-navy-950 p-6 text-white shadow-xl border border-white/10">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
                <Mail size={18} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">
                Questions or Clarifications?
              </h3>
              <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                Our finance and registration secretariat is ready to help with payment approvals, group offers, substitutions, or policy questions.
              </p>
              <a
                href="mailto:contact@originconferences.com"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline break-all"
              >
                <Mail size={14} />
                contact@originconferences.com
              </a>
            </div>
          </aside>

          {/* Right Document Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-12">
            {/* =========================================================
                SECTION 1: TERMS & CONDITIONS
               ========================================================= */}
            {showTerms && (
              <motion.article
                id="terms-section"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="scroll-mt-28 rounded-3xl bg-white p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/90"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-900">
                      <Scale size={13} className="text-gold-dark" /> Section 01
                    </span>
                    <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-950">
                      Terms &amp; Conditions
                    </h2>
                  </div>
                  <span className="rounded-xl bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 text-xs font-semibold text-amber-900">
                    Applies to All Attendee Categories
                  </span>
                </div>

                {/* Intro Notice */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 sm:p-6 border border-slate-200/80">
                  <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed">
                    Thank you for registering with <strong className="text-navy-950">ORIGIN Conferences</strong>. By completing your registration, you agree to the terms below, which apply to every attendee category, including{' '}
                    <span className="font-semibold text-navy-950">
                      Speakers, Delegates, Sponsors, Exhibitors, Poster Presenters, Accompanying Persons, and all others
                    </span>
                    .
                  </p>
                </div>

                {/* Clauses */}
                <div className="mt-8 space-y-6">
                  {/* 1. Currency Exchange */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        1
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          1. Currency Exchange
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          ORIGIN Conferences accepts no liability for gains or losses arising from fluctuations in currency exchange rates. All fees are calculated at the rate prevailing on the date your registration is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Payment and Attendance */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        2
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          2. Payment and Attendance
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          Entry to the conference requires valid proof of payment. All outstanding balances must be settled at least <strong className="text-navy-950">30 days before the event begins</strong>. Registrations that remain unpaid after this deadline may be declined at the venue.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Registration Methods */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        3
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>3. Registration Methods</span>
                          <CreditCard size={16} className="text-gold-dark hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          You may register through our website or through our team by phone or email. Please be aware that certain countries require bank approval before international card payments can go through. If your online payment is declined, we suggest contacting your bank first to enable international transactions on your card. If the problem continues, write to our finance team at{' '}
                          <a
                            href="mailto:contact@originconferences.com"
                            className="font-semibold text-navy-950 underline decoration-gold hover:text-gold-dark"
                          >
                            contact@originconferences.com
                          </a>{' '}
                          and we will help you complete the process.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Group Registration Offers */}
                  <div className="rounded-2xl border border-amber-300/70 bg-amber-50/40 p-5 sm:p-6 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        4
                      </span>
                      <div className="w-full">
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>4. Group Registration Offers</span>
                          <Users size={16} className="text-gold-dark hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          Groups of five or more registering together qualify for a reduced rate, with savings of <strong className="text-navy-950">up to 25% on each individual registration fee</strong>. As an alternative, when <strong className="text-navy-950">four full-price registrations</strong> are made together, <strong className="text-navy-950">one additional registration will be provided free of charge</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Substitution of Participants */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        5
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          5. Substitution of Participants
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          If a registered participant cannot attend for any reason, a substitute may take their place, provided the conference manager grants written approval beforehand. The substitute must carry a copy of the approval email and present it at the registration desk on arrival. Please note that substitution is available <strong className="text-navy-950">only to Speakers and Delegates</strong>. It does not apply to Sponsors, Exhibitors, or Memberships.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6. Promotional Materials */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        6
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          6. Promotional Materials
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          Speakers and Delegates must obtain the conference manager&apos;s permission before distributing brochures, flyers, books, business materials, or any other printed items within the venue. This restriction does not apply to Sponsors, Exhibitors, or Members.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 7. Questions */}
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 sm:p-6">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        7
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>7. Questions</span>
                          <HelpCircle size={16} className="text-gold-dark hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          For any clarification about these terms, please contact us at{' '}
                          <a
                            href="mailto:contact@originconferences.com"
                            className="font-semibold text-navy-950 underline decoration-gold hover:text-gold-dark"
                          >
                            contact@originconferences.com
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* =========================================================
                SECTION 2: PRIVACY POLICY
               ========================================================= */}
            {showPrivacy && (
              <motion.article
                id="privacy-section"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="scroll-mt-28 rounded-3xl bg-white p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/90"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-900">
                      <ShieldCheck size={13} className="text-gold-dark" /> Section 02
                    </span>
                    <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-950">
                      Privacy Policy
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-emerald-900">
                    <Clock size={13} /> Effective as of November 1, 2026
                  </span>
                </div>

                {/* Intro Notice */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 sm:p-6 border border-slate-200/80">
                  <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed">
                    <strong className="text-navy-950">ORIGIN Global Conferences</strong> operates{' '}
                    <a
                      href="https://www.originconferences.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-navy-950 underline decoration-gold hover:text-gold-dark"
                    >
                      https://www.originconferences.com/
                    </a>{' '}
                    (the &ldquo;Site&rdquo;). This policy explains how we collect, use, and disclose the personal information we receive from visitors and registrants who use our Site. By using the Site, you agree to the collection and use of information as described here.
                  </p>
                </div>

                {/* Clauses */}
                <div className="mt-8 space-y-6">
                  {/* 1. Information We Collect */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        1
                      </span>
                      <div className="space-y-3">
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          1. Information We Collect
                        </h3>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                          <p className="text-sm text-charcoal/80 leading-relaxed">
                            <em className="font-semibold text-navy-950 not-italic">Personal information.</em>{' '}
                            When you use our Site, we may ask you to provide certain details that can be used to identify or contact you. This may include your name, email address, phone number, organization, and any other information needed to process your registration or enquiry.
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                          <p className="text-sm text-charcoal/80 leading-relaxed">
                            <em className="font-semibold text-navy-950 not-italic">Log data.</em>{' '}
                            Like most websites, we automatically receive information that your browser sends each time you visit. This may include your device&apos;s Internet Protocol (IP) address, browser type and version, the pages you view, the date and time of your visit, the time spent on each page, and other diagnostic data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. How We Use Your Information */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        2
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          2. How We Use Your Information
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          We use the information we collect to operate and improve the Site, process registrations and payments, respond to your questions, and keep you informed about our events. With your details, we may also send you emails, newsletters, and promotional materials about upcoming conferences. You can opt out of these messages at any time by using the unsubscribe link in the email or by contacting us.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Third-Party Services */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        3
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>3. Third-Party Services</span>
                          <Globe size={16} className="text-gold-dark hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          We may engage third-party service providers, such as Google Analytics, to collect, monitor, and analyze usage data so that we can better understand how visitors use the Site. These providers have their own privacy policies governing how they handle your data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Cookies */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        4
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>4. Cookies</span>
                          <Cookie size={16} className="text-gold-dark hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          Cookies are small files that may contain an anonymous unique identifier. They are sent from our Site to your browser and stored on your device. You can set your browser to refuse all cookies or to alert you when a cookie is being sent. Please note that if you decline cookies, some parts of the Site may not work as intended.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Data Security */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        5
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>5. Data Security</span>
                          <Lock size={16} className="text-gold-dark hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          We value the security of your personal information and take commercially reasonable steps to protect it. However, no method of transmission over the Internet or method of electronic storage is completely secure, so we cannot guarantee absolute security.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6. Changes to This Policy */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        6
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          6. Changes to This Policy
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          This policy is effective as of <strong className="text-navy-950">November 1, 2026</strong>. We reserve the right to update or modify it at any time. Any changes will take effect once they are posted on this page, so we encourage you to review it periodically. Your continued use of the Site after changes are posted means you accept the revised policy.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 7. Contact Us */}
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 sm:p-6">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        7
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          7. Contact Us
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          If you have any questions about this Privacy Policy, please contact us at{' '}
                          <a
                            href="mailto:contact@originconferences.com"
                            className="font-semibold text-navy-950 underline decoration-gold hover:text-gold-dark"
                          >
                            contact@originconferences.com
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* =========================================================
                SECTION 3: REFUND AND CANCELLATION POLICY
               ========================================================= */}
            {showRefund && (
              <motion.article
                id="refund-section"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="scroll-mt-28 rounded-3xl bg-white p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/90"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-900">
                      <RefreshCcw size={13} className="text-gold-dark" /> Section 03
                    </span>
                    <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-950">
                      Refund and Cancellation Policy
                    </h2>
                  </div>
                  <span className="rounded-xl bg-navy-950 px-3.5 py-1.5 text-xs font-semibold text-gold">
                    ORIGIN Global Conferences
                  </span>
                </div>

                {/* Intro Notice */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 sm:p-6 border border-slate-200/80">
                  <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed">
                    Thank you for registering with <strong className="text-navy-950">ORIGIN Global Conferences</strong>. Please read the policy below, which applies to all cancellation and refund requests.
                  </p>
                </div>

                {/* Clauses */}
                <div className="mt-8 space-y-6">
                  {/* 1. Cancellation by Participant */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        1
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          1. Cancellation by Participant
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          To cancel your registration, send a written request to{' '}
                          <a
                            href="mailto:contact@originconferences.com"
                            className="font-semibold text-navy-950 underline decoration-gold hover:text-gold-dark"
                          >
                            contact@originconferences.com
                          </a>{' '}
                          stating your name, registration ID, and the conference you registered for. Your cancellation date will be counted from the day we receive your email.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Refund Policy for Speakers */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        2
                      </span>
                      <div className="w-full">
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          2. Refund Policy for Speakers
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          Refund eligibility depends on how many days before the conference the cancellation request is received.
                        </p>

                        {/* Visual Refund Tier Cards */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4">
                            <span className="inline-block rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                              75% Refund
                            </span>
                            <p className="mt-2 font-display text-sm font-bold text-navy-950">
                              Cancellation 90 Days or More Before the Conference:
                            </p>
                            <p className="mt-1 text-xs text-charcoal/80">
                              Eligible for a refund of 75% of the registration fee.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4">
                            <span className="inline-block rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-navy-950">
                              50% Refund
                            </span>
                            <p className="mt-2 font-display text-sm font-bold text-navy-950">
                              Cancellation 60 to 89 Days Before the Conference:
                            </p>
                            <p className="mt-1 text-xs text-charcoal/80">
                              Eligible for a refund of 50% of the registration fee.
                            </p>
                          </div>

                          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-4">
                            <span className="inline-block rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                              No Refund
                            </span>
                            <p className="mt-2 font-display text-sm font-bold text-navy-950">
                              Cancellation Fewer Than 60 Days Before the Conference:
                            </p>
                            <p className="mt-1 text-xs text-charcoal/80">
                              No refund will be provided.
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 text-xs sm:text-sm text-charcoal/75 italic">
                          All refunds are subject to the terms and conditions outlined in this Refund and Cancellation Policy.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Transfer to a Future Event */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        3
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          3. Transfer to a Future Event
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          If you can no longer attend, you may request that your registration fee be carried over as credit toward a future ORIGIN Global Conferences event. The credit is non-transferable to another person unless a substitution is approved under our Terms and Conditions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Cancellation Due to Natural Disasters or Unforeseen Events */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        4
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950 flex items-center gap-2">
                          <span>4. Cancellation Due to Natural Disasters or Unforeseen Events</span>
                          <AlertCircle size={16} className="text-amber-600 hidden sm:inline" />
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          If a conference is cancelled or postponed because of natural calamities, severe weather, government restrictions, or other circumstances beyond our control, cash refunds will not be issued. Instead, the full registration fee will be held as credit toward a future ORIGIN Global Conferences event of your choice. We appreciate your understanding in such situations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Refund Processing */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        5
                      </span>
                      <div className="w-full">
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          5. Refund Processing
                        </h3>
                        <ul className="mt-3 space-y-2.5 text-sm text-charcoal/80">
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Approved refunds will be processed within <strong className="text-navy-950">14 working days</strong> after the conference concludes.
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Refunds are issued only to the original payment source used at the time of registration.
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Bank charges, transaction fees, and currency conversion differences are non-refundable and will be deducted from the refund amount.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 6. Non-Refundable Categories */}
                  <div className="rounded-2xl border border-slate-200/70 p-5 sm:p-6 hover:border-gold/50 transition">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        6
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          6. Non-Refundable Categories
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          Sponsorship, exhibitor, and membership fees are non-refundable once payment is made, but may be credited toward a future event at the organizers&apos; discretion.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 7. Contact Us */}
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 sm:p-6">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-navy-950 text-xs font-bold text-gold">
                        7
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-950">
                          7. Contact Us
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                          For any questions about this policy, please email us at{' '}
                          <a
                            href="mailto:contact@originconferences.com"
                            className="font-semibold text-navy-950 underline decoration-gold hover:text-gold-dark"
                          >
                            contact@originconferences.com
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

