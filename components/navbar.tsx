"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, PlusSquare, Search, LogIn, User, LogOut, Settings } from "lucide-react"

export function Navbar() {
  const { user, profile, signOut, isLoading } = useSupabaseAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🐿️</span>
          <span>QuizSquirrel</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 mx-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
          <Link href="/explore" className="text-sm font-medium transition-colors hover:text-primary">
            <Search className="h-5 w-5" />
            <span className="sr-only">Explore</span>
          </Link>
          <Link href="/create" className="text-sm font-medium transition-colors hover:text-primary">
            <PlusSquare className="h-5 w-5" />
            <span className="sr-only">Create</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
                    <AvatarFallback>{profile?.display_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.display_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Log in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

