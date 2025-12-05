"use client"

import * as z from "zod"
import axios from "axios"
import { Pencil, PlusCircle, ImageIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CldUploadWidget, CldImage } from "next-cloudinary"

import { Button } from "@/components/ui/button"

interface ImageFormProps {
  initialData: {
    imageUrl: string | null
  }
  courseId: string
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
})

export const ImageForm = ({
  initialData,
  courseId
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success("Course updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  const onUpload = (result: any) => {
    onSubmit({ imageUrl: result.info.secure_url })
  }

  // Extract public_id from Cloudinary URL for CldImage
  const getPublicId = (url: string) => {
    if (!url) return ""
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
    return match ? match[1] : url
  }

  return (
    <div className="mt-6 border bg-card rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-muted rounded-md">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <CldImage
              alt="Course image"
              fill
              className="object-cover rounded-md"
              src={getPublicId(initialData.imageUrl)}
            />
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
              resourceType: "image",
              folder: "courses",
            }}
          >
            {({ open }) => (
              <div 
                onClick={() => open()}
                className="flex flex-col items-center justify-center h-60 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition border-2 border-dashed border-muted-foreground/25"
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload an image</p>
              </div>
            )}
          </CldUploadWidget>
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}
