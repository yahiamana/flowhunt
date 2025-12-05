"use client"

import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary"
import { useCallback } from "react"
import { Video, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface VideoUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  value?: string | null
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  disabled,
  onChange,
  value
}) => {
  const onUpload = useCallback((result: any) => {
    onChange(result.info.secure_url)
  }, [onChange])

  return (
    <div>
      {value && (
        <div className="mb-4 relative aspect-video rounded-md overflow-hidden">
          <CldVideoPlayer
            width="1920"
            height="1080"
            src={value}
            className="w-full"
          />
        </div>
      )}
      <CldUploadWidget
        onClose={() => {}}
        onSuccess={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFiles: 1,
          resourceType: "video",
          maxFileSize: 500000000, // 500MB max
          sources: ["local", "url"],
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <Video className="h-4 w-4 mr-2" />
              {value ? "Change Video" : "Upload a Video"}
            </Button>
          )
        }}
      </CldUploadWidget>
      <p className="text-xs text-muted-foreground mt-2">
        Upload videos up to 500MB. Cloudinary will automatically optimize and deliver via CDN.
      </p>
    </div>
  )
}
