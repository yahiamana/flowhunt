import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { authLimiter } from "@/lib/rate-limit"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    try {
      await authLimiter.check(5, ip) // 5 requests per minute per IP
    } catch {
      return new NextResponse("Too many requests", { status: 429 })
    }

    const body = await req.json()
    
    // Input validation
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return new NextResponse(validationResult.error.issues[0].message, { status: 400 })
    }

    const { name, email, password } = validationResult.data

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log("[REGISTER]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
