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

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

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

// ==========================================
// DATA FETCHERS (with automatic fallbacks)
// ==========================================

export async function getConferences(): Promise<Conference[]> {
  if (!supabase) return defaultConferences
  try {
    const { data, error } = await supabase
      .from('conferences')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase] getConferences notice:', error.message)
      return defaultConferences
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location,
      description: item.description,
      image: item.image,
      href: item.href || '#',
    }))
  } catch (err) {
    console.warn('[Supabase] Falling back to default conferences:', err)
    return defaultConferences
  }
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  if (!supabase) return defaultEvents
  try {
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase] getUpcomingEvents notice:', error.message)
      return defaultEvents
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      date: item.date,
      location: item.location,
      category: item.category,
      href: item.href || '#',
    }))
  } catch (err) {
    console.warn('[Supabase] Falling back to default events:', err)
    return defaultEvents
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return defaultTestimonials
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase] getTestimonials notice:', error.message)
      return defaultTestimonials
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      event: item.event,
      quote: item.quote,
      thumbnail: item.thumbnail,
      video: item.video,
    }))
  } catch (err) {
    console.warn('[Supabase] Falling back to default testimonials:', err)
    return defaultTestimonials
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
  if (!supabase) return defaultSpeakers
  try {
    const { data, error } = await supabase
      .from('speakers')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return defaultSpeakers
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      organization: item.organization || '',
      topic: item.topic || '',
      bio: item.bio || '',
      image: item.image,
      linkedin: item.linkedin || '#',
    }))
  } catch {
    return defaultSpeakers
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!supabase) return defaultGallery
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return defaultGallery
    }

    return data.map((item) => ({
      src: item.src,
      thumb: item.thumb,
      alt: item.alt,
      span: item.span || '',
    }))
  } catch {
    return defaultGallery
  }
}

// ==========================================
// CMS CRUD OPERATIONS (Direct to Live)
// ==========================================

export async function upsertConference(conf: Partial<Conference> & { id: string }): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
  try {
    const { error } = await supabase
      .from('conferences')
      .upsert({
        id: conf.id,
        title: conf.title,
        category: conf.category,
        date: conf.date,
        location: conf.location,
        description: conf.description,
        image: conf.image,
        href: conf.href || '#',
      }, { onConflict: 'id' })

    if (error) return { success: false, error: error.message }
    notifyDataChanged()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteConference(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
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
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
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
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
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
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
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
  if (!supabase) return { success: false, error: 'Supabase is not configured' }
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
