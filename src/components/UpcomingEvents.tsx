import { CalendarDays, MapPin } from 'lucide-react'
import { events, site } from '../data/content'
import Reveal from './Reveal'
export default function UpcomingEvents() {
  return (
    <section id="events" className="py-24 lg:py-28">
      <div className="container-x">
        <Reveal><p className="eyebrow">Upcoming Events</p><h2 className="h2">Save your place</h2><p className="mt-3 text-sm text-charcoal/60">Demo listings only. These are not confirmed events.</p></Reveal>
        <ul className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {events.map((e) => (
            <li key={e.id} className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold">{e.name}</h3>
                <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-charcoal/65">
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} />{e.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{e.location}</span>
                  <span className="text-gold">{e.category}</span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                <a href={e.href} className="text-sm font-semibold underline decoration-gold decoration-2 underline-offset-4">Learn More</a>
                <a href={site.ctaLinks.register} className="btn btn-dark">Register Now</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
