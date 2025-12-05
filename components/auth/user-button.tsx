"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export const UserButton = () => {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) {
    return (
        <div className="flex items-center gap-x-2">
            <Link href="/sign-in">
                <Button variant="outline" size="sm">
                    Log in
                </Button>
            </Link>
             <Link href="/sign-up">
                <Button size="sm">
                    Sign up
                </Button>
            </Link>
        </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                    </p>
                )}
            </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        {user.role === "INSTRUCTOR" && (
            <DropdownMenuItem asChild>
                <Link href="/teacher/courses">Teacher Mode</Link>
            </DropdownMenuItem>
        )}
         {user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
                <Link href="/admin">Admin Dashboard</Link>
            </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => signOut()}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
