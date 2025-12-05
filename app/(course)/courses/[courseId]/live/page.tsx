import { redirect } from "next/navigation"
import { Video } from "lucide-react"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { LivePlayer } from "./_components/live-player"
import { MuxLivePlayer } from "./_components/mux-live-player"

const LiveCoursePage = async ({
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
    }
  })

  if (!course) {
    return redirect("/")
  }

  // Manual fetch for new fields
  const rawCourse = await db.$queryRaw<any[]>`
    SELECT "isLive", "liveUrl", "startDate", "muxPlaybackId"
    FROM "Course" 
    WHERE "id" = ${courseId}
  `;
  const extraData = rawCourse[0] || {};
  
  (course as any).isLive = extraData.isLive ?? false;
  (course as any).liveUrl = extraData.liveUrl;
  (course as any).startDate = extraData.startDate;
  (course as any).muxPlaybackId = extraData.muxPlaybackId;

  const isLive = (course as any).isLive
  const liveUrl = (course as any).liveUrl
  const muxPlaybackId = (course as any).muxPlaybackId

  if (!isLive) {
    return redirect(`/courses/${course.id}`)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border bg-slate-100 dark:bg-slate-900 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
        <div className="p-4 bg-indigo-100 dark:bg-indigo-950 rounded-full">
          <Video className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl">
            {course.description || "This is a live streaming session."}
          </p>
        </div>

        <div className="w-full max-w-4xl">
          {muxPlaybackId ? (
             <MuxLivePlayer
               playbackId={muxPlaybackId}
               title={course.title}
             />
          ) : liveUrl ? (
            <LivePlayer
              url={liveUrl}
              title={course.title}
            />
          ) : (
            <div className="w-full p-6 bg-white dark:bg-black border rounded-lg text-center">
              <div className="py-4 text-amber-600 dark:text-amber-500 font-medium">
                Waiting for instructor to provide the live link...
              </div>
            </div>
          )}
        </div>

        {(course as any).startDate && (
          <div className="text-sm text-slate-500">
            Scheduled for: {new Date((course as any).startDate).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveCoursePage
