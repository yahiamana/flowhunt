"use client"

import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/auth/user-button"
import { SearchInput } from "@/components/search-input"
import { ModeToggle } from "@/components/mode-toggle"
import { Notifications } from "@/components/notifications"

export const NavbarRoutes = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Only admins can access teacher mode
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const isTeacherPage = pathname?.startsWith("/teacher")
  const isAdminPage = pathname?.startsWith("/admin")
  const isCoursePage = pathname?.includes("/courses")
  const isSearchPage = pathname === "/search"

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isAdminPage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isAdmin ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}
        <Notifications />
        <ModeToggle />
        <UserButton />
      </div>
    </>
  )
}
