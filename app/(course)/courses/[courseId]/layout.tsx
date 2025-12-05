import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { CourseSidebar } from "./_components/course-sidebar"
import { CourseNavbar } from "./_components/course-navbar"
import { ContentProtection } from "@/components/content-protection"
import { checkIsBanned } from "@/lib/ban-check"

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ courseId: string }>
}) => {
  const { courseId } = await params
  const session = await auth()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return redirect("/")
  }

  const isBanned = await checkIsBanned(userId)
  if (isBanned) {
    return redirect("/sign-in")
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            }
          }
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  })

  if (!course) {
    return redirect("/")
  }

  const progressCount = await db.userProgress.count({
    where: {
      userId,
      chapterId: {
        in: course.chapters.map((chapter) => chapter.id),
      },
      isCompleted: true,
    },
  })

  // Calculate progress percentage
  const progress = course.chapters.length > 0 
    ? (progressCount / course.chapters.length) * 100 
    : 0

  return (
    <ContentProtection>
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar
            course={course}
            progressCount={progress}
          />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar
            course={course}
            progressCount={progress}
          />
        </div>
        <main className="md:pl-80 pt-[80px] h-full">
          {children}
        </main>
      </div>
    </ContentProtection>
  )
}

export default CourseLayout
