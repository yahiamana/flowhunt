import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params
    const session = await auth()
    const user = session?.user as any

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const pendingPurchase = await db.pendingPurchase.findUnique({
      where: { id: paymentId },
      include: {
        course: true,
      }
    })

    if (!pendingPurchase) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Check course capacity
    if (pendingPurchase.course.maxCapacity) {
      const currentEnrolled = await db.purchase.count({
        where: { courseId: pendingPurchase.courseId }
      })

      if (currentEnrolled >= pendingPurchase.course.maxCapacity) {
        return new NextResponse("Course is at full capacity", { status: 400 })
      }
    }

    // Create the actual purchase
    await db.purchase.create({
      data: {
        userId: pendingPurchase.userId,
        courseId: pendingPurchase.courseId,
      }
    })

    // Update pending purchase status
    await db.pendingPurchase.update({
      where: { id: paymentId },
      data: { status: "APPROVED" }
    })

    // Create notification for user
    await db.notification.create({
      data: {
        userId: pendingPurchase.userId,
        title: "Payment Approved! 🎉",
        message: `Your payment for "${pendingPurchase.course.title}" has been approved. You can now access the course.`,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[PAYMENT_APPROVE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
