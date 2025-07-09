-- Verify tables exist
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'messages');

-- Verify foreign key relationships
SELECT 'Foreign keys:' as status;
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public';

-- Test inserting a sample profile (replace with actual user ID)
-- INSERT INTO public.profiles (id, email, display_name) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User');

-- Verify RLS policies
SELECT 'RLS Policies:' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
