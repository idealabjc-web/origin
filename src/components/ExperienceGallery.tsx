import { useState } from 'react'
import { Expand } from 'lucide-react'
import { gallery } from '../data/content'
import Modal from './Modal'
import Reveal from './Reveal'
export default function ExperienceGallery() {
  const [sel, setSel] = useState<number | null>(null)
  return (
    <section id="gallery" className="bg-slate-50 py-24 lg:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl"><p className="eyebrow">Conference Experience</p><h2 className="h2">Moments from the room</h2></Reveal>
        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {gallery.map((g, k) => (
            <button key={k} onClick={() => setSel(k)} aria-label={`Enlarge: ${g.alt}`} className={`group relative overflow-hidden rounded-xl ${g.span}`}>
              <img loading="lazy" src={g.thumb} alt={g.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-navy-950/0 text-white opacity-0 transition group-hover:bg-navy-950/50 group-hover:opacity-100"><Expand /></span>
            </button>
          ))}
        </div>
      </div>
      {sel !== null && (
        <Modal title="Gallery image" onClose={() => setSel(null)}>
          <img src={gallery[sel].src} alt={gallery[sel].alt} className="max-h-[80vh] w-full rounded-xl object-contain" />
          <p className="mt-3 text-center text-sm text-white/70">{gallery[sel].alt}</p>
        </Modal>
      )}
    </section>
  )
}
