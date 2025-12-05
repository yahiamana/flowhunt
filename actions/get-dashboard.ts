import { Category, Chapter, Course } from "@prisma/client"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

type CourseWithProgressWithCategory = Course & {
  category: Category
  chapters: Chapter[]
  progress: number | null
}

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[]
  coursesInProgress: CourseWithProgressWithCategory[]
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    })

    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[]

    for (let course of courses) {
      const progress = await getProgress(userId, course.id)
      course["progress"] = progress
    }

    const completedCourses = courses.filter((course) => course.progress === 100)
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100)

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error)
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}

const getProgress = async (userId: string, courseId: string): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    })

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    })

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100

    return progressPercentage
  } catch (error) {
    console.log("[GET_PROGRESS]", error)
    return 0
  }
}
