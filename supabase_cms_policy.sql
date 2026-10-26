-- ====================================================================
-- ORIGIN CONFERENCES - CMS FULL PERMISSIONS & NEW MODULES (SPEAKERS + GALLERY)
-- ====================================================================
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run

-- 1. SPEAKERS TABLE
CREATE TABLE IF NOT EXISTS public.speakers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT,
  topic TEXT,
  bio TEXT,
  image TEXT NOT NULL,
  linkedin TEXT DEFAULT '#',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  thumb TEXT NOT NULL,
  alt TEXT NOT NULL,
  span TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Grant CMS full management permissions on all content tables
DROP POLICY IF EXISTS "Allow public read on conferences" ON public.conferences;
DROP POLICY IF EXISTS "Allow CMS manage conferences" ON public.conferences;
CREATE POLICY "Allow CMS manage conferences" ON public.conferences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on upcoming_events" ON public.upcoming_events;
DROP POLICY IF EXISTS "Allow CMS manage upcoming_events" ON public.upcoming_events;
CREATE POLICY "Allow CMS manage upcoming_events" ON public.upcoming_events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow CMS manage testimonials" ON public.testimonials;
CREATE POLICY "Allow public read on testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow CMS insert testimonials" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS update testimonials" ON public.testimonials FOR UPDATE TO anon, authenticated USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS delete testimonials" ON public.testimonials FOR DELETE TO anon, authenticated USING (id IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read on statistics" ON public.statistics;
DROP POLICY IF EXISTS "Allow CMS manage statistics" ON public.statistics;
CREATE POLICY "Allow CMS manage statistics" ON public.statistics FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage speakers" ON public.speakers;
CREATE POLICY "Allow CMS manage speakers" ON public.speakers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage gallery_items" ON public.gallery_items;
CREATE POLICY "Allow CMS manage gallery_items" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);

-- Allow viewing form submissions in CMS
DROP POLICY IF EXISTS "Allow CMS view newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow CMS view newsletter_subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow CMS view contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow CMS view contact_inquiries" ON public.contact_inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow CMS view event_registrations" ON public.event_registrations;
CREATE POLICY "Allow CMS view event_registrations" ON public.event_registrations FOR SELECT USING (true);

-- Seed Initial Speakers
INSERT INTO public.speakers (id, name, role, organization, topic, bio, image, linkedin, display_order)
VALUES
  ('sp1', 'Dr. Elena Rostova', 'Chief Science Officer', 'Global Health BioTech', 'Next-Generation Oncology & Precision Diagnostics', 'Pioneering researcher in targeted genomics and translational medicine.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=70', '#', 1),
  ('sp2', 'Marcus Vance', 'VP of Emerging Tech', 'Nova Dynamics', 'Autonomous Systems & Strategic Enterprise AI', 'Advisor to Fortune 500 boards on digital transformation.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=70', '#', 2),
  ('sp3', 'Prof. Amara Okafor', 'Chair of Global Health', 'Oxford Academic Institute', 'Cross-Border Collaboration in Public Health Resiliency', 'Author of 40+ publications on epidemiological infrastructure.', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=70', '#', 3),
  ('sp4', 'David Chen', 'Head of Sustainable Technology', 'CleanTech Ventures', 'Decarbonizing Heavy Industry with Intelligent Systems', 'Clean energy venture investor and technical fellow.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=70', '#', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Gallery Moments
INSERT INTO public.gallery_items (id, src, thumb, alt, span, display_order)
VALUES
  ('g1', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70', 'Large conference audience facing the main stage', 'md:col-span-2 md:row-span-2', 1),
  ('g2', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=70', 'Keynote presentation in a lit auditorium', '', 2),
  ('g3', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=70', 'Professionals networking during a break', '', 3),
  ('g4', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=70', 'Panel discussion on stage', 'md:col-span-2', 4),
  ('g5', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=70', 'Exhibition space with visitors', '', 5),
  ('g6', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=600&q=70', 'Professional gathering in a conference hall', '', 6)
ON CONFLICT (id) DO NOTHING;
