"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthDebugPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const checkAuthSetup = async () => {
    try {
      setStatus("loading")

      const response = await fetch("/api/auth/debug")
      const data = await response.json()

      setDebugInfo(data)
      setStatus(data.success ? "success" : "error")
    } catch (error) {
      setStatus("error")
      setDebugInfo({ error: String(error) })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Auth Configuration Debug</CardTitle>
          <CardDescription>Check your Supabase authentication configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {status === "success" && (
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <AlertDescription>
                  <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={checkAuthSetup} disabled={status === "loading"}>
            {status === "loading" ? "Checking..." : "Check Auth Setup"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Password Requirements</CardTitle>
          <CardDescription>Current password requirements for user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Minimum 8 characters long</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one number (0-9)</li>
            <li>At least one special character (!@#$%^&*...)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Auth SQL Setup</CardTitle>
          <CardDescription>Run this SQL in your Supabase SQL Editor to verify auth settings</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`-- Check auth settings
SELECT *
FROM auth.config;

-- Update password requirements
UPDATE auth.config
SET 
  min_password_length = 8,
  enable_strong_password = true;

-- Check if email confirmation is required
SELECT *
FROM auth.config
WHERE confirm_email = true;

-- Check service role policies
SELECT *
FROM pg_policies
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- Reset email confirmation requirement if needed
UPDATE auth.config
SET confirm_email = false
WHERE confirm_email = true;

-- Grant necessary permissions to service role
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;
GRANT ALL ON auth.refresh_tokens TO service_role;`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

