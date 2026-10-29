import { ClipboardCheck, Globe2, Users, MonitorPlay, Handshake, Megaphone, type LucideIcon } from 'lucide-react'

/* ====== SITE CONFIG – edit these ====== */
export const site = {
  name: 'ORIGIN Conferences',
  // Leave empty until a backend exists. Set to a form/API URL (accepts POST JSON {email}).
  newsletterEndpoint: '',
  contact: { email: 'contact@originconferences.com', phone: '+00 000 000 0000', address: 'Your office address, City, Country' },
  social: [
    { label: 'LinkedIn', href: '#' }, { label: 'X / Twitter', href: '#' },
    { label: 'Facebook', href: '#' }, { label: 'YouTube', href: '#' }
  ],
  ctaLinks: { speaker: '#contact', community: '#newsletter', register: '#events', conferences: '#conferences' },
  legal: { privacy: '/privacy', terms: '/terms', refund: '/refund-policy' }
}

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Conferences', href: '/conferences' },
  { label: 'Speakers', href: '/speakers' },
  { label: 'Services', href: '/services' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' }
]

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`
const V = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/'

/* Replace video URLs with your own licensed / self-hosted files (e.g. /videos/hall.mp4). */
export interface HeroSlide { video: string; poster: string; label: string }
export const heroSlides: HeroSlide[] = [
  { video: '/videos/conference-podium.mp4', poster: u('photo-1544531585-9847b68c8c86'), label: 'Keynote Address & Podium' },
  { video: '/videos/conference-panel.mp4', poster: u('photo-1517457373958-b7bdd4587205'), label: 'Executive Panel & Global Leaders' },
  { video: '/videos/conference-presentation.mp4', poster: u('photo-1531482615713-2afd69097998'), label: 'Interactive Sessions & Workshops' },
  { video: '/videos/conference-audience.mp4', poster: u('photo-1540575467063-178a50c2df87'), label: 'Global Delegates & Attendees' }
]

/* PLACEHOLDER values – replace with verified company data. */
export const stats = [
  { value: 50, suffix: '+', label: 'Conferences Organized' }, { value: 10000, suffix: '+', label: 'Global Participants' },
  { value: 40, suffix: '+', label: 'Countries Reached' }, { value: 500, suffix: '+', label: 'Expert Speakers' }
]

export type Category = string
export const categories: Category[] = ['Healthcare & Life Sciences', 'Technology & Innovation', 'Business & Leadership', 'Research & Academia']

const LEGACY_DEFAULT_CATEGORIES = new Set([
  'Healthcare & Life Sciences',
  'Technology & Innovation',
  'Business & Leadership',
  'Research & Academia',
])

export function getConferenceTopic(item: { title?: string; name?: string; category?: string }): string {
  const cat = (item.category || '').trim()
  if (cat && !LEGACY_DEFAULT_CATEGORIES.has(cat)) {
    return cat
  }

  const rawTitle = (item.title || item.name || '').trim()
  if (!rawTitle) return cat || 'General Congress'

  let cleaned = rawTitle
    .replace(/\([^)]*\)/g, '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const prefixMatch = cleaned.match(
    /(?:congress|conference|summit|symposium|forum|colloquium|convention|meeting|meet|workshop|expo)\s+(?:on|in|for|of)\s+(.+)$/i
  )
  if (prefixMatch && prefixMatch[1]) {
    cleaned = prefixMatch[1].trim()
  } else {
    cleaned = cleaned
      .replace(/^(?:the\s+)?(?:\d+(?:st|nd|rd|th)\s+)?(?:world|international|global|annual|european|premier|integrated|\s)+/i, '')
      .replace(/\s+(?:congress|conference|summit|symposium|forum|colloquium|convention|meeting|meet|workshop|expo)$/i, '')
      .trim()
  }

  // Clean up leading "Advanced " if long
  if (cleaned.length > 28) {
    cleaned = cleaned.replace(/^Advanced\s+/i, '').trim()
  }

  if (cleaned.length > 32) {
    const firstComma = cleaned.split(',')[0]?.trim()
    if (firstComma && firstComma.length >= 8 && firstComma.length <= 32) {
      cleaned = firstComma
    } else {
      const splitAnd = cleaned.split(/\s+(?:and|&)\s+/i)
      if (splitAnd[0] && splitAnd[0].trim().length >= 6) {
        cleaned = splitAnd[0].trim()
      }
    }
  }

  return cleaned || cat || 'General Congress'
}

export function parseSessionsList(val: string[] | string | undefined | null): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean)
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (!trimmed) return []
    // 1. JSON array string e.g. ["Session 1, with comma", "Session 2"]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((s) => String(s).trim()).filter(Boolean)
        }
      } catch {}
    }
    // 2. Double-pipe || separated
    if (trimmed.includes('||')) {
      return trimmed.split('||').map((s) => s.trim()).filter(Boolean)
    }
    // 3. Multiline string (one session per line)
    if (trimmed.includes('\n')) {
      return trimmed
        .split(/\r?\n+/)
        .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean)
    }
    // 4. Legacy comma-separated string: smartly keep "X, Y and Z" together as one session
    const parts = trimmed.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length <= 1) return parts
    const merged: string[] = []
    for (let i = 0; i < parts.length; i++) {
      const curr = parts[i]
      const next = parts[i + 1]
      const currHasAnd = /\b(?:and|&)\b/i.test(curr)
      const nextHasAnd = next ? /\b(?:and|&)\b/i.test(next) : false
      if (!currHasAnd && next && nextHasAnd && curr.split(/\s+/).length <= 3) {
        merged.push(`${curr}, ${next}`)
        i++
      } else {
        merged.push(curr)
      }
    }
    return merged
  }
  return []
}

export interface Conference {
  id: string
  title: string
  category: Category
  date: string
  location: string
  description: string
  image: string
  href: string
  theme?: string
  sessions?: string
  images?: string[]
}
export const conferences: Conference[] = []

export interface Testimonial { id: string; name: string; role: string; event: string; quote: string; thumbnail: string; video: string }
export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Dr. Sarah Jenkins', role: 'Clinical Nursing Director', event: 'Global Nursing Science Congress', quote: 'The interactive clinical workshops and patient care model discussions provided invaluable perspectives for our entire department.', thumbnail: u('photo-1573496359142-b8d87734a5a2', 800), video: V + 'ForBiggerMeltdowns.mp4' },
  { id: 't2', name: 'Marcus Vance', role: 'Managing Partner, Nova Ventures', event: 'Global Business & Entrepreneurial Leadership', quote: 'The rapid prototyping and venture pitch sessions connected groundbreaking startup founders with senior corporate leaders.', thumbnail: u('photo-1560250097-0b93528c311a', 800), video: V + 'ForBiggerBlazes.mp4' },
  { id: 't3', name: 'Dr. Alain Dupont', role: 'Professor of Oral & Maxillofacial Surgery', event: 'World Euro Dental Congress', quote: 'Hands-on digital dentistry and laser implantology demonstrations made this one of the most practical European congresses.', thumbnail: u('photo-1519085360753-af0119f7cbe7', 800), video: V + 'ForBiggerEscapes.mp4' }
]

export interface Service { icon: LucideIcon; title: string; text: string }
export const services: Service[] = [
  { icon: ClipboardCheck, title: 'End-to-End Conference Management', text: 'Planning and coordination from first concept to final session.' },
  { icon: Globe2, title: 'International Speaker Coordination', text: 'Inviting, scheduling and supporting speakers from around the world.' },
  { icon: Users, title: 'Delegate Registration Support', text: 'Clear registration journeys and responsive delegate assistance.' },
  { icon: MonitorPlay, title: 'Hybrid and Virtual Solutions', text: 'Formats that bring remote participants into the room.' },
  { icon: Handshake, title: 'Sponsorship and Partnership Coordination', text: 'Structured opportunities for organisations to engage with delegates.' },
  { icon: Megaphone, title: 'Conference Marketing and Promotion', text: 'Outreach that connects each conference with the right audience.' }
]

export interface GalleryItem { src: string; thumb: string; alt: string; span: string }
export const gallery: GalleryItem[] = [
  { src: u('photo-1540575467063-178a50c2df87'), thumb: u('photo-1540575467063-178a50c2df87', 900), alt: 'Large conference audience facing the main stage', span: 'md:col-span-2 md:row-span-2' },
  { src: u('photo-1505373877841-8d25f7d46678'), thumb: u('photo-1505373877841-8d25f7d46678', 600), alt: 'Keynote presentation in a lit auditorium', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1515187029135-18ee286d815b'), thumb: u('photo-1515187029135-18ee286d815b', 600), alt: 'Professionals networking during an executive break', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1517457373958-b7bdd4587205'), thumb: u('photo-1517457373958-b7bdd4587205', 900), alt: 'International panel discussion and audience Q&A on stage', span: 'md:col-span-2 md:row-span-1' },
  { src: u('photo-1511578314322-379afb476865'), thumb: u('photo-1511578314322-379afb476865', 600), alt: 'Scientific and healthcare exhibition pavilion', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1591115765373-5207764f72e7'), thumb: u('photo-1591115765373-5207764f72e7', 600), alt: 'Professional symposium gathering in a conference hall', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1475721027785-f74eccf877e2'), thumb: u('photo-1475721027785-f74eccf877e2', 900), alt: 'Keynote speaker addressing illuminated congress plenary', span: 'md:col-span-2 md:row-span-2' },
  { src: u('photo-1528605248644-14dd04022da1'), thumb: u('photo-1528605248644-14dd04022da1', 600), alt: 'Global delegates in an executive leadership roundtable', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1587825140708-dfaf72ae4b04'), thumb: u('photo-1587825140708-dfaf72ae4b04', 600), alt: 'Clinical research poster presentation and peer review session', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1576091160399-112ba8d25d1d'), thumb: u('photo-1576091160399-112ba8d25d1d', 900), alt: 'Biomedical technology demonstrations and hands-on clinical workshop', span: 'md:col-span-2 md:row-span-1' },
  { src: u('photo-1531058020387-3be344556be6'), thumb: u('photo-1531058020387-3be344556be6', 600), alt: 'International summit registration and delegate VIP welcome', span: 'md:col-span-1 md:row-span-1' },
  { src: u('photo-1511795409834-ef04bbd61622'), thumb: u('photo-1511795409834-ef04bbd61622', 600), alt: 'Evening gala awards dinner and international fellowship banquet', span: 'md:col-span-1 md:row-span-1' }
]

export interface UpcomingEvent { id: string; name: string; date: string; location: string; category: Category; href: string }
export const events: UpcomingEvent[] = []

export interface Speaker {
  id: string
  name: string
  role: string
  organization?: string
  topic?: string
  bio?: string
  image: string
  linkedin?: string
}

export const speakers: Speaker[] = [
  {
    id: 'sp1',
    name: 'Dr. Elena Rostova',
    role: 'Chief Science Officer',
    organization: 'Global Health BioTech',
    topic: 'Next-Generation Oncology & Precision Diagnostics',
    bio: 'Pioneering researcher in targeted genomics and translational medicine.',
    image: u('photo-1573496359142-b8d87734a5a2', 800),
    linkedin: '#'
  },
  {
    id: 'sp2',
    name: 'Marcus Vance',
    role: 'VP of Emerging Tech',
    organization: 'Nova Dynamics',
    topic: 'Autonomous Systems & Strategic Enterprise AI',
    bio: 'Advisor to Fortune 500 boards on digital transformation.',
    image: u('photo-1560250097-0b93528c311a', 800),
    linkedin: '#'
  },
  {
    id: 'sp3',
    name: 'Prof. Amara Okafor',
    role: 'Chair of Global Health',
    organization: 'Oxford Academic Institute',
    topic: 'Cross-Border Collaboration in Public Health Resiliency',
    bio: 'Author of 40+ publications on epidemiological infrastructure.',
    image: u('photo-1580894732444-8ecded7900cd', 800),
    linkedin: '#'
  },
  {
    id: 'sp4',
    name: 'David Chen',
    role: 'Head of Sustainable Technology',
    organization: 'CleanTech Ventures',
    topic: 'Decarbonizing Heavy Industry with Intelligent Systems',
    bio: 'Clean energy venture investor and technical fellow.',
    image: u('photo-1519085360753-af0119f7cbe7', 800),
    linkedin: '#'
  }
]

