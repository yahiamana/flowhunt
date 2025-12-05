"use client"

import { CheckCircle, Lock, PlayCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

interface CourseSidebarItemProps {
  label: string
  id: string
  isCompleted: boolean
  courseId: string
  isLocked: boolean
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle)
  const isActive = pathname?.includes(id)

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`)
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-3 text-muted-foreground text-sm font-medium px-6 py-3 transition-all hover:text-foreground hover:bg-muted/50 w-full text-left",
        isActive && "text-foreground bg-muted hover:bg-muted",
        isCompleted && "text-primary",
        isCompleted && isActive && "bg-primary/5"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-md",
        isLocked && "bg-muted",
        isCompleted && "bg-primary/10",
        isActive && !isCompleted && !isLocked && "bg-muted"
      )}>
        <Icon
          size={16}
          className={cn(
            "text-muted-foreground",
            isActive && "text-foreground",
            isCompleted && "text-primary",
            isLocked && "text-muted-foreground"
          )}
        />
      </div>
      <span className="line-clamp-1 flex-1">{label}</span>
      {isActive && (
        <div className="w-1 h-6 bg-primary rounded-full" />
      )}
    </button>
  )
}
