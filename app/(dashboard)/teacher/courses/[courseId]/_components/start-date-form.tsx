"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface StartDateFormProps {
  initialData: {
    startDate: Date | null
  }
  courseId: string
}

const formSchema = z.object({
  startDate: z.string().min(1, {
    message: "Start date is required",
  }),
})

export const StartDateForm = ({
  initialData,
  courseId
}: StartDateFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : ""
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert string date back to ISO DateTime for Prisma
      const payload = {
        startDate: new Date(values.startDate).toISOString()
      }
      
      await axios.patch(`/api/courses/${courseId}`, payload)
      toast.success("Start date updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course start date
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit date
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={!initialData.startDate ? "text-slate-500 italic text-sm mt-2" : "text-sm mt-2"}>
          {initialData.startDate 
            ? new Date(initialData.startDate).toLocaleDateString() 
            : "No start date set"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isSubmitting}
                      className="bg-white dark:bg-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
