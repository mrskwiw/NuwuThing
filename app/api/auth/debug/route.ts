import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  try {
    // Create admin client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Test auth configuration
    const { data: settings, error: settingsError } = await supabase.from("auth.config").select("*").single()

    if (settingsError) {
      return NextResponse.json(
        {
          error: "Failed to fetch auth settings",
          details: settingsError,
        },
        { status: 500 },
      )
    }

    // Check service role permissions
    const { data: testData, error: testError } = await supabase.from("profiles").select("count").limit(1)

    const hasServiceRoleAccess = !testError

    return NextResponse.json({
      success: true,
      authSettings: settings,
      serviceRoleAccess: hasServiceRoleAccess,
      supabaseUrl: supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Auth configuration check failed",
        details: error,
      },
      { status: 500 },
    )
  }
}

