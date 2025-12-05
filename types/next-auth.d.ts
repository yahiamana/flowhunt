import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  id: string
  role: Role
  isBanned: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
