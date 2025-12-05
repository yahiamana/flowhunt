import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Plus } from "lucide-react"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"

const CoursesPage = async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/")
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">
              Manage and create your courses
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/teacher/create">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Link>
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  )
}

export default CoursesPage
