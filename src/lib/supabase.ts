import { createClient } from '@supabase/supabase-js'
import {
  conferences as defaultConferences,
  events as defaultEvents,
  testimonials as defaultTestimonials,
  stats as defaultStats,
  speakers as defaultSpeakers,
  gallery as defaultGallery,
  type Conference,
  type UpcomingEvent,
  type Testimonial,
  type Speaker,
  type GalleryItem,
} from '../data/content'

const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  'https://khvvuffdfumuqffydlna.supabase.co'
).trim()
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodnZ1ZmZkZnVtdXFmZnlkbG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2Mzc2MjgsImV4cCI6MjEwODIxMzYyOH0.ZV3PEtXtaRrsn2U_5sF4X7cAy7oYVr1Esx9mNfK3II0'
).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to notify all React components to re-fetch live data immediately
export function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('origin:data-updated'))
  }
}

// Local storage keys for resilient CMS operations when Supabase is unconfigured or in offline mode
const LOCAL_CONFS_KEY = 'origin_conferences_local'
const LOCAL_EVENTS_KEY = 'origin_events_local'
const LOCAL_SPEAKERS_KEY = 'origin_speakers_local'
const LOCAL_TESTIMONIALS_KEY = 'origin_testimonials_local'
const LOCAL_GALLERY_KEY = 'origin_gallery_v2_local'

function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

function setLocalItem<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('LocalStorage save error:', e)
    }
  }
}

// ==========================================
// RESILIENT DATA PACKERS / UNPACKERS
// ==========================================
// Persists theme, sessions, and images even if individual columns are missing in Supabase
export function unpackConferenceData(desc: string | undefined | null) {
  if (!desc) return { description: '', theme: '', sessions: '', images: [] as string[] }
  const match = desc.match(/<!--ORIGIN_DATA:([\s\S]*?)-->/)
  if (!match) return { description: desc, theme: '', sessions: '', images: [] as string[] }
  try {
    const meta = JSON.parse(match[1])
    const cleanDesc = desc.replace(/<!--ORIGIN_DATA:[\s\S]*?-->/, '').trim()
    return {
      description: cleanDesc,
      theme: typeof meta.theme === 'string' ? meta.theme : '',
      sessions: typeof meta.sessions === 'string' ? meta.sessions : (Array.isArray(meta.sessions) ? JSON.stringify(meta.sessions) : ''),
      images: Array.isArray(meta.images) ? (meta.images as string[]) : ([] as string[])
    }
  } catch {
    return { description: desc, theme: '', sessions: '', images: [] as string[] }
  }
}

export function packConferenceData(desc: string, meta: { theme?: string; sessions?: string; images?: string[] }): string {
  const clean = (desc || '').replace(/<!--ORIGIN_DATA:[\s\S]*?-->/, '').trim()
  const payload = {
    theme: meta.theme || '',
    sessions: meta.sessions || '',
    images: Array.isArray(meta.images) ? meta.images : []
  }
  if (!payload.theme && !payload.sessions && payload.images.length === 0) {
    return clean
  }
  return `${clean}\n\n<!--ORIGIN_DATA:${JSON.stringify(payload)}-->`
}

// ==========================================
// DATA FETCHERS (with automatic fallbacks)
// ==========================================

export async function getConferences(): Promise<Conference[]> {
  const localConfs = getLocalItem<Conference[]>(LOCAL_CONFS_KEY, defaultConferences)
  if (!supabase) return localConfs
  try {
    const { data, error } = await supabase
      .from('conferences')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data) {
      console.warn('[Supabase] getConferences error, using local/default:', error?.message)
      return localConfs
    }

    const list = data.map((item) => {
      const localMatch = localConfs.find((c) => c.id === item.id)
      const defaultMatch = defaultConferences.find((c) => c.id === item.id)
      const { description: cleanDesc, theme: metaTheme, sessions: metaSessions, images: metaImages } = unpackConferenceData(item.description)

      // Priority resolution:
      // 1. Dedicated column from Supabase (if exists & has non-empty value)
      // 2. Packed metadata in description (persisted in Supabase text column across all devices)
      // 3. Local storage cached value (from current browser session)
      // 4. Default conference value
      const theme = item.theme || metaTheme || localMatch?.theme || defaultMatch?.theme || ''
      const sessions = item.sessions || metaSessions || localMatch?.sessions || defaultMatch?.sessions || ''

      let images: string[] = []
      if (Array.isArray(item.images) && item.images.length > 0) {
        images = item.images
      } else if (typeof item.images === 'string') {
        try { images = JSON.parse(item.images) } catch {}
      }
      if (images.length === 0 && metaImages && metaImages.length > 0) {
        images = metaImages
      }
      if (images.length === 0 && localMatch?.images && localMatch.images.length > 0) {
        images = localMatch.images
      }
      if (images.length === 0 && defaultMatch?.images) {
        images = defaultMatch.images
      }

      return {
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date,
        location: item.location,
        description: cleanDesc || item.description || '',
        image: item.image,
        href: item.href || '#',
        theme,
        sessions,
        images,
      }
    })
    setLocalItem(LOCAL_CONFS_KEY, list)
    return list
  } catch (err) {
    console.warn('[Supabase] Falling back to local/default conferences:', err)
    return localConfs
  }
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  if (!supabase) return getLocalItem<UpcomingEvent[]>(LOCAL_EVENTS_KEY, defaultEvents)
  try {
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data) {
      return getLocalItem<UpcomingEvent[]>(LOCAL_EVENTS_KEY, defaultEvents)
    }

    const list = data.map((item) => ({
      id: item.id,
      name: item.name,
      date: item.date,
      location: item.location,
      category: item.category,
      href: item.href || '#',
    }))
    setLocalItem(LOCAL_EVENTS_KEY, list)
    return list
  } catch (err) {
    return getLocalItem<UpcomingEvent[]>(LOCAL_EVENTS_KEY, defaultEvents)
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return getLocalItem<Testimonial[]>(LOCAL_TESTIMONIALS_KEY, defaultTestimonials)
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data) {
      return getLocalItem<Testimonial[]>(LOCAL_TESTIMONIALS_KEY, defaultTestimonials)
    }

    const list = data.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      event: item.event,
      quote: item.quote,
      thumbnail: item.thumbnail,
      video: item.video,
    }))
    setLocalItem(LOCAL_TESTIMONIALS_KEY, list)
    return list
  } catch (err) {
    return getLocalItem<Testimonial[]>(LOCAL_TESTIMONIALS_KEY, defaultTestimonials)
  }
}

export async function getStatistics(): Promise<typeof defaultStats> {
  if (!supabase) return defaultStats
  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return defaultStats
    }

    return data.map((item) => ({
      value: Number(item.value),
      suffix: item.suffix || '+',
      label: item.label,
    }))
  } catch (err) {
    return defaultStats
  }
}

export async function getSpeakers(): Promise<Speaker[]> {
  if (!supabase) return getLocalItem<Speaker[]>(LOCAL_SPEAKERS_KEY, defaultSpeakers)
  try {
    const { data, error } = await supabase
      .from('speakers')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data) {
      return getLocalItem<Speaker[]>(LOCAL_SPEAKERS_KEY, defaultSpeakers)
    }

    const list = data.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      organization: item.organization || '',
      topic: item.topic || '',
      bio: item.bio || '',
      image: item.image,
      linkedin: item.linkedin || '#',
    }))
    setLocalItem(LOCAL_SPEAKERS_KEY, list)
    return list
  } catch {
    return getLocalItem<Speaker[]>(LOCAL_SPEAKERS_KEY, defaultSpeakers)
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!supabase) return getLocalItem<GalleryItem[]>(LOCAL_GALLERY_KEY, defaultGallery)
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return getLocalItem<GalleryItem[]>(LOCAL_GALLERY_KEY, defaultGallery)
    }

    const list = data.map((item) => ({
      src: item.src,
      thumb: item.thumb,
      alt: item.alt,
      span: item.span || '',
    }))
    setLocalItem(LOCAL_GALLERY_KEY, list)
    return list
  } catch {
    return getLocalItem<GalleryItem[]>(LOCAL_GALLERY_KEY, defaultGallery)
  }
}

// ==========================================
// CMS CRUD OPERATIONS (Direct to Live)
// ==========================================

export async function upsertConference(conf: Partial<Conference> & { id: string }): Promise<{ success: boolean; error?: string }> {
  // Always update local cache so changes show immediately
  const current = getLocalItem<Conference[]>(LOCAL_CONFS_KEY, defaultConferences)
  const idx = current.findIndex(c => c.id === conf.id)
  const existingItem = idx >= 0 ? current[idx] : null

  // Ensure theme, sessions, images, and description are safely extracted and merged
  const theme = conf.theme !== undefined ? conf.theme : (existingItem?.theme || '')
  const sessions = conf.sessions !== undefined ? conf.sessions : (existingItem?.sessions || '')
  const images = conf.images !== undefined ? conf.images : (existingItem?.images || [])
  const cleanDescription = (conf.description !== undefined ? conf.description : (existingItem?.description || ''))
    .replace(/<!--ORIGIN_DATA:[\s\S]*?-->/, '')
    .trim()

  const packedDescription = packConferenceData(cleanDescription, { theme, sessions, images })

  const newItem: Conference = {
    id: conf.id,
    title: conf.title || existingItem?.title || 'Untitled Conference',
    category: (conf.category as any) || existingItem?.category || 'Healthcare & Life Sciences',
    date: conf.date || existingItem?.date || 'Date to be announced',
    location: conf.location || existingItem?.location || 'Location to be announced',
    description: cleanDescription,
    image: conf.image || existingItem?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70',
    href: conf.href || existingItem?.href || '#',
    theme,
    sessions,
    images,
  }

  if (idx >= 0) {
    current[idx] = newItem
  } else {
    current.push(newItem)
  }
  setLocalItem(LOCAL_CONFS_KEY, current)

  if (!supabase) {
    notifyDataChanged()
    return { success: true }
  }

  try {
    const payload: Record<string, any> = {
      id: conf.id,
      title: newItem.title,
      category: newItem.category,
      date: newItem.date,
      location: newItem.location,
      description: packedDescription, // Permanent cross-device fallback stored directly in Supabase
      image: newItem.image,
      href: newItem.href,
    }
    // Also save directly to dedicated columns if they exist in Supabase
    payload.theme = theme
    payload.sessions = sessions
    payload.images = images

    let { error } = await supabase
      .from('conferences')
      .upsert(payload, { onConflict: 'id' })

    // If Supabase table does not yet have certain columns, gracefully remove only the missing column(s)
    if (error) {
      console.warn('[Supabase] Initial upsert notice, applying column fallback:', error.message)
      if (error.message.includes('images')) {
        delete payload.images
      }
      if (error.message.includes('sessions')) {
        delete payload.sessions
      }
      if (error.message.includes('theme')) {
        delete payload.theme
      }
      const retry = await supabase.from('conferences').upsert(payload, { onConflict: 'id' })
      error = retry.error

      // If still erroring on any schema/column issue, save base columns (description still contains all theme/sessions data)
      if (error && (error.message.includes('column') || error.message.includes('schema'))) {
        delete payload.theme
        delete payload.sessions
        delete payload.images
        const baseRetry = await supabase.from('conferences').upsert(payload, { onConflict: 'id' })
        error = baseRetry.error
      }
    }

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteConference(id: string): Promise<{ success: boolean; error?: string }> {
  // Always update local cache
  const current = getLocalItem<Conference[]>(LOCAL_CONFS_KEY, defaultConferences)
  const filtered = current.filter(c => c.id !== id)
  setLocalItem(LOCAL_CONFS_KEY, filtered)

  if (!supabase) {
    notifyDataChanged()
    return { success: true }
  }

  try {
    const { error } = await supabase.from('conferences').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function upsertUpcomingEvent(evt: Partial<UpcomingEvent> & { id: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
  try {
    const { error } = await supabase
      .from('upcoming_events')
      .upsert({
        id: evt.id,
        name: evt.name,
        date: evt.date,
        location: evt.location,
        category: evt.category,
        href: evt.href || '#',
      }, { onConflict: 'id' })

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteUpcomingEvent(id: string): Promise<{ success: boolean; error?: string }> {
  const current = getLocalItem<UpcomingEvent[]>(LOCAL_EVENTS_KEY, defaultEvents)
  setLocalItem(LOCAL_EVENTS_KEY, current.filter(e => e.id !== id))

  if (!supabase) {
    notifyDataChanged()
    return { success: true }
  }
  try {
    const { error } = await supabase.from('upcoming_events').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function upsertTestimonial(t: Partial<Testimonial> & { id: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
  try {
    const { error } = await supabase
      .from('testimonials')
      .upsert({
        id: t.id,
        name: t.name,
        role: t.role,
        event: t.event,
        quote: t.quote,
        thumbnail: t.thumbnail,
        video: t.video,
      }, { onConflict: 'id' })

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  const current = getLocalItem<Testimonial[]>(LOCAL_TESTIMONIALS_KEY, defaultTestimonials)
  setLocalItem(LOCAL_TESTIMONIALS_KEY, current.filter(t => t.id !== id))

  if (!supabase) {
    notifyDataChanged()
    return { success: true }
  }
  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateStatistic(label: string, value: number, suffix: string = '+'): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
  try {
    const { error } = await supabase
      .from('statistics')
      .update({ value, suffix })
      .eq('label', label)

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function upsertSpeaker(sp: Partial<Speaker> & { id: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
  try {
    const { error } = await supabase
      .from('speakers')
      .upsert({
        id: sp.id,
        name: sp.name,
        role: sp.role,
        organization: sp.organization || '',
        topic: sp.topic || '',
        bio: sp.bio || '',
        image: sp.image,
        linkedin: sp.linkedin || '#',
      }, { onConflict: 'id' })

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteSpeaker(id: string): Promise<{ success: boolean; error?: string }> {
  const current = getLocalItem<Speaker[]>(LOCAL_SPEAKERS_KEY, defaultSpeakers)
  setLocalItem(LOCAL_SPEAKERS_KEY, current.filter(s => s.id !== id))

  if (!supabase) {
    notifyDataChanged()
    return { success: true }
  }
  try {
    const { error } = await supabase.from('speakers').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function upsertGalleryItem(item: Partial<GalleryItem> & { id?: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
  try {
    const itemId = item.id || 'g_' + Date.now().toString(36)
    const { error } = await supabase
      .from('gallery_items')
      .upsert({
        id: itemId,
        src: item.src,
        thumb: item.thumb || item.src,
        alt: item.alt || 'Conference moment',
        span: item.span || '',
      }, { onConflict: 'id' })

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteGalleryItem(idOrSrc: string): Promise<{ success: boolean; error?: string }> {
  const current = getLocalItem<GalleryItem[]>(LOCAL_GALLERY_KEY, defaultGallery)
  setLocalItem(LOCAL_GALLERY_KEY, current.filter(g => g.src !== idOrSrc))

  if (!supabase) {
    notifyDataChanged()
    return { success: true }
  }
  try {
    const { error } = await supabase.from('gallery_items').delete().or(`id.eq.${idOrSrc},src.eq.${idOrSrc}`)
    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ==========================================
// SUBMISSIONS & LEADS (Read for CMS)
// ==========================================

export async function getNewsletterSubscribers(): Promise<any[]> {
  if (!supabase) return []
  try {
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export async function getEventRegistrations(): Promise<any[]> {
  if (!supabase) return []
  try {
    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export async function getContactInquiries(): Promise<any[]> {
  if (!supabase) return []
  try {
    const { data } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

// ==========================================
// FORM SUBMISSIONS & ACTIONS
// ==========================================

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please add your credentials to .env',
    }
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: email.toLowerCase().trim() }])

    if (error) {
      if (error.code === '23505') {
        return { success: true }
      }
      return { success: false, error: error.message }
    }

    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to subscribe' }
  }
}

export interface ContactInquiryInput {
  name: string
  email: string
  phone?: string
  inquiry_type?: 'general' | 'speaker' | 'partnership'
  message?: string
}

export async function submitContactInquiry(inquiry: ContactInquiryInput): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please add your credentials to .env',
    }
  }

  try {
    const { error } = await supabase
      .from('contact_inquiries')
      .insert([inquiry])

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit inquiry' }
  }
}

export async function submitContactMessage(input: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  return submitContactInquiry({
    name: input.name,
    email: input.email,
    inquiry_type: 'general',
    message: input.subject ? `[${input.subject}] ${input.message}` : input.message,
  })
}

export async function submitSpeakerApplication(input: {
  full_name: string
  email: string
  affiliation?: string
  field?: string
  proposal_abstract: string
}): Promise<{ success: boolean; error?: string }> {
  return submitContactInquiry({
    name: input.full_name,
    email: input.email,
    phone: input.affiliation,
    inquiry_type: 'speaker',
    message: `[Field: ${input.field || 'General'}] Abstract: ${input.proposal_abstract}`,
  })
}

export interface EventRegistrationInput {
  event_id?: string
  event_name: string
  full_name: string
  email: string
  organization?: string
  ticket_type?: string
}

export async function submitEventRegistration(reg: EventRegistrationInput): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please add your credentials to .env',
    }
  }

  try {
    const { error } = await supabase
      .from('event_registrations')
      .insert([reg])

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to register' }
  }
}
