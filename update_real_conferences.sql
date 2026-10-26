-- ====================================================================
-- ORIGIN CONFERENCES - LOAD REAL CONFERENCES DATA & CMS POLICIES
-- ====================================================================
-- Run this in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run

-- 1. ENSURE COLUMNS EXIST & CLEAN UP PREVIOUS DEMO DATA
ALTER TABLE public.conferences ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT '';
ALTER TABLE public.conferences ADD COLUMN IF NOT EXISTS sessions TEXT DEFAULT '';

DELETE FROM public.conferences WHERE id IN ('c1', 'c2', 'c3', 'c4');
DELETE FROM public.upcoming_events WHERE id IN ('e1', 'e2', 'e3');

-- 2. INSERT THE 3 REAL CONFERENCES
INSERT INTO public.conferences (id, title, category, date, location, theme, sessions, description, image, href, display_order)
VALUES
  (
    'gnsc-2027',
    'Global Nursing Science Congress 2027 (GNSC 2027)',
    'Healthcare & Life Sciences',
    '2027 (Dates to be announced)',
    'London, UK / Hybrid',
    'Advancing Global Healthcare & Nursing Practice',
    'Nursing Education, Clinical Practice, Pediatrics, Midwifery, Oncology',
    'An international integrated congress advancing clinical nursing, pediatric care, oncology nursing, patient safety models, and modern nursing education with world-leading healthcare scientists.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=70',
    '#conferences',
    1
  ),
  (
    'gwbel-2027',
    'International Conference on Global Business & Entrepreneurial Leadership (GWBEL 2027)',
    'Business & Leadership',
    '2027 (Dates to be announced)',
    'Geneva, Switzerland / Hybrid',
    'Transformative Entrepreneurship & Agile Leadership',
    'Disruptive Innovation, Venture Capital, Enterprise AI, Scale-Up Execution',
    'Empowering emerging leaders and entrepreneurs through lean startup methodology, venture capital, strategic leadership, rapid prototyping, and digital market transformation.',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70',
    '#conferences',
    2
  ),
  (
    'wedc-2027',
    'World Euro Dental Congress 2027 (WEDC 2027)',
    'Healthcare & Life Sciences',
    '2027 (Dates to be announced)',
    'Paris, France / Hybrid',
    'Cutting-Edge Discoveries in Modern Dentistry & Prosthodontics',
    'Digital Dentistry, Intraoral CAD/CAM, Guided Implantology, Aesthetic Lasers',
    'A phenomenal summit uniting world leaders in Prosthodontics, Digital Dentistry, Oral Surgery, Laser & Aesthetic Dentistry, Implantology, and Dental Practice Management.',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=70',
    '#conferences',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  date = EXCLUDED.date,
  location = EXCLUDED.location,
  theme = EXCLUDED.theme,
  sessions = EXCLUDED.sessions,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order;

-- 3. INSERT THE 3 REAL UPCOMING EVENTS
INSERT INTO public.upcoming_events (id, name, date, location, category, href, display_order)
VALUES
  (
    'ev-gnsc-2027',
    'Global Nursing Science Congress 2027',
    '2027 • Dates TBA',
    'London, UK / Hybrid',
    'Healthcare & Life Sciences',
    '#conferences',
    1
  ),
  (
    'ev-gwbel-2027',
    'Global Business & Entrepreneurial Leadership',
    '2027 • Dates TBA',
    'Geneva, Switzerland / Hybrid',
    'Business & Leadership',
    '#conferences',
    2
  ),
  (
    'ev-wedc-2027',
    'World Euro Dental Congress 2027',
    '2027 • Dates TBA',
    'Paris, France / Hybrid',
    'Healthcare & Life Sciences',
    '#conferences',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  date = EXCLUDED.date,
  location = EXCLUDED.location,
  category = EXCLUDED.category,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order;

-- 4. CREATE SPEAKERS AND GALLERY TABLES IF NOT EXISTS
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

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  thumb TEXT NOT NULL,
  alt TEXT NOT NULL,
  span TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- 6. GRANT CMS FULL PERMISSIONS ON ALL TABLES
DROP POLICY IF EXISTS "Allow CMS manage conferences" ON public.conferences;
DROP POLICY IF EXISTS "Allow public read on conferences" ON public.conferences;
CREATE POLICY "Allow CMS manage conferences" ON public.conferences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage upcoming_events" ON public.upcoming_events;
DROP POLICY IF EXISTS "Allow public read on upcoming_events" ON public.upcoming_events;
CREATE POLICY "Allow CMS manage upcoming_events" ON public.upcoming_events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public read on testimonials" ON public.testimonials;
CREATE POLICY "Allow CMS manage testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage statistics" ON public.statistics;
DROP POLICY IF EXISTS "Allow public read on statistics" ON public.statistics;
CREATE POLICY "Allow CMS manage statistics" ON public.statistics FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage speakers" ON public.speakers;
CREATE POLICY "Allow CMS manage speakers" ON public.speakers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow CMS manage gallery_items" ON public.gallery_items;
CREATE POLICY "Allow CMS manage gallery_items" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);

-- 7. SEED INITIAL SPEAKERS (MATCHING THE 3 CONFERENCES)
INSERT INTO public.speakers (id, name, role, organization, topic, bio, image, linkedin, display_order)
VALUES
  ('sp1', 'Dr. Sarah Jenkins', 'Clinical Nursing Director', 'St. Thomas Healthcare & Research', 'Advancing Critical Thinking and Quality in Emergency Nursing', 'Leader in hospital patient care model reform and clinical research.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=70', '#', 1),
  ('sp2', 'Marcus Vance', 'Managing Partner & Entrepreneur Fellow', 'Nova Dynamics Ventures', 'Lean Prototyping and Venture Capital Strategies for Modern Founders', 'Serial tech founder and venture capital advisor across Europe and US.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=70', '#', 2),
  ('sp3', 'Dr. Alain Dupont', 'Professor of Oral Surgery & Implantology', 'European Dental Institute', 'Digital Dentistry & Laser Innovations in Complex Prosthodontics', 'Pioneer in minimally invasive laser oral surgery and aesthetic restoration.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=70', '#', 3),
  ('sp4', 'Prof. Amara Okafor', 'Head of Healthcare Innovations', 'Oxford Academic Medical Centre', 'Crisis & Risk Management in Global Health Systems', 'Published researcher on international hospital resilience and healthcare technology.', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=70', '#', 4)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED INITIAL GALLERY MOMENTS
INSERT INTO public.gallery_items (id, src, thumb, alt, span, display_order)
VALUES
  ('g1', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70', 'Large conference audience facing the main stage', 'md:col-span-2 md:row-span-2', 1),
  ('g2', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=70', 'Keynote presentation in a lit auditorium', '', 2),
  ('g3', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=70', 'Professionals networking during a break', '', 3),
  ('g4', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=70', 'Panel discussion on stage', 'md:col-span-2', 4),
  ('g5', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=70', 'Exhibition space with visitors', '', 5),
  ('g6', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1600&q=70', 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=600&q=70', 'Professional gathering in a conference hall', '', 6)
ON CONFLICT (id) DO NOTHING;
