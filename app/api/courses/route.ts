import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    const body = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const validationResult = courseSchema.safeParse(body)
    if (!validationResult.success) {
      return new NextResponse(validationResult.error.issues[0].message, { status: 400 })
    }

    const { title } = validationResult.data

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
