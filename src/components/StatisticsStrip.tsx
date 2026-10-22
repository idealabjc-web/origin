import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { stats as initialStats } from '../data/content'
import { getStatistics } from '../lib/supabase'

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (x) => setV(Math.round(x)),
    })
    return () => c.stop()
  }, [inView, to])

  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>
}

export default function StatisticsStrip() {
  const [items, setItems] = useState<typeof initialStats>(initialStats)

  useEffect(() => {
    function load() {
      getStatistics().then(setItems)
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  return (
    <section id="stats" aria-label="Key figures" className="bg-navy-900 py-12">
      <dl className="container-x grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {items.map((s, k) => (
          <div key={s.label} className={`px-4 text-center ${k > 0 ? 'lg:border-l lg:border-white/15' : ''} ${k % 2 ? 'border-l border-white/15' : ''}`}>
            <dd className="font-display text-4xl font-semibold text-gold sm:text-5xl">
              <Counter to={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-2 text-sm text-white/70">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
