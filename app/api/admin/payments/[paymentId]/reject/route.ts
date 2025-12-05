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

    // Update pending purchase status
    await db.pendingPurchase.update({
      where: { id: paymentId },
      data: { 
        status: "REJECTED",
        adminNote: "Payment proof was not verified"
      }
    })

    // Create notification for user
    await db.notification.create({
      data: {
        userId: pendingPurchase.userId,
        title: "Payment Not Verified",
        message: `Your payment for "${pendingPurchase.course.title}" could not be verified. Please contact support or try again.`,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[PAYMENT_REJECT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
