-- ====================================================================
-- ENSURE CONFERENCE THEME, SESSIONS, & IMAGES COLUMNS IN SUPABASE
-- ====================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jfqjcxydvwtvawvxvflr/sql
-- ====================================================================

-- 1. Add theme, sessions, and images columns to public.conferences
ALTER TABLE public.conferences ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT '';
ALTER TABLE public.conferences ADD COLUMN IF NOT EXISTS sessions TEXT DEFAULT '';
ALTER TABLE public.conferences ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Notify PostgREST schema cache to immediately reload all columns
NOTIFY pgrst, 'reload schema';

SELECT 'Conferences table schema successfully updated with theme, sessions, and images!' AS status;
