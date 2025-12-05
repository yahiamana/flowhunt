"use client"

import * as z from "zod"
import axios from "axios"
import { PlusCircle, File, Loader2, X, FileIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Attachment, Course } from "@prisma/client"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "@/components/ui/button"

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1),
})

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success("Course updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast.success("Attachment deleted")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  const onUpload = (result: any) => {
    onSubmit({ url: result.info.secure_url })
  }

  return (
    <div className="mt-6 border bg-card rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-muted-foreground italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {initialData.attachments.map((attachment: Attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-primary/10 border-primary/20 border text-primary rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <CldUploadWidget
            onSuccess={onUpload}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              maxFiles: 1,
              resourceType: "auto",
              folder: "course-attachments",
            }}
          >
            {({ open }) => (
              <div 
                onClick={() => open()}
                className="flex flex-col items-center justify-center h-40 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition border-2 border-dashed border-muted-foreground/25 mt-2"
              >
                <FileIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload a file</p>
              </div>
            )}
          </CldUploadWidget>
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  )
}
