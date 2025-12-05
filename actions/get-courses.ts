import { Category, Course } from "@prisma/client"
import { db } from "@/lib/db"

type GetCourses = {
  title?: string
  categoryId?: string
}

export const getCourses = async ({
  title,
  categoryId
}: GetCourses): Promise<(Course & { category: Category | null; chapters: { id: string }[]; progress: number | null })[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        // In a real app we would calculate progress per user if logged in
        // For public listing, progress is null or 0
        // If we want to show "enrolled" status, we check purchases
        return {
          ...course,
          progress: null, // We'll handle progress in a separate authenticated action or component
        }
      })
    )

    return coursesWithProgress
  } catch (error) {
    console.log("[GET_COURSES]", error)
    return []
  }
}
