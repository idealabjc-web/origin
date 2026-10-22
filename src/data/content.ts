import { ClipboardCheck, Globe2, Users, MonitorPlay, Handshake, Megaphone, type LucideIcon } from 'lucide-react'

/* ====== SITE CONFIG – edit these ====== */
export const site = {
  name: 'ORIGIN Conferences',
  // Leave empty until a backend exists. Set to a form/API URL (accepts POST JSON {email}).
  newsletterEndpoint: '',
  contact: { email: 'info@your-domain.com', phone: '+00 000 000 0000', address: 'Your office address, City, Country' },
  social: [
    { label: 'LinkedIn', href: '#' }, { label: 'X / Twitter', href: '#' },
    { label: 'Facebook', href: '#' }, { label: 'YouTube', href: '#' }
  ],
  ctaLinks: { speaker: '#contact', community: '#newsletter', register: '#events', conferences: '#conferences' },
  legal: { privacy: '#', terms: '#' }
}

export const navItems = [
  { label: 'Home', href: '#home' }, { label: 'About Us', href: '#about' },
  { label: 'Conferences', href: '#conferences' }, { label: 'Speakers', href: '#speakers' },
  { label: 'Testimonials', href: '#testimonials' }, { label: 'Contact', href: '#contact' }
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

export type Category = 'Healthcare & Life Sciences' | 'Technology & Innovation' | 'Business & Leadership' | 'Research & Academia'
export const categories: Category[] = ['Healthcare & Life Sciences', 'Technology & Innovation', 'Business & Leadership', 'Research & Academia']

export interface Conference { id: string; title: string; category: Category; date: string; location: string; description: string; image: string; href: string }
/* DEMO CONTENT – not real events. */
export const conferences: Conference[] = [
  { id: 'c1', title: 'Global Health & Life Sciences Summit', category: 'Healthcare & Life Sciences', date: 'Date to be announced', location: 'Location to be announced', description: 'Clinicians, researchers and industry leaders exchanging ideas on the future of care.', image: u('photo-1576091160399-112ba8d25d1d', 900), href: '#' },
  { id: 'c2', title: 'Innovation & Technology Forum', category: 'Technology & Innovation', date: 'Date to be announced', location: 'Location to be announced', description: 'Emerging technologies, digital transformation and the people building what comes next.', image: u('photo-1531482615713-2afd69097998', 900), href: '#' },
  { id: 'c3', title: 'Leadership & Business Congress', category: 'Business & Leadership', date: 'Date to be announced', location: 'Virtual / Hybrid', description: 'Strategy, leadership and growth conversations for senior professionals.', image: u('photo-1556761175-5973dc0f32e7', 900), href: '#' },
  { id: 'c4', title: 'International Research & Academia Meet', category: 'Research & Academia', date: 'Date to be announced', location: 'Location to be announced', description: 'A platform for scholars to present findings, publish and collaborate across borders.', image: u('photo-1523580494863-6f3031224c94', 900), href: '#' }
]

export interface Testimonial { id: string; name: string; role: string; event: string; quote: string; thumbnail: string; video: string }
/* DEMO – swap for real, consented testimonial videos. */
export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Speaker Name', role: 'Keynote Speaker', event: 'Sample Conference', quote: 'Placeholder testimonial from a conference speaker about the experience.', thumbnail: u('photo-1560250097-0b93528c311a', 800), video: V + 'ForBiggerMeltdowns.mp4' },
  { id: 't2', name: 'Delegate Name', role: 'Attendee / Delegate', event: 'Sample Conference', quote: 'Placeholder testimonial from a delegate about networking and learning.', thumbnail: u('photo-1573496359142-b8d87734a5a2', 800), video: V + 'ForBiggerBlazes.mp4' },
  { id: 't3', name: 'Professor Name', role: 'Academic Professional', event: 'Sample Conference', quote: 'Placeholder testimonial from an academic about collaboration.', thumbnail: u('photo-1519085360753-af0119f7cbe7', 800), video: V + 'ForBiggerEscapes.mp4' }
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
  { src: u('photo-1505373877841-8d25f7d46678'), thumb: u('photo-1505373877841-8d25f7d46678', 600), alt: 'Keynote presentation in a lit auditorium', span: '' },
  { src: u('photo-1515187029135-18ee286d815b'), thumb: u('photo-1515187029135-18ee286d815b', 600), alt: 'Professionals networking during a break', span: '' },
  { src: u('photo-1517457373958-b7bdd4587205'), thumb: u('photo-1517457373958-b7bdd4587205', 900), alt: 'Panel discussion on stage', span: 'md:col-span-2' },
  { src: u('photo-1511578314322-379afb476865'), thumb: u('photo-1511578314322-379afb476865', 600), alt: 'Exhibition space with visitors', span: '' },
  { src: u('photo-1591115765373-5207764f72e7'), thumb: u('photo-1591115765373-5207764f72e7', 600), alt: 'Professional gathering in a conference hall', span: '' }
]

export interface UpcomingEvent { id: string; name: string; date: string; location: string; category: Category; href: string }
/* DEMO – not confirmed events. */
export const events: UpcomingEvent[] = [
  { id: 'e1', name: 'Demo Event: Health Sciences Meet', date: 'TBA', location: 'Virtual', category: 'Healthcare & Life Sciences', href: '#' },
  { id: 'e2', name: 'Demo Event: Tech Innovation Forum', date: 'TBA', location: 'To be announced', category: 'Technology & Innovation', href: '#' },
  { id: 'e3', name: 'Demo Event: Leadership Congress', date: 'TBA', location: 'Hybrid', category: 'Business & Leadership', href: '#' }
]
