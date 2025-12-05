import { getCourses } from "@/actions/get-courses"
import { CoursesList } from "@/components/courses-list"
import { SearchInput } from "@/components/search-input"
import { db } from "@/lib/db"

interface CoursesPageProps {
  searchParams: Promise<{
    title?: string
    categoryId?: string
  }>
}

export default async function CoursesPage({
  searchParams
}: CoursesPageProps) {
  const { title, categoryId } = await searchParams
  
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const courses = await getCourses({
    title,
    categoryId
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Browse Courses</h1>
        <SearchInput />
      </div>
      <div className="flex gap-x-2 overflow-x-auto pb-2">
        {/* Categories would go here */}
      </div>
      <CoursesList items={courses} />
    </div>
  )
}
