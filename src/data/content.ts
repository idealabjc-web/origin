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

export type Category = 'Healthcare & Life Sciences' | 'Technology & Innovation' | 'Business & Leadership' | 'Research & Academia'
export const categories: Category[] = ['Healthcare & Life Sciences', 'Technology & Innovation', 'Business & Leadership', 'Research & Academia']

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
}
export const conferences: Conference[] = [
  {
    id: 'gnsc-2027',
    title: 'Global Nursing Science Congress 2027 (GNSC 2027)',
    category: 'Healthcare & Life Sciences',
    date: '2027 (Dates to be announced)',
    location: 'London, UK / Hybrid',
    theme: 'Advancing Global Healthcare & Nursing Practice',
    sessions: 'Nursing Education, Clinical Practice, Pediatrics, Midwifery, Oncology',
    description: 'An international integrated congress anticipating participants from across the globe with thought-provoking Keynote lectures, Oral and Poster presentations, and clinical workshops across Nursing Education, Clinical Practice, Pediatrics, Midwifery, Oncology, and Emergency Care.',
    image: u('photo-1576091160399-112ba8d25d1d', 900),
    href: '#conferences'
  },
  {
    id: 'gwbel-2027',
    title: 'International Conference on Global Business & Entrepreneurial Leadership (GWBEL 2027)',
    category: 'Business & Leadership',
    date: '2027 (Dates to be announced)',
    location: 'Geneva, Switzerland / Hybrid',
    theme: 'Transformative Entrepreneurship & Agile Leadership',
    sessions: 'Disruptive Innovation, Venture Capital, Enterprise AI, Scale-Up Execution',
    description: 'A global congress introducing the transformative power of entrepreneurship, startup accessibility, lean startup principles, and hands-on rapid prototyping to empower emerging leaders in marketing, finance, and management.',
    image: u('photo-1556761175-5973dc0f32e7', 900),
    href: '#conferences'
  },
  {
    id: 'wedc-2027',
    title: 'World Euro Dental Congress 2027 (WEDC 2027)',
    category: 'Healthcare & Life Sciences',
    date: '2027 (Dates to be announced)',
    location: 'Paris, France / Hybrid',
    theme: 'Cutting-Edge Discoveries in Modern Dentistry & Prosthodontics',
    sessions: 'Digital Dentistry, Intraoral CAD/CAM, Guided Implantology, Aesthetic Lasers',
    description: 'A phenomenal international occasion featuring exciting speakers, hands-on clinical sessions, and cutting-edge discoveries across Prosthodontics, Digital Dentistry, Oral Surgery, Laser & Aesthetic Dentistry, and Implantology.',
    image: u('photo-1629909613654-28e377c37b09', 900),
    href: '#conferences'
  }
]

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
  { src: u('photo-1505373877841-8d25f7d46678'), thumb: u('photo-1505373877841-8d25f7d46678', 600), alt: 'Keynote presentation in a lit auditorium', span: '' },
  { src: u('photo-1515187029135-18ee286d815b'), thumb: u('photo-1515187029135-18ee286d815b', 600), alt: 'Professionals networking during a break', span: '' },
  { src: u('photo-1517457373958-b7bdd4587205'), thumb: u('photo-1517457373958-b7bdd4587205', 900), alt: 'Panel discussion on stage', span: 'md:col-span-2' },
  { src: u('photo-1511578314322-379afb476865'), thumb: u('photo-1511578314322-379afb476865', 600), alt: 'Exhibition space with visitors', span: '' },
  { src: u('photo-1591115765373-5207764f72e7'), thumb: u('photo-1591115765373-5207764f72e7', 600), alt: 'Professional gathering in a conference hall', span: '' }
]

export interface UpcomingEvent { id: string; name: string; date: string; location: string; category: Category; href: string }
export const events: UpcomingEvent[] = [
  { id: 'ev-gnsc-2027', name: 'Global Nursing Science Congress 2027', date: '2027 • Dates TBA', location: 'London, UK / Hybrid', category: 'Healthcare & Life Sciences', href: '#conferences' },
  { id: 'ev-gwbel-2027', name: 'Global Business & Entrepreneurial Leadership', date: '2027 • Dates TBA', location: 'Geneva, Switzerland / Hybrid', category: 'Business & Leadership', href: '#conferences' },
  { id: 'ev-wedc-2027', name: 'World Euro Dental Congress 2027', date: '2027 • Dates TBA', location: 'Paris, France / Hybrid', category: 'Healthcare & Life Sciences', href: '#conferences' }
]

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

