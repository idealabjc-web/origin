-- ====================================================================
-- ORIGIN CONFERENCES - SUPABASE DATABASE SCHEMA & SEED DATA
-- ====================================================================
-- Run this complete script in the Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run

-- 1. CONFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.conferences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  href TEXT DEFAULT '#',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. UPCOMING EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.upcoming_events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  href TEXT DEFAULT '#',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  event TEXT NOT NULL,
  quote TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  video TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. STATISTICS TABLE
CREATE TABLE IF NOT EXISTS public.statistics (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT DEFAULT '+',
  display_order INTEGER DEFAULT 0
);

-- 5. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CONTACT & SPEAKER INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT DEFAULT 'general', -- 'general', 'speaker', 'partnership'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT,
  event_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  ticket_type TEXT DEFAULT 'Standard Delegate',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Public can read content tables
CREATE POLICY "Allow public read on conferences" ON public.conferences FOR SELECT USING (true);
CREATE POLICY "Allow public read on upcoming_events" ON public.upcoming_events FOR SELECT USING (true);
CREATE POLICY "Allow public read on testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read on statistics" ON public.statistics FOR SELECT USING (true);

-- Public can insert form submissions
CREATE POLICY "Allow public insert on newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on contact_inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

-- ====================================================================
-- SEED INITIAL DATA (Matches current content defaults)
-- ====================================================================

-- Seed Conferences
INSERT INTO public.conferences (id, title, category, date, location, description, image, href, display_order)
VALUES
  ('c1', 'Global Health & Life Sciences Summit', 'Healthcare & Life Sciences', 'Date to be announced', 'Location to be announced', 'Clinicians, researchers and industry leaders exchanging ideas on the future of care.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=70', '#', 1),
  ('c2', 'Innovation & Technology Forum', 'Technology & Innovation', 'Date to be announced', 'Location to be announced', 'Emerging technologies, digital transformation and the people building what comes next.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70', '#', 2),
  ('c3', 'Leadership & Business Congress', 'Business & Leadership', 'Date to be announced', 'Virtual / Hybrid', 'Strategy, leadership and growth conversations for senior professionals.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70', '#', 3),
  ('c4', 'International Research & Academia Meet', 'Research & Academia', 'Date to be announced', 'Location to be announced', 'A platform for scholars to present findings, publish and collaborate across borders.', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=70', '#', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Upcoming Events
INSERT INTO public.upcoming_events (id, name, date, location, category, href, display_order)
VALUES
  ('e1', 'Demo Event: Health Sciences Meet', 'TBA', 'Virtual', 'Healthcare & Life Sciences', '#', 1),
  ('e2', 'Demo Event: Tech Innovation Forum', 'TBA', 'To be announced', 'Technology & Innovation', '#', 2),
  ('e3', 'Demo Event: Leadership Congress', 'TBA', 'Hybrid', 'Business & Leadership', '#', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Testimonials
INSERT INTO public.testimonials (id, name, role, event, quote, thumbnail, video, display_order)
VALUES
  ('t1', 'Speaker Name', 'Keynote Speaker', 'Sample Conference', 'Placeholder testimonial from a conference speaker about the experience.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=70', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 1),
  ('t2', 'Delegate Name', 'Attendee / Delegate', 'Sample Conference', 'Placeholder testimonial from a delegate about networking and learning.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=70', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 2),
  ('t3', 'Professor Name', 'Academic Professional', 'Sample Conference', 'Placeholder testimonial from an academic about collaboration.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=70', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Statistics
INSERT INTO public.statistics (id, label, value, suffix, display_order)
VALUES
  ('s1', 'Conferences Organized', 50, '+', 1),
  ('s2', 'Global Participants', 10000, '+', 2),
  ('s3', 'Countries Reached', 40, '+', 3),
  ('s4', 'Expert Speakers', 500, '+', 4)
ON CONFLICT (id) DO NOTHING;
