"use client"

import { CldUploadWidget, CldImage } from "next-cloudinary"
import { useCallback } from "react"
import { ImagePlus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

declare global {
  var cloudinary: any
}

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const onUpload = useCallback((result: any) => {
    onChange(result.info.secure_url)
  }, [onChange])

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CldImage
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onClose={() => {}}
        onSuccess={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFiles: 1,
          resourceType: "image",
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
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
