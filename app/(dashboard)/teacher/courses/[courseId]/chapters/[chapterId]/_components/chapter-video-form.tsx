"use client"

import * as z from "zod"
import axios from "axios"
import { Pencil, PlusCircle, Video } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Chapter } from "@prisma/client"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "@/components/ui/button"

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: any | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success("Chapter updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  const onUpload = (result: any) => {
    onSubmit({ videoUrl: result.info.secure_url })
  }

  return (
    <div className="mt-6 border bg-card rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-muted rounded-md">
            <Video className="h-10 w-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video
              controls
              className="w-full h-full rounded-md"
              src={initialData.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )
      )}
      {isEditing && (
        <div>
          <CldUploadWidget
            onSuccess={onUpload}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              maxFiles: 1,
              resourceType: "video",
              folder: "course-videos",
              maxFileSize: 500000000,
              sources: ["local", "url", "camera"],
            }}
          >
            {({ open }) => (
              <div 
                onClick={() => open()}
                className="flex flex-col items-center justify-center h-60 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition border-2 border-dashed border-muted-foreground/25"
              >
                <Video className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload a video</p>
                <p className="text-xs text-muted-foreground mt-1">Max size: 500MB</p>
              </div>
            )}
          </CldUploadWidget>
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video. Cloudinary will automatically optimize and deliver via CDN.
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video is ready to play.
        </div>
      )}
    </div>
  )
}
