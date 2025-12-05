import { db } from "@/lib/db"

export const checkIsBanned = async (userId: string): Promise<boolean> => {
  try {
    // Use raw query to bypass potential Prisma schema mismatch during dev hot-reloads
    const result: any[] = await db.$queryRaw`SELECT "isBanned" FROM "User" WHERE "id" = ${userId}`
    
    if (result && result.length > 0) {
      return result[0].isBanned === true
    }
    
    return false
  } catch (error) {
    console.error("[BAN_CHECK]", error)
    return false // Default to not banned on error to avoid locking everyone out if DB fails
  }
}
