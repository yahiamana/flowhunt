"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { UserButton } from "@/components/auth/user-button" // Placeholder for now
import { useSession } from "next-auth/react" // Will need SessionProvider

const Navbar = () => {
  const pathname = usePathname()
  
  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/courses",
      label: "Courses",
      active: pathname === "/courses",
    },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">HUNT</span>
        </Link>
        <div className="hidden md:flex md:flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "mr-6 text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
