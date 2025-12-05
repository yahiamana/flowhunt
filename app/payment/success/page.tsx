import Link from "next/link"
import { CheckCircle, BookOpen, Sparkles, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string
    courseId?: string
  }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId, courseId } = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Congratulations!</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Approved!</h1>
          <p className="text-muted-foreground text-lg">
            You now have full access to the course. Start learning today!
          </p>
        </div>

        {/* Course Access Card */}
        <div className="bg-card rounded-xl border p-6 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-1">Your course is ready!</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Head to your course dashboard to start watching the lessons and track your progress.
              </p>
              {courseId && (
                <Button asChild className="group">
                  <Link href={`/courses/${courseId}`}>
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Order Info */}
        {orderId && (
          <div className="bg-muted/50 rounded-xl p-4 mb-8 text-center">
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          </div>
        )}

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {courseId ? (
            <Button asChild className="flex-1 h-12">
              <Link href={`/courses/${courseId}`}>
                Go to Course
              </Link>
            </Button>
          ) : (
            <Button asChild className="flex-1 h-12">
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="flex-1 h-12">
            <Link href="/dashboard">
              My Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
