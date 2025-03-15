-- Auth Setup SQL for QuizSquirrel
-- Run this in your Supabase SQL Editor to fix auth and profile issues

-- 1. Update auth settings to require stronger passwords
UPDATE auth.config
SET 
  -- Require at least 8 characters
  min_password_length = 8,
  -- Enable password strength checks
  enable_strong_password = true;

-- 2. Set up profiles table with proper foreign key constraint
DROP TABLE IF EXISTS public.profiles;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'user'::TEXT
);

-- 3. Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);
  
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
  
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. Allow service role to manage all profiles
CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 6. Grant necessary permissions to service role
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;
GRANT ALL ON auth.refresh_tokens TO service_role;

-- 7. Create function to check if user exists before creating profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, email, created_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to automatically create profile when user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Check if trigger is properly set up
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

