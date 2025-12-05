import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { DataTable } from "@/app/(dashboard)/teacher/courses/_components/data-table"
import { columns } from "@/app/(dashboard)/teacher/courses/_components/columns"

const AdminCoursesPage = async () => {
  const session = await auth()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return redirect("/")
  }

  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default AdminCoursesPage
