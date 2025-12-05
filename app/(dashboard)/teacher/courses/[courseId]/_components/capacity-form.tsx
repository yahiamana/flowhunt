"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Pencil, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface CapacityFormProps {
  initialData: {
    maxCapacity: number | null
  }
  courseId: string
}

const formSchema = z.object({
  maxCapacity: z.coerce.number().min(1).nullable(),
})

export const CapacityForm = ({
  initialData,
  courseId
}: CapacityFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      maxCapacity: initialData.maxCapacity ?? null
    },
  })

  const { isSubmitting, isValid } = form.formState

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

  return (
    <div className="mt-6 border bg-card rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Users className="h-4 w-4" />
          Course capacity
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit capacity
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.maxCapacity && "text-muted-foreground italic"
        )}>
          {initialData.maxCapacity
            ? `${initialData.maxCapacity} students max`
            : "Unlimited capacity"
          }
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
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isSubmitting}
                      placeholder="Enter max students (leave empty for unlimited)"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? null : parseInt(value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Set maximum number of students who can enroll. Leave empty for unlimited.
                  </FormDescription>
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
