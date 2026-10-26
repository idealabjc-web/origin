import { useState, useEffect, useRef } from 'react'
import {
  X, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, RefreshCw,
  Layers, Calendar, MessageSquareQuote, BarChart3, Mail, Users, FileText,
  Download, Eye, ShieldCheck, Mic, Image as ImageIcon, UploadCloud
} from 'lucide-react'
import {
  getConferences, upsertConference, deleteConference,
  getUpcomingEvents, upsertUpcomingEvent, deleteUpcomingEvent,
  getTestimonials, upsertTestimonial, deleteTestimonial,
  getStatistics, updateStatistic,
  getSpeakers, upsertSpeaker, deleteSpeaker,
  getGallery, upsertGalleryItem, deleteGalleryItem,
  getNewsletterSubscribers, getEventRegistrations, getContactInquiries,
  isSupabaseConfigured
} from '../../lib/supabase'
import {
  categories,
  type Category,
  type Conference,
  type UpcomingEvent,
  type Testimonial,
  type Speaker,
  type GalleryItem
} from '../../data/content'

type Tab =
  | 'conferences'
  | 'events'
  | 'speakers'
  | 'gallery'
  | 'testimonials'
  | 'stats'
  | 'subscribers'
  | 'registrations'
  | 'inquiries'

function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 1920
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(mime, 0.85)
        resolve(dataUrl)
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function parseSessionsList(val: string[] | string | undefined | null): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return val.split(/[,;\n•]+/).map((s) => s.trim()).filter(Boolean)
}

export default function OriginCMS({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('conferences')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  // Passcode authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('origin_cms_auth') === 'true'
  })
  const [passcode, setPasscode] = useState('')
  const [authError, setAuthError] = useState(false)

  // Data states
  const [conferences, setConferences] = useState<Conference[]>([])
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])

  // Modal edit states
  const [editingConference, setEditingConference] = useState<Partial<Conference> | null>(null)
  const [editingEvent, setEditingEvent] = useState<Partial<UpcomingEvent> | null>(null)
  const [editingSpeaker, setEditingSpeaker] = useState<Partial<Speaker> | null>(null)
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> & { id?: string } | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null)

  // Drag & drop image upload state
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [imageProcessing, setImageProcessing] = useState(false)
  const confFileInputRef = useRef<HTMLInputElement>(null)
  const middleImagesInputRef = useRef<HTMLInputElement>(null)

  // One-by-one session state
  const [newSessionInput, setNewSessionInput] = useState('')

  function handleAddSession() {
    if (!newSessionInput.trim() || !editingConference) return
    const currentSessions = parseSessionsList(editingConference.sessions)
    const updated = [...currentSessions, newSessionInput.trim()]
    setEditingConference({ ...editingConference, sessions: updated.join(', ') })
    setNewSessionInput('')
  }

  function handleRemoveSession(indexToRemove: number) {
    if (!editingConference) return
    const currentSessions = parseSessionsList(editingConference.sessions)
    const updated = currentSessions.filter((_, i) => i !== indexToRemove)
    setEditingConference({ ...editingConference, sessions: updated.join(', ') })
  }

  async function handleAddMiddleImage(file: File) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error')
      return
    }
    try {
      setImageProcessing(true)
      const processedUrl = await processImageFile(file)
      if (editingConference) {
        const currentImgs = Array.isArray(editingConference.images) ? editingConference.images : []
        setEditingConference({ ...editingConference, images: [...currentImgs, processedUrl] })
      }
      showToast('Middle image added!')
    } catch {
      showToast('Failed to process image', 'error')
    } finally {
      setImageProcessing(false)
    }
  }

  function handleRemoveMiddleImage(indexToRemove: number) {
    if (!editingConference) return
    const currentImgs = Array.isArray(editingConference.images) ? editingConference.images : []
    const updated = currentImgs.filter((_, i) => i !== indexToRemove)
    setEditingConference({ ...editingConference, images: updated })
  }

  async function handleDropConferenceImage(file: File) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, GIF)', 'error')
      return
    }
    try {
      setImageProcessing(true)
      const processedUrl = await processImageFile(file)
      if (editingConference) {
        setEditingConference({ ...editingConference, image: processedUrl })
      }
      showToast('Cover image updated successfully!')
    } catch (err: any) {
      showToast('Failed to process image: ' + err.message, 'error')
    } finally {
      setImageProcessing(false)
    }
  }

  function showToast(text: string, type: 'ok' | 'error' = 'ok') {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (passcode.trim() === 'origin2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true)
      localStorage.setItem('origin_cms_auth', 'true')
      setAuthError(false)
      loadData()
    } else {
      setAuthError(true)
    }
  }

  async function loadData() {
    setLoading(true)
    try {
      const [c, ev, sp, gal, t, st, sub, reg, inq] = await Promise.all([
        getConferences(),
        getUpcomingEvents(),
        getSpeakers(),
        getGallery(),
        getTestimonials(),
        getStatistics(),
        getNewsletterSubscribers(),
        getEventRegistrations(),
        getContactInquiries()
      ])
      setConferences(c)
      setEvents(ev)
      setSpeakers(sp)
      setGalleryItems(gal)
      setTestimonials(t)
      setStats(st)
      setSubscribers(sub)
      setRegistrations(reg)
      setInquiries(inq)
    } catch (err: any) {
      showToast('Notice: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData()
    }
  }, [isOpen, isAuthenticated])

  // =====================================
  // CONFERENCES CRUD
  // =====================================
  async function handleSaveConference(e: React.FormEvent) {
    e.preventDefault()
    if (!editingConference?.title) return
    setLoading(true)
    const confId = editingConference.id || 'c_' + Date.now().toString(36)
    const res = await upsertConference({
      id: confId,
      title: editingConference.title,
      category: (editingConference.category as Category) || 'Technology & Innovation',
      date: editingConference.date || 'Date to be announced',
      location: editingConference.location || 'Virtual / Hybrid',
      theme: editingConference.theme || '',
      sessions: editingConference.sessions || '',
      description: editingConference.description || '',
      image: editingConference.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70',
      images: editingConference.images || [],
      href: editingConference.href || '#'
    })
    setLoading(false)
    if (res.success) {
      showToast('Conference published live to Supabase!')
      setEditingConference(null)
      loadData()
    } else {
      showToast('Error saving: ' + res.error, 'error')
    }
  }

  async function handleDeleteConference(id: string) {
    if (!confirm('Are you sure you want to delete this conference? It will be removed immediately from live.')) return
    setLoading(true)
    const res = await deleteConference(id)
    setLoading(false)
    if (res.success) {
      showToast('Conference removed from live!')
      loadData()
    } else {
      showToast('Error deleting: ' + res.error, 'error')
    }
  }

  // =====================================
  // EVENTS CRUD
  // =====================================
  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!editingEvent?.name) return
    setLoading(true)
    const eventId = editingEvent.id || 'e_' + Date.now().toString(36)
    const res = await upsertUpcomingEvent({
      id: eventId,
      name: editingEvent.name,
      category: (editingEvent.category as Category) || 'Technology & Innovation',
      date: editingEvent.date || 'TBA',
      location: editingEvent.location || 'To be announced',
      href: editingEvent.href || '#'
    })
    setLoading(false)
    if (res.success) {
      showToast('Event published live to Supabase!')
      setEditingEvent(null)
      loadData()
    } else {
      showToast('Error saving: ' + res.error, 'error')
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Delete this event? It will be removed from live.')) return
    setLoading(true)
    const res = await deleteUpcomingEvent(id)
    setLoading(false)
    if (res.success) {
      showToast('Event removed from live!')
      loadData()
    } else {
      showToast('Error deleting: ' + res.error, 'error')
    }
  }

  // =====================================
  // SPEAKERS CRUD
  // =====================================
  async function handleSaveSpeaker(e: React.FormEvent) {
    e.preventDefault()
    if (!editingSpeaker?.name) return
    setLoading(true)
    const spId = editingSpeaker.id || 'sp_' + Date.now().toString(36)
    const res = await upsertSpeaker({
      id: spId,
      name: editingSpeaker.name,
      role: editingSpeaker.role || 'Keynote Speaker',
      organization: editingSpeaker.organization || '',
      topic: editingSpeaker.topic || '',
      bio: editingSpeaker.bio || '',
      image: editingSpeaker.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=70',
      linkedin: editingSpeaker.linkedin || '#'
    })
    setLoading(false)
    if (res.success) {
      showToast('Speaker published live to Supabase!')
      setEditingSpeaker(null)
      loadData()
    } else {
      showToast('Error saving speaker: ' + res.error, 'error')
    }
  }

  async function handleDeleteSpeaker(id: string) {
    if (!confirm('Are you sure you want to remove this speaker from live?')) return
    setLoading(true)
    const res = await deleteSpeaker(id)
    setLoading(false)
    if (res.success) {
      showToast('Speaker removed from live!')
      loadData()
    } else {
      showToast('Error deleting speaker: ' + res.error, 'error')
    }
  }

  // =====================================
  // GALLERY CRUD
  // =====================================
  async function handleSaveGallery(e: React.FormEvent) {
    e.preventDefault()
    if (!editingGallery?.src) return
    setLoading(true)
    const gid = editingGallery.id || 'g_' + Date.now().toString(36)
    const res = await upsertGalleryItem({
      id: gid,
      src: editingGallery.src,
      thumb: editingGallery.thumb || editingGallery.src,
      alt: editingGallery.alt || 'Conference moment',
      span: editingGallery.span || ''
    })
    setLoading(false)
    if (res.success) {
      showToast('Gallery image saved directly to Supabase!')
      setEditingGallery(null)
      loadData()
    } else {
      showToast('Error saving gallery item: ' + res.error, 'error')
    }
  }

  async function handleDeleteGallery(srcOrId: string) {
    if (!confirm('Delete this gallery photo?')) return
    setLoading(true)
    const res = await deleteGalleryItem(srcOrId)
    setLoading(false)
    if (res.success) {
      showToast('Gallery photo deleted!')
      loadData()
    } else {
      showToast('Error deleting photo: ' + res.error, 'error')
    }
  }

  // =====================================
  // TESTIMONIALS CRUD
  // =====================================
  async function handleSaveTestimonial(e: React.FormEvent) {
    e.preventDefault()
    if (!editingTestimonial?.name) return
    setLoading(true)
    const tid = editingTestimonial.id || 't_' + Date.now().toString(36)
    const res = await upsertTestimonial({
      id: tid,
      name: editingTestimonial.name,
      role: editingTestimonial.role || 'Keynote Speaker',
      event: editingTestimonial.event || 'Global Summit',
      quote: editingTestimonial.quote || '',
      thumbnail: editingTestimonial.thumbnail || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=70',
      video: editingTestimonial.video || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
    })
    setLoading(false)
    if (res.success) {
      showToast('Testimonial published live to Supabase!')
      setEditingTestimonial(null)
      loadData()
    } else {
      showToast('Error saving: ' + res.error, 'error')
    }
  }

  async function handleDeleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial?')) return
    setLoading(true)
    const res = await deleteTestimonial(id)
    setLoading(false)
    if (res.success) {
      showToast('Testimonial removed!')
      loadData()
    } else {
      showToast('Error deleting: ' + res.error, 'error')
    }
  }

  // =====================================
  // STATISTICS UPDATE
  // =====================================
  async function handleSaveStat(label: string, value: number, suffix: string) {
    setLoading(true)
    const res = await updateStatistic(label, value, suffix)
    setLoading(false)
    if (res.success) {
      showToast(`Updated "${label}" to ${value}${suffix}`)
      loadData()
    } else {
      showToast('Error updating stat: ' + res.error, 'error')
    }
  }

  // CSV Export utility
  function exportCSV(filename: string, rows: any[]) {
    if (!rows.length) return alert('No data to export.')
    const headers = Object.keys(rows[0]).join(',')
    const values = rows.map(r => Object.values(r).map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([headers + '\n' + values], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-navy-950/95 text-white backdrop-blur-md transition-all">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 rounded-xl px-5 py-3 shadow-2xl transition-all ${toast.type === 'ok' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 bg-navy-900/60">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-navy-950 font-bold text-sm shadow-md">
            CMS
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold flex items-center gap-2">
              ORIGIN Content Studio
              {isSupabaseConfigured ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Supabase Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Local Storage Mode
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh from Supabase"
              className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Sync
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
          >
            <Eye size={14} />
            View Live Site
          </button>
          <button
            onClick={onClose}
            aria-label="Close CMS"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main CMS Body */}
      {!isAuthenticated ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <form onSubmit={handleAuthSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/20 text-gold mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-bold font-display">ORIGIN Management Portal</h2>
            <p className="mt-2 text-xs text-white/60">Enter the management passcode to edit conferences and review submissions.</p>

            <div className="mt-6">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (default: origin2026)"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm text-white placeholder-white/40 outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                autoFocus
              />
              {authError && (
                <p className="mt-2 text-xs text-rose-400">Incorrect passcode. Try: origin2026</p>
              )}
            </div>

            <button type="submit" className="btn btn-gold w-full mt-4 text-sm font-semibold">
              Unlock CMS Studio
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 border-r border-white/10 bg-navy-900/40 p-4 flex flex-col justify-between">
            <nav className="space-y-1">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">Content Management</p>

              <button
                onClick={() => setActiveTab('conferences')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'conferences' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><Layers size={16} /> Conferences</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{conferences.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'events' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><Calendar size={16} /> Upcoming Events</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{events.length}</span>
              </button>

              {/* NEW: SPEAKERS TAB */}
              <button
                onClick={() => setActiveTab('speakers')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'speakers' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><Mic size={16} /> Keynote Speakers</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{speakers.length}</span>
              </button>

              {/* NEW: GALLERY TAB */}
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'gallery' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><ImageIcon size={16} /> Photo Gallery</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{galleryItems.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'testimonials' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><MessageSquareQuote size={16} /> Testimonials</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{testimonials.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'stats' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><BarChart3 size={16} /> Site Metrics</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{stats.length}</span>
              </button>

              <p className="px-3 pt-6 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">Leads & Submissions</p>

              <button
                onClick={() => setActiveTab('subscribers')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'subscribers' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><Mail size={16} /> Newsletter</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{subscribers.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('registrations')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'registrations' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><Users size={16} /> Registrations</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{registrations.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeTab === 'inquiries' ? 'bg-gold text-navy-950 font-semibold' : 'text-white/80 hover:bg-white/5'}`}
              >
                <span className="flex items-center gap-2.5"><FileText size={16} /> Speaker Proposals</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{inquiries.length}</span>
              </button>
            </nav>

            <div className="border-t border-white/10 pt-4 text-center">
              <button
                onClick={() => {
                  localStorage.removeItem('origin_cms_auth')
                  setIsAuthenticated(false)
                }}
                className="text-xs text-white/50 hover:text-white"
              >
                Lock CMS
              </button>
            </div>
          </aside>

          {/* Tab Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            {!isSupabaseConfigured && (
              <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 backdrop-blur-md flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Notice: Supabase Environment Variables Missing on Production</p>
                  <p className="text-amber-200/90 leading-relaxed">
                    Your changes (including Deletes, Edits, and Additions) are currently saving to <strong>Local Storage</strong> in your browser. To sync live across all global visitors, please add <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">VITE_SUPABASE_URL</code> and <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">VITE_SUPABASE_ANON_KEY</code> to your hosting environment variables (e.g. Vercel dashboard).
                  </p>
                </div>
              </div>
            )}

            {/* 1. CONFERENCES TAB */}
            {activeTab === 'conferences' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Conferences</h2>
                    <p className="text-sm text-white/60">Any changes made here are saved directly to Supabase and show live on your site.</p>
                  </div>
                  <button
                    onClick={() => setEditingConference({
                      title: '',
                      category: 'Healthcare & Life Sciences',
                      date: 'Date to be announced',
                      location: 'Location to be announced',
                      theme: '',
                      sessions: '',
                      description: '',
                      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=70',
                      href: '#'
                    })}
                    className="btn btn-gold flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Conference
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {conferences.map((c) => (
                    <div key={c.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-gold/50">
                      <div className="relative aspect-video overflow-hidden rounded-xl">
                        <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                        <span className="absolute top-2 left-2 rounded-full bg-navy-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                          {c.category}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-display text-base font-semibold line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-white/50 mt-1">{c.date} • {c.location}</p>
                        {c.theme && <p className="text-xs text-gold/90 mt-1 font-medium line-clamp-1"><span className="text-white/40 uppercase text-[10px] font-bold">Theme:</span> {c.theme}</p>}
                        {c.sessions && <p className="text-xs text-white/60 mt-0.5 line-clamp-1"><span className="text-white/40 uppercase text-[10px] font-bold">Sessions:</span> {c.sessions}</p>}
                        <p className="text-xs text-white/70 mt-2 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                        <button
                          onClick={() => setEditingConference(c)}
                          className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteConference(c.id)}
                          className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. UPCOMING EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Upcoming Events</h2>
                    <p className="text-sm text-white/60">Schedule and manage upcoming dates and locations.</p>
                  </div>
                  <button
                    onClick={() => setEditingEvent({
                      name: '',
                      category: 'Technology & Innovation',
                      date: 'TBA',
                      location: 'To be announced',
                      href: '#'
                    })}
                    className="btn btn-gold flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Event
                  </button>
                </div>

                <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
                  {events.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-display font-semibold">{e.name}</h3>
                        <p className="text-xs text-white/60 mt-1">
                          {e.date} • {e.location} • <span className="text-gold">{e.category}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEvent(e)}
                          className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(e.id)}
                          className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-rose-300 hover:bg-rose-500/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SPEAKERS TAB (NEW) */}
            {activeTab === 'speakers' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Keynote & Expert Speakers</h2>
                    <p className="text-sm text-white/60">Add, edit, and organize speakers showcased across conferences.</p>
                  </div>
                  <button
                    onClick={() => setEditingSpeaker({
                      name: '',
                      role: 'Keynote Speaker',
                      organization: '',
                      topic: '',
                      bio: '',
                      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=70',
                      linkedin: '#'
                    })}
                    className="btn btn-gold flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Speaker
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {speakers.map((sp) => (
                    <div key={sp.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between hover:border-gold/40 transition">
                      <div>
                        <div className="aspect-square overflow-hidden rounded-xl bg-navy-900 mb-3">
                          <img src={sp.image} alt={sp.name} className="h-full w-full object-cover" />
                        </div>
                        <h3 className="font-display font-bold text-base text-white">{sp.name}</h3>
                        <p className="text-xs font-semibold text-gold mt-0.5">{sp.role}</p>
                        {sp.organization && <p className="text-[11px] text-white/60">{sp.organization}</p>}
                        {sp.topic && (
                          <p className="mt-2 text-xs text-white/80 bg-white/5 p-2 rounded-lg line-clamp-2">
                            <span className="text-[10px] text-gold uppercase block font-bold">Topic</span>
                            {sp.topic}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                        <button
                          onClick={() => setEditingSpeaker(sp)}
                          className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSpeaker(sp.id)}
                          className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GALLERY TAB (NEW) */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Conference Photo Gallery</h2>
                    <p className="text-sm text-white/60">Upload and curate conference photos shown in the "Moments from the room" section.</p>
                  </div>
                  <button
                    onClick={() => setEditingGallery({
                      src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=70',
                      thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70',
                      alt: 'Conference hall moment',
                      span: ''
                    })}
                    className="btn btn-gold flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Photo
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  {galleryItems.map((g, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col justify-between">
                      <div>
                        <div className="aspect-video overflow-hidden rounded-xl bg-navy-900">
                          <img src={g.thumb || g.src} alt={g.alt} className="h-full w-full object-cover" />
                        </div>
                        <p className="mt-3 text-xs text-white/80 line-clamp-2">{g.alt}</p>
                        <p className="mt-1 text-[11px] text-gold/80 font-mono">
                          {g.span ? `Span: ${g.span}` : 'Standard grid tile'}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                        <button
                          onClick={() => setEditingGallery({ ...g, id: (g as any).id || String(idx) })}
                          className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGallery((g as any).id || g.src)}
                          className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Testimonials</h2>
                    <p className="text-sm text-white/60">Manage speaker and delegate video quotes.</p>
                  </div>
                  <button
                    onClick={() => setEditingTestimonial({
                      name: '',
                      role: 'Keynote Speaker',
                      event: 'Sample Summit',
                      quote: '',
                      thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=70',
                      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
                    })}
                    className="btn btn-gold flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add Testimonial
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                      <div>
                        <div className="aspect-video overflow-hidden rounded-xl bg-black/40">
                          <img src={t.thumbnail} alt={t.name} className="h-full w-full object-cover" />
                        </div>
                        <p className="mt-3 text-xs italic text-white/80">“{t.quote}”</p>
                        <p className="mt-2 text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-gold">{t.role} • {t.event}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                        <button
                          onClick={() => setEditingTestimonial(t)}
                          className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/30"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. KEY METRICS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h2 className="font-display text-2xl font-bold">Key Figures & Statistics</h2>
                  <p className="text-sm text-white/60">Update the impact counters displayed across the site.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {stats.map((s, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">{s.label}</label>
                      <div className="mt-3 flex items-center gap-3">
                        <input
                          type="number"
                          defaultValue={s.value}
                          id={`stat-val-${idx}`}
                          className="w-32 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xl font-bold font-display text-gold"
                        />
                        <input
                          type="text"
                          defaultValue={s.suffix}
                          id={`stat-suf-${idx}`}
                          className="w-16 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center text-sm font-semibold"
                        />
                        <button
                          onClick={() => {
                            const v = Number((document.getElementById(`stat-val-${idx}`) as HTMLInputElement)?.value || 0)
                            const suf = (document.getElementById(`stat-suf-${idx}`) as HTMLInputElement)?.value || '+'
                            handleSaveStat(s.label, v, suf)
                          }}
                          className="btn btn-gold text-xs py-2 px-4"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. NEWSLETTER SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Newsletter Subscribers ({subscribers.length})</h2>
                    <p className="text-sm text-white/60">Live list of users who joined through the newsletter form.</p>
                  </div>
                  <button
                    onClick={() => exportCSV('origin_subscribers.csv', subscribers)}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-white/50">
                      <tr>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="p-8 text-center text-white/50">No subscribers yet.</td>
                        </tr>
                      ) : (
                        subscribers.map((s: any) => (
                          <tr key={s.id} className="hover:bg-white/5">
                            <td className="p-4 font-medium text-white">{s.email}</td>
                            <td className="p-4 text-xs text-white/60">{new Date(s.created_at).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. EVENT REGISTRATIONS */}
            {activeTab === 'registrations' && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Event Registrations ({registrations.length})</h2>
                    <p className="text-sm text-white/60">Delegates and attendees who registered for upcoming conferences.</p>
                  </div>
                  <button
                    onClick={() => exportCSV('origin_registrations.csv', registrations)}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-white/50">
                      <tr>
                        <th className="p-4">Attendee</th>
                        <th className="p-4">Event</th>
                        <th className="p-4">Ticket Type</th>
                        <th className="p-4">Organization</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-white/50">No registrations received yet.</td>
                        </tr>
                      ) : (
                        registrations.map((r: any) => (
                          <tr key={r.id} className="hover:bg-white/5">
                            <td className="p-4">
                              <p className="font-semibold text-white">{r.full_name}</p>
                              <p className="text-xs text-white/60">{r.email}</p>
                            </td>
                            <td className="p-4 text-sm text-gold font-medium">{r.event_name}</td>
                            <td className="p-4 text-xs text-white/80">{r.ticket_type}</td>
                            <td className="p-4 text-xs text-white/60">{r.organization || '—'}</td>
                            <td className="p-4 text-xs text-white/50">{new Date(r.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. SPEAKER PROPOSALS */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Speaker Proposals & Inquiries ({inquiries.length})</h2>
                    <p className="text-sm text-white/60">Submissions from professionals wishing to present or partner.</p>
                  </div>
                  <button
                    onClick={() => exportCSV('origin_inquiries.csv', inquiries)}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>

                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
                      No inquiries received yet.
                    </div>
                  ) : (
                    inquiries.map((inq: any) => (
                      <div key={inq.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold uppercase">
                              {inq.inquiry_type}
                            </span>
                            <h3 className="text-lg font-semibold mt-1">{inq.name}</h3>
                            <a href={`mailto:${inq.email}`} className="text-xs text-gold underline">{inq.email}</a>
                          </div>
                          <span className="text-xs text-white/50">{new Date(inq.created_at).toLocaleString()}</span>
                        </div>
                        <div className="rounded-xl bg-navy-950/60 p-4 text-sm text-white/80 whitespace-pre-line border border-white/5">
                          {inq.message || 'No message content.'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Conference Edit / Create Modal */}
      {editingConference && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-navy-900 border border-white/15 p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-display">
                {editingConference.id ? 'Edit Conference' : 'New Conference'}
              </h3>
              <button onClick={() => setEditingConference(null)} className="rounded-lg p-1 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveConference} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Conference Title *</label>
                <input
                  type="text"
                  required
                  value={editingConference.title || ''}
                  onChange={(e) => setEditingConference({ ...editingConference, title: e.target.value })}
                  placeholder="e.g. Global Nursing Science Congress 2027 (GNSC 2027)"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Category</label>
                  <select
                    value={editingConference.category || 'Healthcare & Life Sciences'}
                    onChange={(e) => setEditingConference({ ...editingConference, category: e.target.value as Category })}
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Conference Dates</label>
                  <input
                    type="text"
                    value={editingConference.date || ''}
                    onChange={(e) => setEditingConference({ ...editingConference, date: e.target.value })}
                    placeholder="e.g. October 24-26, 2026 (or 2027 Dates TBA)"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Venue &amp; Location</label>
                <input
                  type="text"
                  value={editingConference.location || ''}
                  onChange={(e) => setEditingConference({ ...editingConference, location: e.target.value })}
                  placeholder="e.g. London, UK / Hybrid"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                />
              </div>

              {/* FLOW ITEM 1: ABOUT */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">About the Conference *</label>
                  <span className="text-[11px] text-gold/80 font-mono">Flow #1 on Conference Page</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={editingConference.description || ''}
                  onChange={(e) => setEditingConference({ ...editingConference, description: e.target.value })}
                  placeholder="Comprehensive overview of the conference mandate, clinical/research scope, participant background, and goals..."
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                />
              </div>

              {/* FLOW ITEM 2: THEME */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Conference Theme</label>
                  <span className="text-[11px] text-gold/80 font-mono">Flow #2 on Conference Page</span>
                </div>
                <input
                  type="text"
                  value={editingConference.theme || ''}
                  onChange={(e) => setEditingConference({ ...editingConference, theme: e.target.value })}
                  placeholder="e.g. Advancing Global Healthcare & Nursing Practice"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                />
              </div>

              {/* FLOW ITEM 3: MIDDLE IMAGES */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Middle Images (Conference Gallery) {Array.isArray(editingConference.images) && editingConference.images.length > 0 && (
                      <span className="text-gold font-bold">({editingConference.images.length})</span>
                    )}
                  </label>
                  <span className="text-[11px] text-gold/80 font-mono">Flow #3 on Conference Page</span>
                </div>
                <p className="text-[11px] text-white/50">
                  Photos displayed in the middle section between Theme and Sessions.
                </p>

                {Array.isArray(editingConference.images) && editingConference.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {editingConference.images.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="group relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-navy-950">
                        <img src={imgUrl} alt={`Middle photo ${imgIdx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveMiddleImage(imgIdx)}
                          className="absolute top-1.5 right-1.5 rounded-full bg-rose-600/90 p-1 text-white opacity-80 hover:opacity-100 shadow transition"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => middleImagesInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center hover:border-gold hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  <UploadCloud size={16} className="text-gold" />
                  <span className="text-xs font-semibold text-white/80">
                    {imageProcessing ? 'Processing image...' : 'Click to add middle image (or drop file)'}
                  </span>
                </div>

                <input
                  ref={middleImagesInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleAddMiddleImage(file)
                    e.target.value = ''
                  }}
                />
              </div>

              {/* FLOW ITEM 4: SESSIONS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">
                    Conference Sessions {parseSessionsList(editingConference.sessions).length > 0 && (
                      <span className="text-gold font-bold">({parseSessionsList(editingConference.sessions).length})</span>
                    )}
                  </label>
                  <span className="text-[11px] text-gold/80 font-mono">Flow #4 on Conference Page</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSessionInput}
                    onChange={(e) => setNewSessionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSession()
                      }
                    }}
                    placeholder="e.g. Clinical Nursing Practice & Patient Care"
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={handleAddSession}
                    disabled={!newSessionInput.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-navy-950 hover:bg-gold-light transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Plus size={15} /> Add Session
                  </button>
                </div>

                {parseSessionsList(editingConference.sessions).length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1 max-h-40 overflow-y-auto no-scrollbar">
                    {parseSessionsList(editingConference.sessions).map((sess, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-sm hover:border-gold/50 transition"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold font-mono">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{sess}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(idx)}
                          className="ml-1 rounded-md p-1 text-white/40 hover:bg-rose-500/20 hover:text-rose-300 transition"
                          title="Remove session"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-center text-xs text-white/40">
                    No sessions added yet. Enter a session title above and click <strong className="text-white/60">Add Session</strong> or press <strong className="text-white/60">Enter</strong>.
                  </div>
                )}
              </div>

              {/* COVER IMAGE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Cover Image (Hero Banner &amp; Listing Card)
                </label>

                {editingConference.image ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file) handleDropConferenceImage(file)
                    }}
                    className={`relative group overflow-hidden rounded-2xl border bg-white/5 p-3 transition-all ${
                      isDraggingImage ? 'border-gold bg-gold/15' : 'border-white/20'
                    }`}
                  >
                    <div className="relative aspect-video w-full max-h-56 overflow-hidden rounded-xl bg-navy-950">
                      <img
                        src={editingConference.image}
                        alt="Conference Cover Preview"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => confFileInputRef.current?.click()}
                          className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-navy-950 hover:bg-gold-light transition shadow-lg flex items-center gap-1.5"
                        >
                          <UploadCloud size={14} /> Replace Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingConference({ ...editingConference, image: '' })}
                          className="rounded-full bg-rose-600/90 hover:bg-rose-600 px-4 py-2 text-xs font-bold text-white transition shadow-lg flex items-center gap-1.5"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between px-1 text-xs text-white/60">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        Image loaded (Drop new image or click Replace)
                      </span>
                      <button
                        type="button"
                        onClick={() => confFileInputRef.current?.click()}
                        className="text-gold hover:underline text-xs"
                      >
                        Browse computer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file) handleDropConferenceImage(file)
                    }}
                    onClick={() => confFileInputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                      isDraggingImage
                        ? 'border-gold bg-gold/15 scale-[1.01]'
                        : 'border-white/20 bg-white/5 hover:border-gold/60 hover:bg-white/10'
                    }`}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold group-hover:scale-110 transition-transform mb-3">
                      <UploadCloud size={28} />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {imageProcessing ? 'Processing image...' : 'Drag and drop your image here'}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      or <span className="text-gold underline font-medium">browse files</span> from your computer
                    </p>
                    <p className="mt-2 text-[11px] text-white/40">
                      PNG, JPG, WEBP, or GIF (auto-optimized)
                    </p>
                  </div>
                )}

                <input
                  ref={confFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleDropConferenceImage(file)
                    e.target.value = ''
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingConference(null)}
                  className="rounded-full px-5 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold text-sm"
                >
                  {loading ? 'Publishing...' : 'Publish Directly to Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Speaker Edit / Create Modal (NEW) */}
      {editingSpeaker && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-navy-900 border border-white/15 p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-display">{editingSpeaker.id ? 'Edit Speaker' : 'New Keynote Speaker'}</h3>
              <button onClick={() => setEditingSpeaker(null)} className="rounded-lg p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveSpeaker} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingSpeaker.name || ''}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                  placeholder="e.g. Dr. Jane Doe"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingSpeaker.role || ''}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, role: e.target.value })}
                    placeholder="Chief Science Officer"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Organization / University</label>
                  <input
                    type="text"
                    value={editingSpeaker.organization || ''}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, organization: e.target.value })}
                    placeholder="Acme Health BioTech"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Keynote Presentation Topic</label>
                <input
                  type="text"
                  value={editingSpeaker.topic || ''}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, topic: e.target.value })}
                  placeholder="e.g. Next-Generation AI & Translational Medicine"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Speaker Photo URL</label>
                <input
                  type="text"
                  value={editingSpeaker.image || ''}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
                {editingSpeaker.image && (
                  <div className="mt-2 h-20 w-20 overflow-hidden rounded-full border border-white/20">
                    <img src={editingSpeaker.image} alt="Avatar preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">LinkedIn Profile Link</label>
                <input
                  type="text"
                  value={editingSpeaker.linkedin || ''}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Brief Bio</label>
                <textarea
                  rows={2}
                  value={editingSpeaker.bio || ''}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, bio: e.target.value })}
                  placeholder="Short bio summarizing background and achievements..."
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingSpeaker(null)} className="rounded-full px-5 py-2 text-sm text-white/70 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-gold text-sm">{loading ? 'Publishing...' : 'Save & Publish Live'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Photo Edit / Create Modal (NEW) */}
      {editingGallery && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-navy-900 border border-white/15 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-display">{editingGallery.id ? 'Edit Photo' : 'Add Photo to Gallery'}</h3>
              <button onClick={() => setEditingGallery(null)} className="rounded-lg p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveGallery} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Full Resolution Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingGallery.src || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, src: e.target.value, thumb: editingGallery.thumb || e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Thumbnail Image URL (optional)</label>
                <input
                  type="text"
                  value={editingGallery.thumb || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, thumb: e.target.value })}
                  placeholder="Leave empty to use the full image URL"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Caption / Description</label>
                <input
                  type="text"
                  value={editingGallery.alt || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, alt: e.target.value })}
                  placeholder="e.g. Keynote audience in the main auditorium"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Layout Grid Size</label>
                <select
                  value={editingGallery.span || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, span: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="">Standard (1 column x 1 row)</option>
                  <option value="md:col-span-2">Wide Tile (2 columns x 1 row)</option>
                  <option value="md:col-span-2 md:row-span-2">Hero Feature (2 columns x 2 rows)</option>
                </select>
              </div>

              {editingGallery.src && (
                <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl border border-white/20">
                  <img src={editingGallery.src} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingGallery(null)} className="rounded-full px-5 py-2 text-sm text-white/70 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-gold text-sm">{loading ? 'Saving...' : 'Save & Publish Live'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Edit / Create Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-navy-900 border border-white/15 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-display">{editingEvent.id ? 'Edit Event' : 'New Upcoming Event'}</h3>
              <button onClick={() => setEditingEvent(null)} className="rounded-lg p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Event Name *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.name || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  placeholder="e.g. AI Innovation Summit"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Date</label>
                <input
                  type="text"
                  value={editingEvent.date || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  placeholder="e.g. Nov 14, 2026"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Location</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  placeholder="e.g. London / Virtual"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Category</label>
                <select
                  value={editingEvent.category || 'Technology & Innovation'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as Category })}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-navy-950 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingEvent(null)} className="rounded-full px-5 py-2 text-sm text-white/70 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-gold text-sm">{loading ? 'Publishing...' : 'Save & Publish Live'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Edit / Create Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-navy-900 border border-white/15 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-display">{editingTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button onClick={() => setEditingTestimonial(null)} className="rounded-lg p-1 hover:bg-white/10"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Speaker / Delegate Name *</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.name || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Role / Title</label>
                  <input
                    type="text"
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    placeholder="Keynote Speaker"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Conference Event</label>
                  <input
                    type="text"
                    value={editingTestimonial.event || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, event: e.target.value })}
                    placeholder="Global Health Summit"
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Quote Text</label>
                <textarea
                  rows={3}
                  value={editingTestimonial.quote || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  placeholder="A quote expressing their experience..."
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingTestimonial.thumbnail || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, thumbnail: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">Video URL (.mp4)</label>
                <input
                  type="text"
                  value={editingTestimonial.video || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, video: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingTestimonial(null)} className="rounded-full px-5 py-2 text-sm text-white/70 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-gold text-sm">{loading ? 'Publishing...' : 'Save & Publish Live'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
