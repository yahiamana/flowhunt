import { redirect } from "next/navigation"
import { CircleDollarSign, File, LayoutDashboard, ListChecks, Users } from "lucide-react"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { IconBadge } from "@/components/icon-badge"
import { Banner } from "@/components/banner"

import { TitleForm } from "./_components/title-form"
import { DescriptionForm } from "./_components/description-form"
import { ImageForm } from "./_components/image-form"
import { CategoryForm } from "./_components/category-form"
import { PriceForm } from "./_components/price-form"
import { StartDateForm } from "./_components/start-date-form"
import { IsLiveForm } from "./_components/is-live-form"
import { MuxLiveForm } from "./_components/mux-live-form"
import { LiveUrlForm } from "./_components/live-url-form"
import { ChaptersForm } from "./_components/chapters-form"
import { Actions } from "./_components/actions"
import { CapacityForm } from "./_components/capacity-form"

const CourseIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string }>
}) => {
  const { courseId } = await params
  const session = await auth()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return redirect("/")
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  if (!course) {
    return redirect("/")
  }

  // WORKAROUND: Fetch new fields via raw SQL because Prisma Client is locked/stale
  const rawCourse = await db.$queryRaw<any[]>`
    SELECT "isLive", "liveUrl", "startDate", "muxLiveStreamId", "muxPlaybackId", "muxStreamKey"
    FROM "Course" 
    WHERE "id" = ${courseId}
  `;

  const extraData = rawCourse[0] || {};
  (course as any).isLive = extraData.isLive ?? false; // Postgres returns boolean for boolean
  (course as any).liveUrl = extraData.liveUrl;
  (course as any).startDate = extraData.startDate;
  (course as any).muxLiveStreamId = extraData.muxLiveStreamId;
  (course as any).muxPlaybackId = extraData.muxPlaybackId;
  (course as any).muxStreamKey = extraData.muxStreamKey;

  const isLive = (course as any).isLive

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    (course as any).startDate,
    (course as any).maxCapacity,
    isLive ? ((course as any).muxPlaybackId || (course as any).liveUrl) : course.chapters.some(chapter => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Customize your course
              </h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Course content
                </h2>
              </div>
              <IsLiveForm
                initialData={course as any}
                courseId={course.id}
              />
              {isLive ? (
                <div>
                  <MuxLiveForm
                    initialData={course as any}
                    courseId={course.id}
                  />
                  <div className="mt-6">
                    <LiveUrlForm
                      initialData={course as any}
                      courseId={course.id}
                    />
                  </div>
                </div>
              ) : (
                <ChaptersForm
                  initialData={course}
                  courseId={course.id}
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">
                  Sell your course
                </h2>
              </div>
              <PriceForm
                initialData={course}
                courseId={course.id}
              />
              <CapacityForm
                initialData={course}
                courseId={course.id}
              />
              <StartDateForm
                initialData={course as any}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage

