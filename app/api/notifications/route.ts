import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.log("[NOTIFICATIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
