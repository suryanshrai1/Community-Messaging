-- Simple setup script focusing on core functionality

-- Create profiles table (simple version)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Simple policies that allow most operations
DROP POLICY IF EXISTS "profiles_policy" ON public.profiles;
CREATE POLICY "profiles_policy" ON public.profiles USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "messages_update_policy" ON public.messages;
CREATE POLICY "messages_update_policy" ON public.messages FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "messages_delete_policy" ON public.messages;
CREATE POLICY "messages_delete_policy" ON public.messages FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.messages TO anon, authenticated;
