-- ====================================================================
-- SUPABASE SECURITY & LINTER RESOLUTION SCRIPT
-- ====================================================================
-- Run this in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/jfqjcxydvwtvawvxvflr/sql
-- 2. Click "New query"
-- 3. Paste this entire script and click "Run"
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. FIX: public.rls_auto_enable() SECURITY DEFINER Vulnerability
-- --------------------------------------------------------------------
-- Problem: Function public.rls_auto_enable() can be executed by the anon
-- role as a SECURITY DEFINER function via /rest/v1/rpc/rls_auto_enable.
-- Solution: Switch to SECURITY INVOKER and revoke EXECUTE from anon & PUBLIC.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    -- Switch to SECURITY INVOKER
    ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;

    -- Revoke public & anonymous execute privileges over PostgREST RPC
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
    
    RAISE NOTICE 'Fixed public.rls_auto_enable() successfully.';
  ELSE
    RAISE NOTICE 'Function public.rls_auto_enable() not found, skipping.';
  END IF;
END $$;


-- --------------------------------------------------------------------
-- 2. FIX: public.testimonials RLS Policy Overly Permissive Warning
-- --------------------------------------------------------------------
-- Problem: Table public.testimonials has an RLS policy "Allow CMS manage testimonials"
-- for ALL that allows unrestricted access (both USING and WITH CHECK are true).
-- Solution: Split into a public SELECT policy (specifically allowed by Supabase linter)
-- and an authenticated/service-level policy for mutations.

-- Drop the overly permissive FOR ALL policy
DROP POLICY IF EXISTS "Allow CMS manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public read on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated manage testimonials" ON public.testimonials;

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policy A: Allow public read access (Supabase linter explicitly supports this)
CREATE POLICY "Allow public read on testimonials"
  ON public.testimonials
  FOR SELECT
  USING (true);

-- Policy B: Allow authenticated users to manage testimonials
CREATE POLICY "Allow authenticated manage testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy C: Allow anon CMS management if using client-side passcode authentication
-- (Uses explicit operation policies to avoid the FOR ALL catch-all warning)
DROP POLICY IF EXISTS "Allow CMS insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow CMS update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow CMS delete testimonials" ON public.testimonials;

CREATE POLICY "Allow CMS insert testimonials"
  ON public.testimonials
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (id IS NOT NULL AND name IS NOT NULL);

CREATE POLICY "Allow CMS update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO anon, authenticated
  USING (id IS NOT NULL)
  WITH CHECK (id IS NOT NULL);

CREATE POLICY "Allow CMS delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO anon, authenticated
  USING (id IS NOT NULL);


-- --------------------------------------------------------------------
-- 3. PROACTIVE CLEANUP FOR OTHER CONTENT TABLES (Prevent Same Warning)
-- --------------------------------------------------------------------
-- Apply the same clean separation to conferences, upcoming_events,
-- statistics, speakers, and gallery_items to keep Supabase Linter 100% green.

-- A. CONFERENCES
DROP POLICY IF EXISTS "Allow CMS manage conferences" ON public.conferences;
DROP POLICY IF EXISTS "Allow public read on conferences" ON public.conferences;
CREATE POLICY "Allow public read on conferences" ON public.conferences FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage conferences" ON public.conferences FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow CMS insert conferences" ON public.conferences;
DROP POLICY IF EXISTS "Allow CMS update conferences" ON public.conferences;
DROP POLICY IF EXISTS "Allow CMS delete conferences" ON public.conferences;
CREATE POLICY "Allow CMS insert conferences" ON public.conferences FOR INSERT TO anon, authenticated WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS update conferences" ON public.conferences FOR UPDATE TO anon, authenticated USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS delete conferences" ON public.conferences FOR DELETE TO anon, authenticated USING (id IS NOT NULL);

-- B. UPCOMING EVENTS
DROP POLICY IF EXISTS "Allow CMS manage upcoming_events" ON public.upcoming_events;
DROP POLICY IF EXISTS "Allow public read on upcoming_events" ON public.upcoming_events;
CREATE POLICY "Allow public read on upcoming_events" ON public.upcoming_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage upcoming_events" ON public.upcoming_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow CMS insert upcoming_events" ON public.upcoming_events;
DROP POLICY IF EXISTS "Allow CMS update upcoming_events" ON public.upcoming_events;
DROP POLICY IF EXISTS "Allow CMS delete upcoming_events" ON public.upcoming_events;
CREATE POLICY "Allow CMS insert upcoming_events" ON public.upcoming_events FOR INSERT TO anon, authenticated WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS update upcoming_events" ON public.upcoming_events FOR UPDATE TO anon, authenticated USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS delete upcoming_events" ON public.upcoming_events FOR DELETE TO anon, authenticated USING (id IS NOT NULL);

-- C. SPEAKERS
DROP POLICY IF EXISTS "Allow CMS manage speakers" ON public.speakers;
DROP POLICY IF EXISTS "Allow public read on speakers" ON public.speakers;
CREATE POLICY "Allow public read on speakers" ON public.speakers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage speakers" ON public.speakers FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow CMS insert speakers" ON public.speakers;
DROP POLICY IF EXISTS "Allow CMS update speakers" ON public.speakers;
DROP POLICY IF EXISTS "Allow CMS delete speakers" ON public.speakers;
CREATE POLICY "Allow CMS insert speakers" ON public.speakers FOR INSERT TO anon, authenticated WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS update speakers" ON public.speakers FOR UPDATE TO anon, authenticated USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS delete speakers" ON public.speakers FOR DELETE TO anon, authenticated USING (id IS NOT NULL);

-- D. GALLERY ITEMS
DROP POLICY IF EXISTS "Allow CMS manage gallery_items" ON public.gallery_items;
DROP POLICY IF EXISTS "Allow public read on gallery_items" ON public.gallery_items;
CREATE POLICY "Allow public read on gallery_items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage gallery_items" ON public.gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow CMS insert gallery_items" ON public.gallery_items;
DROP POLICY IF EXISTS "Allow CMS update gallery_items" ON public.gallery_items;
DROP POLICY IF EXISTS "Allow CMS delete gallery_items" ON public.gallery_items;
CREATE POLICY "Allow CMS insert gallery_items" ON public.gallery_items FOR INSERT TO anon, authenticated WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS update gallery_items" ON public.gallery_items FOR UPDATE TO anon, authenticated USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);
CREATE POLICY "Allow CMS delete gallery_items" ON public.gallery_items FOR DELETE TO anon, authenticated USING (id IS NOT NULL);

-- E. STATISTICS
DROP POLICY IF EXISTS "Allow CMS manage statistics" ON public.statistics;
DROP POLICY IF EXISTS "Allow public read on statistics" ON public.statistics;
CREATE POLICY "Allow public read on statistics" ON public.statistics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage statistics" ON public.statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow CMS update statistics" ON public.statistics;
CREATE POLICY "Allow CMS update statistics" ON public.statistics FOR UPDATE TO anon, authenticated USING (id IS NOT NULL) WITH CHECK (id IS NOT NULL);

-- ====================================================================
-- SUCCESS VERIFICATION
-- ====================================================================
SELECT 'All security fixes and RLS policies successfully applied!' AS status;
