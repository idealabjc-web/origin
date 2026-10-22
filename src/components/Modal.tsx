import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    btn.current?.focus()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus() }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button ref={btn} onClick={onClose} aria-label="Close" className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X /></button>
        {children}
      </div>
    </div>
  )
}
