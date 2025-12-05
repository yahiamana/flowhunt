"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export const toggleBan = async (userId: string) => {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role

    if (userRole !== "ADMIN") {
      throw new Error("Unauthorized")
    }

    // Use executeRaw to bypass stale Prisma Client types (dev server lock issue)
    await db.$executeRaw`UPDATE "User" SET "isBanned" = NOT "isBanned" WHERE "id" = ${userId}`

    const updatedUser = await db.user.findUnique({
      where: { id: userId }
    })

    revalidatePath("/admin/users")
    return updatedUser
  } catch (error) {
    console.error("[TOGGLE_BAN_ERROR]", error)
    throw new Error("Internal Error: " + (error as Error).message)
  }
}
