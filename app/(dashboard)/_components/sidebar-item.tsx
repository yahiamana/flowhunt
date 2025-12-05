"use client"

import { LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-900 text-sm font-[500] pl-6 transition-all hover:text-black hover:bg-slate-300/20 dark:text-white dark:hover:text-white dark:hover:bg-slate-700/20",
        isActive && "text-black bg-sky-200/20 hover:bg-sky-200/20 hover:text-black dark:text-sky-400 dark:bg-sky-400/10 dark:hover:bg-sky-400/10 dark:hover:text-sky-400"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-900 dark:text-white",
            isActive && "text-black dark:text-sky-400"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  )
}
