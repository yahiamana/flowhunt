"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface IsLiveFormProps {
  initialData: {
    isLive: boolean
  }
  courseId: string
}

const formSchema = z.object({
  isLive: z.boolean().default(false),
})

export const IsLiveForm = ({
  initialData,
  courseId
}: IsLiveFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isLive: !!initialData.isLive
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success("Course mode updated")
      setIsEditing(false)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
      <div className="font-medium mb-4">
        Course Mode
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="isLive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-white dark:bg-black">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Live Streaming Course
                  </FormLabel>
                  <FormDescription>
                    Enable this to stream live content instead of using pre-recorded chapters.
                  </FormDescription>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      // Auto-submit on toggle for better UX, or wait for save?
                      // Let's rely on explicit save button or auto-submit. 
                      // If we want instant toggle:
                      form.handleSubmit(onSubmit)()
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
