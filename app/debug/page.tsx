"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [fixedUrl, setFixedUrl] = useState("")

  useEffect(() => {
    async function checkConnection() {
      try {
        setStatus("loading")
        setMessage("Testing Supabase connection...")

        // Get the Supabase URL from environment
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        setSupabaseUrl(url || "Not set")

        // Show fixed URL (for debugging)
        if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
          setFixedUrl(`https://${url}`)
        } else {
          setFixedUrl(url || "")
        }

        // Test if we can make a simple query
        const { data, error } = await supabase.from("profiles").select("count").limit(1)

        if (error) {
          console.error("Supabase connection error:", error)
          setStatus("error")
          setMessage(`Connection error: ${error.message}`)
          return
        }

        setStatus("success")
        setMessage("Successfully connected to Supabase!")
      } catch (error) {
        console.error("Exception testing Supabase connection:", error)
        setStatus("error")
        setMessage(`Exception: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Debug</CardTitle>
          <CardDescription>Check if your Supabase connection is working properly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Original Supabase URL:</h3>
              <p className="text-sm text-muted-foreground break-all">{supabaseUrl || "Not available"}</p>
            </div>

            {fixedUrl && fixedUrl !== supabaseUrl && (
              <div>
                <h3 className="font-medium">Fixed Supabase URL (with protocol):</h3>
                <p className="text-sm text-muted-foreground break-all">{fixedUrl}</p>
              </div>
            )}

            <Alert variant={status === "success" ? "default" : status === "error" ? "destructive" : "default"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <div className="text-sm">
              <h3 className="font-medium mb-2">Troubleshooting tips:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure your environment variables are correctly set</li>
                <li>Check that your Supabase URL includes the protocol (https://)</li>
                <li>Verify your Supabase project is active</li>
                <li>Check that your API keys have the correct permissions</li>
                <li>Try updating your environment variables in Vercel</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

