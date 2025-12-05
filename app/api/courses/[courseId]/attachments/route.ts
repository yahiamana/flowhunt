import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()
    const userId = (session?.user as any)?.id
    const { url } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      }
    })

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: courseId,
      }
    })

    return NextResponse.json(attachment)
  } catch (error) {
    console.log("[COURSE_ID_ATTACHMENTS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
