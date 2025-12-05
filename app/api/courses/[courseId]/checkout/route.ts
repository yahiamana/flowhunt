import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createBinancePayOrder } from "@/lib/binance-pay"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()
    const user = session?.user as any

    if (!user || !user.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      }
    })

    if (!course) {
      return new NextResponse("Not found", { status: 404 })
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      }
    })

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 })
    }

    if (!course.price || course.price === 0) {
      // Free course - create purchase directly
      await db.purchase.create({
        data: {
          userId: user.id,
          courseId: courseId,
        }
      })
      return NextResponse.json({ url: `/courses/${courseId}` })
    }

    // Generate unique order ID
    const merchantTradeNo = `COURSE_${courseId}_${user.id}_${Date.now()}`
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Check if Binance Pay credentials are configured
    if (!process.env.BINANCE_PAY_API_KEY || !process.env.BINANCE_PAY_API_SECRET) {
      // Fallback to payment page for manual/demo payment
      const paymentUrl = `/payment/checkout?courseId=${courseId}&orderId=${merchantTradeNo}&price=${course.price}&title=${encodeURIComponent(course.title)}`
      return NextResponse.json({ url: paymentUrl })
    }

    // Create Binance Pay order
    const order = await createBinancePayOrder({
      merchantTradeNo,
      orderAmount: course.price,
      currency: "USDT",
      goods: {
        goodsType: "02", // Virtual goods
        goodsCategory: "Z000", // Others
        referenceGoodsId: courseId,
        goodsName: course.title,
      },
      returnUrl: `${appUrl}/payment/success?orderId=${merchantTradeNo}&courseId=${courseId}`,
      cancelUrl: `${appUrl}/payment/cancel?courseId=${courseId}`,
      webhookUrl: `${appUrl}/api/webhooks/binance`,
    })

    if (!order) {
      return new NextResponse("Failed to create payment order", { status: 500 })
    }

    return NextResponse.json({ url: order.checkoutUrl })

  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
