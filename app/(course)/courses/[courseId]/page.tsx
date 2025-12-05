import { redirect } from "next/navigation"

import { db } from "@/lib/db"

const CourseIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string }>
}) => {
  const { courseId } = await params
  
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
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

  const rawCourse = await db.$queryRaw<any[]>`SELECT "isLive" FROM "Course" WHERE "id" = ${courseId}`;
  const isLive = rawCourse[0]?.isLive ?? false;
  (course as any).isLive = isLive;

  if (isLive) {
    return redirect(`/courses/${course.id}/live`)
  }

  if (course.chapters.length === 0) {
    return redirect("/")
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}

export default CourseIdPage
