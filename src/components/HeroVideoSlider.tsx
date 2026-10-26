import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, Film } from 'lucide-react'
import OriginAnimatedLogoIntro from '@/components/ui/OriginAnimatedLogoIntro'
import OrbitDeliveryHero from '@/components/ui/orbit-delivery-hero'

/* ── Conference stock videos (royalty-free from Pexels) ──────────── */
const slides = [
  {
    video: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4',
    heading: 'World-Class Conferences',
    sub: 'Connecting innovators, researchers and leaders across the globe.',
  },
  {
    video: 'https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_25fps.mp4',
    heading: 'Expert Speakers & Panels',
    sub: 'Hear from the brightest minds shaping the future of their industries.',
  },
  {
    video: 'https://videos.pexels.com/video-files/8353620/8353620-uhd_2560_1440_25fps.mp4',
    heading: 'Global Networking',
    sub: 'Build meaningful connections with professionals from 40+ countries.',
  },
  {
    video: 'https://videos.pexels.com/video-files/5765788/5765788-uhd_2560_1440_25fps.mp4',
    heading: 'Immersive Experiences',
    sub: 'Interactive workshops, exhibitions and live demonstrations.',
  },
]

const INTERVAL = 6000
const SESSION_PRELOADED_KEY = 'origin_has_preloaded_intro'

function checkHasPreloaded(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const navEntries = performance.getEntriesByType('navigation')
    if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload') {
      sessionStorage.removeItem(SESSION_PRELOADED_KEY)
      return false
    }
    return sessionStorage.getItem(SESSION_PRELOADED_KEY) === 'true'
  } catch {
    return false
  }
}

export default function HeroVideoSlider() {
  const [animDone, setAnimDone] = useState<boolean>(() => checkHasPreloaded())
  const [heroReady, setHeroReady] = useState<boolean>(() => checkHasPreloaded())
  const [heroMode, setHeroMode] = useState<'orbit' | 'video'>('orbit')
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, INTERVAL)
  }, [])

  useEffect(() => {
    if (!animDone || heroMode !== 'video') return
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [animDone, heroMode, resetTimer])

  const goTo = (i: number) => {
    setCurrent(i)
    resetTimer()
  }

  /* ── Interactive Hero Section: 3D Orbit Tour or Video Showcase ── */
  return (
    <>
      {!animDone && (
        <OriginAnimatedLogoIntro
          durationMs={5400}
          onFlightStart={() => {
            // Mount hero section as soon as flight begins so it crossfades smoothly
            setHeroReady(true)
          }}
          onComplete={() => {
            try {
              sessionStorage.setItem(SESSION_PRELOADED_KEY, 'true')
            } catch {}
            setAnimDone(true)
            setHeroReady(true)
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      <section
        id="home"
        className={`relative w-full overflow-hidden bg-[#0d1526] ${
          heroMode === 'orbit'
            ? 'h-auto min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-84px)] md:h-[calc(100vh-92px)] md:min-h-[720px]'
            : 'min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-84px)] md:h-[calc(100vh-92px)] md:min-h-[560px] bg-navy-950'
        }`}
      >
      {/* Mode Switcher floating toggle */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 pointer-events-auto">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-navy-900/90 border border-white/15 backdrop-blur-md shadow-xl text-xs">
          <button
            onClick={() => setHeroMode('orbit')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium transition ${
              heroMode === 'orbit' ? 'bg-gold text-navy-950 shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">3D Global Tour</span>
            <span className="sm:hidden text-[11px]">3D Tour</span>
          </button>
          <button
            onClick={() => setHeroMode('video')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium transition ${
              heroMode === 'video' ? 'bg-gold text-navy-950 shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Video Highlights</span>
            <span className="sm:hidden text-[11px]">Videos</span>
          </button>
        </div>
      </div>

      {heroMode === 'orbit' ? (
        (animDone || heroReady) ? <OrbitDeliveryHero theme="dark" /> : null
      ) : (
        <>
          {/* ── Video layers ─────────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <video
                src={slides[current].video}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* ── Gradient overlay ─────────────────────────────────────── */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/50 to-navy-950/90 pointer-events-none" />

          {/* ── Content ──────────────────────────────────────────────── */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 sm:px-5 py-20 sm:py-0">
            <motion.span
              key={`eye-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="eyebrow mb-4"
            >
              ORIGIN Conferences
            </motion.span>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`h-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl max-w-4xl"
              >
                {slides[current].heading}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`p-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-5 max-w-xl text-base text-white/80 sm:text-lg"
              >
                {slides[current].sub}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              <a href="#conferences" className="btn btn-gold">
                Explore Conferences
              </a>
              <a href="#contact" className="btn btn-ghost">
                Become a Speaker
              </a>
            </motion.div>
          </div>

          {/* ── Navigation dots ──────────────────────────────────────── */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-8 bg-gold'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <motion.div
            key={`bar-${current}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
            className="absolute bottom-0 left-0 z-20 h-1 w-full origin-left bg-gold/70"
          />
        </>
      )}

      {/* Bottom transition blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-navy-950/80 to-transparent z-10" />
    </section>
  </>
)
}
