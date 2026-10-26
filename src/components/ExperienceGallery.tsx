import { useState, useEffect } from 'react'
import { Expand } from 'lucide-react'
import { gallery as initialGallery, type GalleryItem } from '../data/content'
import { getGallery } from '../lib/supabase'
import Modal from './Modal'
import Reveal from './Reveal'

export default function ExperienceGallery() {
  const [items, setItems] = useState<GalleryItem[]>(initialGallery)
  const [sel, setSel] = useState<number | null>(null)

  useEffect(() => {
    function load() {
      getGallery().then((data) => {
        if (data && data.length > 0) setItems(data)
      })
    }
    load()
    window.addEventListener('origin:data-updated', load)
    return () => window.removeEventListener('origin:data-updated', load)
  }, [])

  return (
    <section id="gallery" className="bg-slate-50 py-24 lg:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Conference Experience</p>
          <h2 className="h2">Moments from the room</h2>
          <p className="mt-3 text-sm text-charcoal/70">
            A glimpse into world-class keynotes, cross-border networking, and collaborative breakthroughs across ORIGIN summits.
          </p>
        </Reveal>
        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[230px]">
          {items.map((g, k) => (
            <button
              key={k}
              onClick={() => setSel(k)}
              aria-label={`Enlarge: ${g.alt}`}
              className={`group relative overflow-hidden rounded-2xl bg-navy-950 shadow-md ring-1 ring-navy-950/10 transition duration-300 hover:shadow-2xl hover:ring-gold/40 text-left ${g.span || ''}`}
            >
              <img
                loading="lazy"
                src={g.thumb || g.src}
                alt={g.alt}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              {/* Permanent soft vignette & hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Hover content */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-end justify-between gap-2">
                <p className="text-xs font-medium text-white/90 line-clamp-2 leading-snug drop-shadow-sm">{g.alt}</p>
                <span className="flex-shrink-0 grid h-8 w-8 place-items-center rounded-full bg-gold/90 text-navy-950 shadow-md backdrop-blur">
                  <Expand size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {sel !== null && items[sel] && (
        <Modal title="Gallery View" onClose={() => setSel(null)}>
          <div className="overflow-hidden rounded-xl bg-navy-950">
            <img
              src={items[sel].src}
              alt={items[sel].alt}
              className="max-h-[75vh] w-full object-contain mx-auto"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-medium text-white/90">{items[sel].alt}</p>
            <span className="text-xs text-gold/80 font-mono">
              {sel + 1} of {items.length}
            </span>
          </div>
        </Modal>
      )}
    </section>
  )
}
