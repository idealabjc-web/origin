import { useState, useEffect } from 'react'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { getConferenceTopic, type UpcomingEvent } from '../data/content'
import { getUpcomingEvents, getCachedUpcomingEvents } from '../lib/supabase'
import Reveal from './Reveal'

export default function UpcomingEvents({
  onSelectEvent
}: {
  onSelectEvent?: (eventId: string) => void
}) {
  const [items, setItems] = useState<UpcomingEvent[]>(() => getCachedUpcomingEvents())

  useEffect(() => {
    function load() {
      getUpcomingEvents().then(setItems)
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  function handleEventClick(e: UpcomingEvent) {
    const targetId = e.id.replace(/^ev-/, '')
    if (onSelectEvent) {
      onSelectEvent(targetId)
    } else {
      window.history.pushState(null, '', `/conference/${targetId}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <section id="events" className="py-24 lg:py-28 bg-white">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Upcoming Events</p>
          <h2 className="h2">Save your place</h2>
          <p className="mt-3 text-sm text-charcoal/60">
            Explore upcoming global summits and view full agendas, speakers, and registration.
          </p>
        </Reveal>
        <ul className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {items.map((e) => (
            <li
              key={e.id}
              role="button"
              tabIndex={0}
              onClick={() => handleEventClick(e)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault()
                  handleEventClick(e)
                }
              }}
              className="group cursor-pointer flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between rounded-xl px-4 transition-all hover:bg-slate-50"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-navy-950 group-hover:text-gold-dark transition">
                  {e.name}
                </h3>
                <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-charcoal/70 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-gold-dark" />
                    {e.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gold-dark" />
                    {e.location}
                  </span>
                  <span className="text-gold-dark font-semibold">{getConferenceTopic(e)}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-gold-dark transition">
                  View Full Page
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-gold" />
                </span>
                <span className="btn btn-dark text-xs py-2 px-4 group-hover:bg-gold group-hover:text-navy-950 transition">
                  Explore Congress
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

