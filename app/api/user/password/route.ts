import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validationResult = passwordSchema.safeParse(body)

    if (!validationResult.success) {
      return new NextResponse(validationResult.error.issues[0].message, { status: 400 })
    }

    const { currentPassword, newPassword } = validationResult.data

    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user || !user.password) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    
    if (!isValidPassword) {
      return new NextResponse("Current password is incorrect", { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      }
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.log("[USER_PASSWORD]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
