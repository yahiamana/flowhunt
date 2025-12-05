import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { UsersDataTable } from "./_components/data-table"
import { columns } from "./_components/columns"

const AdminUsersPage = async () => {
  const session = await auth()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return redirect("/")
  }

  // Use raw query to ensure we get 'isBanned' even if Prisma Client is stale
  const users: any = await db.$queryRaw`
    SELECT * FROM "User" 
    ORDER BY "createdAt" DESC
  `

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <UsersDataTable columns={columns} data={users} />
    </div>
  )
}

export default AdminUsersPage
