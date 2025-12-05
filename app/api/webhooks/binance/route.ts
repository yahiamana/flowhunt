import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { verifyWebhookSignature } from "@/lib/binance-pay"

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const body = await req.text()
    
    const timestamp = headersList.get("BinancePay-Timestamp") || ""
    const nonce = headersList.get("BinancePay-Nonce") || ""
    const signature = headersList.get("BinancePay-Signature") || ""

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(timestamp, nonce, body, signature)
    
    if (!isValid) {
      console.log("[BINANCE_WEBHOOK] Invalid signature")
      return new NextResponse("Invalid signature", { status: 400 })
    }

    const data = JSON.parse(body)
    
    // Handle payment success
    if (data.bizStatus === "PAY_SUCCESS") {
      const merchantTradeNo = data.data?.merchantTradeNo
      
      if (merchantTradeNo) {
        // Parse order ID: COURSE_{courseId}_{userId}_{timestamp}
        const parts = merchantTradeNo.split("_")
        if (parts.length >= 3 && parts[0] === "COURSE") {
          const courseId = parts[1]
          const userId = parts[2]

          // Check if purchase already exists
          const existingPurchase = await db.purchase.findUnique({
            where: {
              userId_courseId: {
                userId,
                courseId,
              }
            }
          })

          if (!existingPurchase) {
            // Create the purchase
            await db.purchase.create({
              data: {
                userId,
                courseId,
              }
            })
            console.log(`[BINANCE_WEBHOOK] Purchase created for user ${userId}, course ${courseId}`)
          }
        }
      }
    }

    return NextResponse.json({ returnCode: "SUCCESS", returnMessage: null })
  } catch (error) {
    console.log("[BINANCE_WEBHOOK_ERROR]", error)
    return new NextResponse("Webhook error", { status: 500 })
  }
}
