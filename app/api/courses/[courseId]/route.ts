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
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Isolate new fields that might not be in the stale Prisma Client
    const { isLive, liveUrl, startDate, ...legacyValues } = values

    let course;

    // 1. Update legacy fields (if any)
    if (Object.keys(legacyValues).length > 0) {
      course = await db.course.update({
        where: {
          id: courseId,
          userId
        },
        data: {
          ...legacyValues,
        }
      })
    } else {
      // If no legacy fields, just fetch the course to return it later and ensure permission
       course = await db.course.findUnique({
        where: { id: courseId, userId }
       })
    }

    // 2. Update new fields using Raw SQL if present (bypass stale client validation)
    if (isLive !== undefined) {
      await db.$executeRaw`UPDATE "Course" SET "isLive" = ${isLive} WHERE "id" = ${courseId}`
      // Manually patch returned object for UI consistency
      if (course) (course as any).isLive = isLive
    }

    if (liveUrl !== undefined) {
      await db.$executeRaw`UPDATE "Course" SET "liveUrl" = ${liveUrl} WHERE "id" = ${courseId}`
      if (course) (course as any).liveUrl = liveUrl
    }
    
    if (startDate !== undefined) {
       console.log("Updating startDate:", startDate)
       if (startDate === null) {
          await db.$executeRaw`UPDATE "Course" SET "startDate" = NULL WHERE "id" = ${courseId}`
       } else {
          // Force ISO string and cast to timestamp for PG
          const dateStr = new Date(startDate).toISOString();
          console.log("Date String:", dateStr)
          await db.$executeRaw`UPDATE "Course" SET "startDate" = ${dateStr}::timestamp WHERE "id" = ${courseId}`
       }
       if (course) (course as any).startDate = startDate
    }

    // If we only did raw updates, we might want to re-fetch or just return the modified object.
    // The UI usually refreshes via router.refresh() anyway.
    
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
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
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    })

    if (!course) {
      return new NextResponse("Not found", { status: 404 })
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    })

    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
