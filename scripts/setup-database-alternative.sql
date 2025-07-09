-- Alternative setup script with step-by-step approach

-- Step 1: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create messages table  
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Add foreign key constraints (separate from table creation)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_user_id_fkey'
  ) THEN
    ALTER TABLE messages ADD CONSTRAINT messages_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 4: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
CREATE POLICY IF NOT EXISTS "profiles_select_policy" ON profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "profiles_update_policy" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "messages_select_policy" ON messages FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "messages_insert_policy" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "messages_update_policy" ON messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "messages_delete_policy" ON messages FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Create function and trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''));
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
