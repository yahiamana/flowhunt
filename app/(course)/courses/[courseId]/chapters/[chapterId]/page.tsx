import { redirect } from "next/navigation"
import { File, BookOpen, Clock, Award, Download, ChevronRight } from "lucide-react"

import { getChapter } from "@/actions/get-chapter"
import { Banner } from "@/components/banner"
import { Preview } from "@/components/preview"
import { VideoPlayer } from "@/components/video-player"
import { CourseEnrollButton } from "./_components/course-enroll-button"
import { CourseProgressButton } from "./_components/course-progress-button"
import { auth } from "@/lib/auth"

const ChapterIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const { courseId, chapterId } = await params
  const session = await auth()
  const userId = (session?.user as any)?.id

  if (!userId) {
    return redirect("/")
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  }) as any;

  if (!chapter || !course) {
    return redirect("/")
  }

  const isLocked = !chapter.isFree && !purchase
  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div className="min-h-screen bg-background">
      {/* Status Banners */}
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              chapterId={chapterId}
              title={chapter.title}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
              videoUrl={chapter.videoUrl || undefined}
            />

            {/* Chapter Info */}
            <div className="bg-card rounded-xl border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Chapter</p>
                    <h1 className="text-2xl font-bold">{chapter.title}</h1>
                  </div>
                  <div className="shrink-0">
                    {purchase ? (
                      <CourseProgressButton
                        chapterId={chapterId}
                        courseId={courseId}
                        nextChapterId={nextChapter?.id}
                        isCompleted={!!userProgress?.isCompleted}
                      />
                    ) : (
                      <CourseEnrollButton
                        courseId={courseId}
                        price={course.price!}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <h2 className="font-semibold mb-4">About this chapter</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                  <Preview value={chapter.description || ""} />
                </div>
              </div>

              {/* Attachments */}
              {!!attachments.length && (
                <div className="p-6 border-t">
                  <h2 className="font-semibold mb-4">Resources</h2>
                  <div className="space-y-2">
                    {attachments.map((attachment: any) => (
                      <a
                        href={attachment.url}
                        key={attachment.id}
                        target="_blank"
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition"
                      >
                        <File className="h-5 w-5 text-muted-foreground" />
                        <span className="flex-1 truncate">{attachment.name}</span>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            {purchase && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={userProgress?.isCompleted ? "text-primary font-medium" : "text-muted-foreground"}>
                      {userProgress?.isCompleted ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: userProgress?.isCompleted ? "100%" : "50%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Enroll Card */}
            {!purchase && (
              <div className="bg-card rounded-xl border p-6">
                <div className="text-center space-y-4">
                  <h3 className="font-bold text-lg">Unlock Full Course</h3>
                  <p className="text-sm text-muted-foreground">
                    Get lifetime access to all chapters and resources
                  </p>
                  <CourseEnrollButton
                    courseId={courseId}
                    price={course.price!}
                  />
                </div>
              </div>
            )}

            {/* Next Chapter */}
            {nextChapter && purchase && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4">Up Next</h3>
                <a 
                  href={`/courses/${courseId}/chapters/${nextChapter.id}`}
                  className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition"
                >
                  <p className="font-medium line-clamp-2">{nextChapter.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    Continue <ChevronRight className="h-4 w-4" />
                  </p>
                </a>
              </div>
            )}

            {/* Features */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="font-semibold mb-4">What you get</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4" />
                  <span>Full course access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4" />
                  <span>Downloadable resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage
