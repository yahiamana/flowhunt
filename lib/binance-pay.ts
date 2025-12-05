import crypto from "crypto"

const BINANCE_PAY_API_KEY = process.env.BINANCE_PAY_API_KEY || ""
const BINANCE_PAY_API_SECRET = process.env.BINANCE_PAY_API_SECRET || ""
const BINANCE_PAY_API_URL = "https://bpay.binanceapi.com"

interface CreateOrderParams {
  merchantTradeNo: string
  orderAmount: number
  currency: string
  goods: {
    goodsType: string
    goodsCategory: string
    referenceGoodsId: string
    goodsName: string
  }
  returnUrl: string
  cancelUrl: string
  webhookUrl?: string
}

interface BinancePayOrder {
  prepayId: string
  terminalType: string
  expireTime: number
  qrcodeLink: string
  qrContent: string
  checkoutUrl: string
  deeplink: string
  universalUrl: string
}

// Generate nonce string
function generateNonce(length: number = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate signature for Binance Pay API
function generateSignature(timestamp: number, nonce: string, body: string): string {
  const payload = `${timestamp}\n${nonce}\n${body}\n`
  return crypto
    .createHmac("sha512", BINANCE_PAY_API_SECRET)
    .update(payload)
    .digest("hex")
    .toUpperCase()
}

// Create a Binance Pay order
export async function createBinancePayOrder(params: CreateOrderParams): Promise<BinancePayOrder | null> {
  const timestamp = Date.now()
  const nonce = generateNonce()
  
  const requestBody = {
    env: {
      terminalType: "WEB"
    },
    merchantTradeNo: params.merchantTradeNo,
    orderAmount: params.orderAmount.toFixed(2),
    currency: params.currency,
    goods: params.goods,
    returnUrl: params.returnUrl,
    cancelUrl: params.cancelUrl,
    webhookUrl: params.webhookUrl,
  }

  const bodyString = JSON.stringify(requestBody)
  const signature = generateSignature(timestamp, nonce, bodyString)

  try {
    const response = await fetch(`${BINANCE_PAY_API_URL}/binancepay/openapi/v2/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": timestamp.toString(),
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": BINANCE_PAY_API_KEY,
        "BinancePay-Signature": signature,
      },
      body: bodyString,
    })

    const data = await response.json()
    
    if (data.status === "SUCCESS") {
      return data.data as BinancePayOrder
    }
    
    console.error("[BINANCE_PAY_ERROR]", data)
    return null
  } catch (error) {
    console.error("[BINANCE_PAY_ERROR]", error)
    return null
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  timestamp: string,
  nonce: string,
  body: string,
  signature: string
): boolean {
  const expectedSignature = generateSignature(parseInt(timestamp), nonce, body)
  return expectedSignature === signature
}

// Query order status
export async function queryOrderStatus(merchantTradeNo: string): Promise<any> {
  const timestamp = Date.now()
  const nonce = generateNonce()
  
  const requestBody = {
    merchantTradeNo
  }

  const bodyString = JSON.stringify(requestBody)
  const signature = generateSignature(timestamp, nonce, bodyString)

  try {
    const response = await fetch(`${BINANCE_PAY_API_URL}/binancepay/openapi/v2/order/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": timestamp.toString(),
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": BINANCE_PAY_API_KEY,
        "BinancePay-Signature": signature,
      },
      body: bodyString,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[BINANCE_PAY_QUERY_ERROR]", error)
    return null
  }
}
