import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroVideoSlider from './components/HeroVideoSlider'
import StatisticsStrip from './components/StatisticsStrip'
import AboutSection from './components/AboutSection'
import FeaturedConferences from './components/FeaturedConferences'
import TestimonialVideos from './components/TestimonialVideos'
import ServicesGrid from './components/ServicesGrid'
import ExperienceGallery from './components/ExperienceGallery'
import FeaturedSpeakers from './components/FeaturedSpeakers'
import SpeakerCTA from './components/SpeakerCTA'
import UpcomingEvents from './components/UpcomingEvents'
import NewsletterSection from './components/NewsletterSection'
import Footer from './components/Footer'
import OriginCMS from './components/cms/OriginCMS'
import ConferenceDetailsPage from './pages/ConferenceDetailsPage'
import AboutPage from './pages/AboutPage'
import ConferencesPage from './pages/ConferencesPage'
import SpeakersPage from './pages/SpeakersPage'
import ServicesPage from './pages/ServicesPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'
import { conferences as fallbackConferences, type Conference } from './data/content'
import { getConferences } from './lib/supabase'

type AppRoute =
  | { type: 'home'; path: '/' }
  | { type: 'about'; path: '/about' }
  | { type: 'conferences'; path: '/conferences' }
  | { type: 'conference-detail'; id: string; path: string }
  | { type: 'speakers'; path: '/speakers' }
  | { type: 'services'; path: '/services' }
  | { type: 'testimonials'; path: '/testimonials' }
  | { type: 'contact'; path: '/contact' }

function parseCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return { type: 'home', path: '/' }

  const pathname = window.location.pathname.toLowerCase()
  const hash = window.location.hash.toLowerCase()

  // 1. Single conference route: /conference/:id or #/conference/:id
  const confMatch = pathname.match(/\/conference\/([^/?#]+)/) || hash.match(/#\/?conference\/([^/?#]+)/)
  if (confMatch && confMatch[1]) {
    return { type: 'conference-detail', id: confMatch[1], path: `/conference/${confMatch[1]}` }
  }

  // Helper to match path or hash
  const matches = (p: string) =>
    pathname === p ||
    pathname.startsWith(`${p}/`) ||
    hash === `#${p}` ||
    hash === `#/${p.replace(/^\//, '')}`

  if (matches('/about')) return { type: 'about', path: '/about' }
  if (matches('/conferences')) return { type: 'conferences', path: '/conferences' }
  if (matches('/speakers')) return { type: 'speakers', path: '/speakers' }
  if (matches('/services')) return { type: 'services', path: '/services' }
  if (matches('/testimonials')) return { type: 'testimonials', path: '/testimonials' }
  if (matches('/contact')) return { type: 'contact', path: '/contact' }

  return { type: 'home', path: '/' }
}

export default function App() {
  const [cmsOpen, setCmsOpen] = useState(false)
  const [route, setRoute] = useState<AppRoute>(() => parseCurrentRoute())
  const [conferenceList, setConferenceList] = useState<Conference[]>(fallbackConferences)

  function checkAdminRoute() {
    const isSecretPath = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')
    const isSecretHash = window.location.hash === '#admin' || window.location.hash === '#cms'
    const isSecretParam = window.location.search.includes('admin')

    if (isSecretPath || isSecretHash || isSecretParam) {
      setCmsOpen(true)
    }
  }

  function handleCloseCMS() {
    setCmsOpen(false)
    if (window.location.pathname === '/admin' || window.location.hash === '#admin' || window.location.hash === '#cms') {
      window.history.replaceState(null, '', window.location.pathname.replace(/^\/admin/, '') || '/')
    }
  }

  function navigateTo(path: string) {
    window.history.pushState(null, '', path)
    setRoute(parseCurrentRoute())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToConference(id: string) {
    const cleanId = id.replace(/^ev-/, '')
    window.history.pushState(null, '', `/conference/${cleanId}`)
    setRoute({ type: 'conference-detail', id: cleanId, path: `/conference/${cleanId}` })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToHome() {
    window.history.pushState(null, '', '/')
    setRoute({ type: 'home', path: '/' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    function loadConferences() {
      getConferences().then((data) => {
        if (data && data.length > 0) {
          setConferenceList(data)
        }
      })
    }
    loadConferences()
    window.addEventListener('origin:data-updated', loadConferences)

    function handleLocationChange() {
      checkAdminRoute()
      setRoute(parseCurrentRoute())
    }

    handleLocationChange()
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    // Secret Admin Keyboard shortcut: Ctrl + Shift + C
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault()
        setCmsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('origin:data-updated', loadConferences)
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // If on a single conference page, find matched conference
  const selectedConference =
    route.type === 'conference-detail'
      ? conferenceList.find((c) => c.id.toLowerCase() === route.id.toLowerCase()) ||
        fallbackConferences.find((c) => c.id.toLowerCase() === route.id.toLowerCase()) ||
        fallbackConferences[0]
      : null

  return (
    <>
      {/* 1. Dedicated Single Conference Page */}
      {route.type === 'conference-detail' && selectedConference ? (
        <>
          <ConferenceDetailsPage
            conference={selectedConference}
            onBack={() => navigateTo('/conferences')}
            onHome={navigateToHome}
            onNavigateToConference={navigateToConference}
          />
          <Footer />
        </>
      ) : (
        /* 2. Top Header Navigation (Consistent across all pages) */
        <>
          <Header activeRoute={route.path} onNavigate={navigateTo} />

          {/* 3. Page Router */}
          {route.type === 'about' && (
            <AboutPage onNavigate={navigateTo} />
          )}

          {route.type === 'conferences' && (
            <ConferencesPage onSelectConference={navigateToConference} />
          )}

          {route.type === 'speakers' && (
            <SpeakersPage />
          )}

          {route.type === 'services' && (
            <ServicesPage onNavigate={navigateTo} />
          )}

          {route.type === 'testimonials' && (
            <TestimonialsPage />
          )}

          {route.type === 'contact' && (
            <ContactPage />
          )}

          {/* 4. Full Homepage (Default View) */}
          {route.type === 'home' && (
            <main className="pt-[84px] md:pt-[92px] bg-navy-950">
              <HeroVideoSlider />
              <StatisticsStrip />
              <AboutSection />
              <FeaturedConferences
                onSelectConference={(c) => navigateToConference(c.id)}
              />
              <TestimonialVideos />
              <ServicesGrid />
              <ExperienceGallery />
              <FeaturedSpeakers />
              <SpeakerCTA />
              <UpcomingEvents
                onSelectEvent={(eventId) => navigateToConference(eventId)}
              />
              <NewsletterSection />
            </main>
          )}

          <Footer />
        </>
      )}

      {/* Secret CMS Studio - Only opened via /admin, #admin, or Ctrl+Shift+C */}
      <OriginCMS isOpen={cmsOpen} onClose={handleCloseCMS} />
    </>
  )
}

