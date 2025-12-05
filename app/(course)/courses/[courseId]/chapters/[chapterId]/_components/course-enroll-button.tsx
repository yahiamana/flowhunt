"use client"

import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

interface CourseEnrollButtonProps {
  price: number
  courseId: string
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`/api/courses/${courseId}/checkout`)
      window.location.assign(response.data.url)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className="w-full md:w-auto font-semibold"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>Enroll for {formatPrice(price)} USDT</>
      )}
    </Button>
  )
}
