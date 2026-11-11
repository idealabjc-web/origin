-- Run this in Supabase SQL Editor if you wish to add the profession column directly:
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS profession TEXT;

