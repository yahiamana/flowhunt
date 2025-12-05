import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await db.user.findUnique({ where: { email } })
          if (!user || !user.password) return null
          // Check if user is banned (use any cast due to stale types if needed, but isBanned fits Prisma schema)
          if ((user as any).isBanned) {
            throw new Error("This account has been banned.")
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              isBanned: (user as any).isBanned,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
        token.isBanned = (user as any).isBanned
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as any).id = token.sub
      }
      if (token.role && session.user) {
        (session.user as any).role = token.role
      }
      if (session.user) {
        (session.user as any).isBanned = token.isBanned
      }
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
  },
}

export const auth = () => getServerSession(authOptions)
