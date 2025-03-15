"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { CheckCircle, AlertTriangle } from "lucide-react"

export default function SetupProfilesPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const setupProfilesTable = async () => {
    try {
      setStatus("loading")
      setMessage("Setting up profiles table...")

      // Run the SQL to create the profiles table with the correct foreign key constraint
      const { error } = await supabase.rpc("setup_profiles_table")

      if (error) {
        console.error("Error setting up profiles table:", error)
        setStatus("error")
        setMessage(`Error: ${error.message}`)
        return
      }

      setStatus("success")
      setMessage("Profiles table set up successfully!")
    } catch (error) {
      console.error("Exception setting up profiles table:", error)
      setStatus("error")
      setMessage(`Exception: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Setup Profiles Table</CardTitle>
          <CardDescription>Create or fix the profiles table in your Supabase database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm">
              <p className="mb-4">
                This utility will help you set up the profiles table with the correct foreign key constraint to the
                auth.users table. Run this if you're experiencing foreign key constraint errors when creating profiles.
              </p>

              <div className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
                <pre>
                  {`-- SQL that will be executed:
CREATE OR REPLACE FUNCTION public.setup_profiles_table()
RETURNS void AS $$
BEGIN
  -- Check if profiles table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    -- Create profiles table
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
    
    -- Set up RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view all profiles"
      ON public.profiles FOR SELECT
      USING (true);
      
    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  ELSE
    -- Table exists, check if it has the correct foreign key constraint
    IF NOT EXISTS (
      SELECT FROM pg_constraint 
      WHERE conname = 'profiles_id_fkey' 
      AND conrelid = 'public.profiles'::regclass
    ) THEN
      -- Drop and recreate the table with the correct constraint
      ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;`}
                </pre>
              </div>
            </div>

            {status === "success" && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "loading" && (
              <Alert>
                <AlertDescription>
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    {message}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={setupProfilesTable} disabled={status === "loading"}>
            {status === "loading" ? "Setting up..." : "Setup Profiles Table"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manual SQL Setup</CardTitle>
          <CardDescription>
            If the automatic setup doesn't work, run this SQL in the Supabase SQL Editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <pre>
              {`-- Run this in the Supabase SQL Editor:
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

-- Set up RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);
  
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
  
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  USING (auth.jwt() ->> 'role' = 'service_role');`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

