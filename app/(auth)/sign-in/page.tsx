"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react" // Client side sign in
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    
    // We use next-auth/react signIn for client-side
    // But since we are using Auth.js v5 with server actions preferred, 
    // we can also use a server action. For now, let's use the client helper 
    // which calls the API route created by NextAuth.
    // Wait, I haven't created the API route yet! 
    // I need to create app/api/auth/[...nextauth]/route.ts
    
    // Actually, with v5, we can use server actions directly or the route handler.
    // I'll use the route handler for compatibility with client components.
    
    try {
        // This is a placeholder until I set up the route handler
        // But wait, I defined `auth` in `lib/auth.ts` but didn't expose the route.
        // I need to create `app/api/auth/[...nextauth]/route.ts`
        
        // For now, let's assume the route exists.
        // Actually, I'll implement the login logic using a server action to be more "Next.js 15/16" style
        // But `signIn` from `next-auth/react` is convenient.
        
        // Let's use a server action wrapper if possible, or just standard signIn.
        // Standard signIn:
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })

        if (result?.error) {
            toast.error("Invalid credentials")
        } else {
            toast.success("Logged in!")
            router.push("/dashboard")
            router.refresh()
        }
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Enter your email and password to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Log in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? <Link href="/sign-up" className="text-primary hover:underline">Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
