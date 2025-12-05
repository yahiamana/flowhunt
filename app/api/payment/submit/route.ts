import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { courseId, orderId, proofImageUrl } = await req.json()

    if (!courseId || !orderId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Check if already purchased
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    })

    if (existingPurchase) {
      return new NextResponse("Already enrolled", { status: 400 })
    }

    // Check if already has pending purchase
    const existingPending = await db.pendingPurchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    })

    if (existingPending) {
      // Update the existing pending purchase
      await db.pendingPurchase.update({
        where: { id: existingPending.id },
        data: {
          proofImageUrl,
          status: "PENDING",
          orderId,
        }
      })
    } else {
      // Check course capacity
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          purchases: true,
          pendingPurchases: {
            where: { status: "PENDING" }
          }
        }
      })

      if (course?.maxCapacity) {
        const currentEnrolled = course.purchases.length
        const pendingCount = course.pendingPurchases.length
        if (currentEnrolled + pendingCount >= course.maxCapacity) {
          return new NextResponse("Course is at full capacity", { status: 400 })
        }
      }

      // Create pending purchase
      await db.pendingPurchase.create({
        data: {
          userId,
          courseId,
          orderId,
          proofImageUrl,
          status: "PENDING",
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[PAYMENT_SUBMIT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
