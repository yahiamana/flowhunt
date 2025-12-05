import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name, email } = await req.json()

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await db.user.findFirst({
        where: {
          email,
          NOT: { id: userId }
        }
      })

      if (existingUser) {
        return new NextResponse("Email already in use", { status: 400 })
      }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log("[USER_PROFILE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
