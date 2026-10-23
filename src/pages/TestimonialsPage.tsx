import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Quote, Star, MessageSquareQuote } from 'lucide-react'
import { testimonials as fallbackTestimonials, type Testimonial } from '../data/content'
import Modal from '../components/Modal'

export default function TestimonialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<Testimonial | null>(null)

  const delegateQuotes = [
    {
      name: 'Prof. David Henderson',
      role: 'Chair of Clinical Oncology, Edinburgh',
      event: 'Global Nursing Science Congress',
      text: 'The academic quality of the oral presentations and the precision of the session scheduling exceeded any European congress I have chaired in the past decade.'
    },
    {
      name: 'Dr. Camille Laurent',
      role: 'Senior Dental Surgeon & Implantologist, Lyon',
      event: 'World Euro Dental Congress',
      text: 'Hands-on clinical workstations equipped with the latest CAD/CAM scanners gave our clinical fellows real-time practical proficiency.'
    },
    {
      name: 'Sophia Lindqvist',
      role: 'Partner, Nordic Health Ventures',
      event: 'Global Business & Entrepreneurial Leadership',
      text: 'ORIGIN summits combine academic rigor with genuine venture capital deal-making. We initiated two syndicated term sheets right at the networking reception.'
    },
    {
      name: 'Dr. Rajesh Patel',
      role: 'Dean of Health Sciences, London',
      event: 'Global Nursing Science Congress',
      text: 'The CME/CPD accreditation tracking and prompt certification delivery made this conference seamless for our entire hospital contingent.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal pt-[84px] md:pt-[92px]">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950/80 to-navy-950" />
        <div className="container-x relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold text-gold uppercase tracking-wider">
              <MessageSquareQuote size={14} /> Delegate Feedback
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Voices of Global Delegates
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Hear directly from keynote professors, healthcare executives, and industry leaders who attend ORIGIN Conferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Highlights */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Video Testimonials</p>
            <h2 className="h2 mt-1">Watch Delegate Reflections</h2>
            <p className="mt-3 text-sm text-charcoal/60">
              Recorded on-site at our flagship summits in London, Geneva, and Paris.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {fallbackTestimonials.map((t) => (
              <motion.article
                key={t.id}
                whileHover={{ y: -6 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-2xl hover:border-gold/50"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-navy-900">
                    <img
                      src={t.thumbnail}
                      alt={t.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-navy-950/40 transition group-hover:bg-navy-950/20" />
                    <button
                      onClick={() => setSelectedVideo(t)}
                      aria-label={`Play testimonial from ${t.name}`}
                      className="absolute inset-0 grid place-items-center"
                    >
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-navy-950 shadow-2xl transition duration-300 group-hover:scale-110">
                        <Play size={22} className="ml-1 fill-navy-950" />
                      </span>
                    </button>
                    <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      {t.event}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1 text-gold mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-gold" />
                      ))}
                    </div>
                    <p className="text-xs italic text-charcoal/80 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <h3 className="font-display text-sm font-bold text-navy-950">{t.name}</h3>
                      <p className="text-xs text-charcoal/60">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Written Endorsements Grid */}
      <section className="bg-white py-20 lg:py-28 border-t border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Institutional Reviews</p>
            <h2 className="h2 mt-2">Endorsed by Academic Faculty</h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {delegateQuotes.map((q, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl bg-slate-50 p-8 border border-slate-200 shadow-sm"
              >
                <Quote className="text-gold/40 h-8 w-8 mb-4" />
                <p className="text-sm leading-relaxed text-charcoal/85">
                  "{q.text}"
                </p>
                <div className="mt-6 border-t border-slate-200/80 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy-950">{q.name}</h4>
                    <p className="text-xs text-charcoal/60">{q.role}</p>
                  </div>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-navy-950">
                    {q.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {selectedVideo && (
        <Modal title={`Testimonial: ${selectedVideo.name}`} onClose={() => setSelectedVideo(null)}>
          <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">
            <div className="relative aspect-video w-full">
              <video
                src={selectedVideo.video}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-6 bg-navy-950 text-white">
              <h3 className="font-display text-lg font-bold">{selectedVideo.name}</h3>
              <p className="text-xs text-white/70">{selectedVideo.role} • {selectedVideo.event}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
