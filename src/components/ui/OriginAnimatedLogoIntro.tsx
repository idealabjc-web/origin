import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface OriginAnimatedLogoIntroProps {
  onComplete: () => void
  onFlightStart?: () => void
  durationMs?: number
}

interface Coords {
  x: number
  y: number
  w: number
  h: number
}

export default function OriginAnimatedLogoIntro({
  onComplete,
  onFlightStart,
  durationMs = 5000
}: OriginAnimatedLogoIntroProps) {
  const [stage, setStage] = useState<'playing' | 'flying' | 'done'>('playing')
  const [isFast, setIsFast] = useState(false)
  const [coords, setCoords] = useState<{ start: Coords; end: Coords } | null>(null)
  const stageRef = useRef(stage)
  stageRef.current = stage

  const triggerFlight = (fast = false) => {
    if (stageRef.current !== 'playing') return
    stageRef.current = 'flying'
    setIsFast(fast)

    // Notify parent immediately so hero section renders without an empty white void
    onFlightStart?.()

    // Measure header logo position in the live DOM
    const headerLogo = document.getElementById('header-origin-logo')
    const rect = headerLogo?.getBoundingClientRect()


    // Target position in header top-left
    let endX = 24
    let endY = 12
    let endW = 150
    let endH = 75

    if (rect && rect.width > 0 && rect.height > 0) {
      endX = rect.left
      endY = rect.top
      endW = rect.width
      endH = rect.height
    }

    const aspect = endW > 0 && endH > 0 ? endW / endH : 2.0
    // Calculate initial logo position in center of screen (matching video's logo placement across mobile portrait & desktop)
    const isMobile = window.innerWidth < 640
    const startW = isMobile
      ? Math.min(window.innerWidth * 0.78, 320)
      : Math.min(window.innerWidth * 0.48, 560)
    const startH = startW / aspect
    const startX = (window.innerWidth - startW) / 2
    const startY = (window.innerHeight - startH) * 0.46

    // Hide the static header logo during the flight transition to prevent duplication
    if (headerLogo) {
      headerLogo.style.opacity = '0'
    }

    setCoords({
      start: { x: startX, y: startY, w: startW, h: startH },
      end: { x: endX, y: endY, w: endW, h: endH }
    })
    setStage('flying')
  }

  useEffect(() => {
    // Unregister any rogue Service Worker from localhost that might intercept fetches
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const r of regs) r.unregister()
      }).catch(() => {})
    }

    // Set manual scroll restoration and lock body scrolling while intro plays
    if ('scrollRestoration' in history) {
      try {
        history.scrollRestoration = 'manual'
      } catch {}
    }
    const prevOverflow = document.body.style.overflow
    const prevPosition = document.body.style.position
    document.body.style.overflow = 'hidden'
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Silently pre-warm static model assets in browser HTTP cache so 3D scene loads instantly without running WebGL loop
    if (typeof window !== 'undefined' && 'fetch' in window) {
      setTimeout(() => {
        fetch('/models/whimsical-world.glb').catch(() => {})
        fetch('/models/courier.glb').catch(() => {})
      }, 800)
    }

    // Fallback timer if postMessage isn't received
    const timer = setTimeout(() => {
      triggerFlight(false)
    }, durationMs)

    function handleMessage(e: MessageEvent) {
      if (e.data && e.data.type === 'ORIGIN_ANIMATION_COMPLETE') {
        triggerFlight(false)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('message', handleMessage)
      document.body.style.overflow = prevOverflow
      document.body.style.position = prevPosition
      // Ensure header logo is always visible on cleanup
      const headerLogo = document.getElementById('header-origin-logo')
      if (headerLogo) {
        headerLogo.style.opacity = '1'
      }
    }
  }, [durationMs])

  function handleSkip() {
    triggerFlight(true)
  }

  function handleFlightComplete() {
    // Seamless handoff: reveal the real header logo at the exact same coordinates
    const headerLogo = document.getElementById('header-origin-logo')
    if (headerLogo) {
      headerLogo.style.opacity = '1'
    }
    document.body.style.overflow = ''
    document.body.style.position = ''
    setStage('done')
    onComplete()
  }

  if (stage === 'done') return null

  return (
    <AnimatePresence>
      {/* 1. Backdrop + Animation Iframe (fades out as flight starts, revealing the page) */}
      <motion.div
        key="intro-backdrop"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'flying' ? 0 : 1 }}
        transition={{ duration: isFast ? 0.3 : 0.45, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#060609] overflow-hidden pointer-events-none"
        style={{ backgroundColor: '#060609' }}
      >
        <iframe
          src="/videos/origin_logo_animation_5s.html"
          title="ORIGIN Global Conferences Animation"
          className="absolute inset-0 h-full w-full border-0 select-none pointer-events-none"
          style={{
            opacity: stage === 'flying' ? 0 : 1,
            transition: 'opacity 0.15s ease'
          }}
          allow="autoplay"
        />

        {/* Discreet Skip Action */}
        {stage === 'playing' && (
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000] flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-navy-950/90 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-amber-300 backdrop-blur-md transition hover:border-amber-400 hover:bg-amber-400/20 hover:text-white shadow-2xl cursor-pointer pointer-events-auto"
          >
            <span>Skip Intro</span>
            <ChevronRight size={14} />
          </button>
        )}
      </motion.div>

      {/* 2. Floating Flying Logo: GPU-composited transform from center to header with zero stopping */}
      {stage === 'flying' && coords && (
        <motion.img
          key="flying-logo"
          src="/origin-logo.png"
          alt="ORIGIN Global Conferences"
          className="fixed z-[10000] object-contain pointer-events-none select-none"
          style={{
            position: 'fixed',
            left: coords.end.x,
            top: coords.end.y,
            width: coords.end.w,
            height: coords.end.h,
            transformOrigin: 'top left',
            willChange: 'transform'
          }}
          initial={{
            x: coords.start.x - coords.end.x,
            y: coords.start.y - coords.end.y,
            scale: coords.start.w / coords.end.w,
            opacity: 1,
            filter: 'drop-shadow(0 0 30px rgba(255, 190, 0, 0.4))'
          }}
          animate={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25))'
          }}
          transition={{
            duration: isFast ? 0.45 : 0.75,
            ease: [0.25, 0.1, 0.25, 1] // Fluid continuous momentum across the entire flight path
          }}
          onAnimationComplete={handleFlightComplete}
        />
      )}
    </AnimatePresence>
  )
}
