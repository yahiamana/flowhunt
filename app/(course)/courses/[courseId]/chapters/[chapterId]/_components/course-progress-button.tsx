"use client"

import axios from "axios"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"

interface CourseProgressButtonProps {
  chapterId: string
  courseId: string
  isCompleted?: boolean
  nextChapterId?: string
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted,
      })

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success("Progress updated")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "default"}
      size="lg"
      className="w-full md:w-auto font-semibold"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Updating...
        </>
      ) : isCompleted ? (
        <>
          <XCircle className="h-4 w-4 mr-2" />
          Mark incomplete
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as complete
        </>
      )}
    </Button>
  )
}
