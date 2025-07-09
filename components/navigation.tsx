"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { MessageSquare, Home, User, Blocks, LogOut, Settings } from "lucide-react"

export function Navigation() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  if (!user) {
    return (
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6" />
                <span className="font-bold text-xl">Community Messaging</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span className="font-bold text-xl">Community Messaging</span>
            </Link>

            <div className="flex space-x-4">
              <Link href="/feed">
                <Button
                  variant={isActive("/feed") ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Public Feed</span>
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>My Messages</span>
                </Button>
              </Link>

              <Link href="/profile">
                <Button
                  variant={isActive("/profile") ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>

              <Link href="/blockchain">
                <Button
                  variant={isActive("/blockchain") ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Blocks className="h-4 w-4" />
                  <span>Blockchain</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
