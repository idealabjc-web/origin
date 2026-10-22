import { site } from '../data/content'
import Reveal from './Reveal'
export default function SpeakerCTA() {
  return (
    <section id="speakers" className="relative overflow-hidden py-28 text-white">
      <img loading="lazy" src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1800&q=60" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/90 to-navy-700/80" />
      <div className="absolute -right-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-gold/20 blur-3xl" />
      <Reveal className="container-x relative max-w-3xl text-center">
        <h2 className="h2">Your Voice Can Shape the Future</h2>
        <p className="mt-5 text-lg text-white/80">Share your expertise, connect with global professionals, and contribute to meaningful conversations.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={site.ctaLinks.speaker} className="btn btn-gold">Become a Speaker</a>
          <a href={site.ctaLinks.community} className="btn btn-ghost">Join Our Community</a>
        </div>
      </Reveal>
    </section>
  )
}
