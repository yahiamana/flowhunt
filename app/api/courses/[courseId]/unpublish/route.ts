import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    })

    if (!course) {
      return new NextResponse("Not found", { status: 404 })
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      }
    })

    return NextResponse.json(unpublishedCourse)
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
