"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { toggleBan } from "@/actions/toggle-ban"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const { role, isBanned } = row.original as any
      return (
        <div className="flex items-center gap-2">
          <span>{role}</span>
          {isBanned && (
            <Badge variant="destructive" className="ml-2">
              BANNED
            </Badge>
          )}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, isBanned } = row.original as any
      const router = useRouter()

      const onBan = async () => {
        try {
          await toggleBan(id)
          toast.success(isBanned ? "User unbanned" : "User banned")
          router.refresh()
        } catch {
          toast.error("Something went wrong")
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onBan} className={isBanned ? "text-green-600" : "text-red-600"}>
              {isBanned ? "Unban user" : "Ban user"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
