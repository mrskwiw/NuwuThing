import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isUserAdmin } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Tag, FileQuestion, BarChart, Settings, LogOut } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard - QuizSquirrel",
  description: "Admin dashboard for QuizSquirrel",
}

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const isAdmin = await isUserAdmin(user.id)

  if (!isAdmin) {
    redirect("/unauthorized")
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Quiz</span>
            <span>Squirrel</span>
            <span className="text-xs text-muted-foreground ml-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Tag className="h-5 w-5 text-muted-foreground" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/quizzes"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
            <span>Quizzes</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <BarChart className="h-5 w-5 text-muted-foreground" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="post">
            <Button variant="outline" className="w-full justify-start" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-card flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-lg font-medium">Admin Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

