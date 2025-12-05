import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { CourseSidebarItem } from "./course-sidebar-item"
import { CourseProgress } from "@/components/course-progress"

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/")
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  })

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-card">
      {/* Course Header */}
      <div className="p-6 border-b bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-lg leading-tight line-clamp-2">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {course.chapters.length} chapters
            </p>
          </div>
        </div>
        
        {/* Progress */}
        {purchase && (
          <div className="mt-4">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      
      {/* Chapter List */}
      <div className="flex flex-col w-full py-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">
          Chapters
        </p>
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}
