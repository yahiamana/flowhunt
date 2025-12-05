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

    const { courseId, orderId } = await req.json()

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
      return NextResponse.json({ url: `/courses/${courseId}` })
    }

    // In production, you would verify the payment here by:
    // 1. Checking blockchain transaction
    // 2. Querying Binance Pay API
    // 3. Checking your payment records
    
    // For now, we'll create a pending state or you can add manual admin approval
    // This is a simplified flow - in production, use webhooks for payment confirmation

    // Create the purchase
    await db.purchase.create({
      data: {
        userId,
        courseId,
      }
    })

    return NextResponse.json({ url: `/courses/${courseId}` })
  } catch (error) {
    console.log("[PAYMENT_CONFIRM]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
