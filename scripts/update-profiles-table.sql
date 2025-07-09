-- Add display_name column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update existing profiles to use email as default display name
UPDATE public.profiles 
SET display_name = COALESCE(display_name, email) 
WHERE display_name IS NULL;
