import Link from "next/link"
import { Clock, CheckCircle, BookOpen, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PendingPageProps {
  searchParams: Promise<{
    courseId?: string
  }>
}

export default async function PendingPage({ searchParams }: PendingPageProps) {
  const { courseId } = await searchParams

  const steps = [
    {
      icon: CheckCircle,
      title: "Payment Submitted",
      description: "Your payment proof has been received",
      status: "complete"
    },
    {
      icon: Clock,
      title: "Under Review",
      description: "Admin is verifying your payment",
      status: "current"
    },
    {
      icon: Bell,
      title: "Get Notified",
      description: "You'll receive a notification once approved",
      status: "pending"
    },
    {
      icon: BookOpen,
      title: "Start Learning",
      description: "Access your course content",
      status: "pending"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Under Review</h1>
          <p className="text-muted-foreground text-lg">
            You&apos;re on the waitlist! We&apos;ll notify you once approved.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-card rounded-xl border p-6 shadow-sm mb-8">
          <h2 className="font-semibold text-lg mb-6">What happens next?</h2>
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                {/* Vertical line and icon */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    step.status === 'complete' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : step.status === 'current'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 ring-2 ring-yellow-500/20'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      step.status === 'complete' ? 'bg-green-500' : 'bg-muted'
                    }`} />
                  )}
                </div>
                
                {/* Content */}
                <div className="pb-8">
                  <h3 className={`font-medium ${
                    step.status === 'pending' ? 'text-muted-foreground' : ''
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-2">Need help?</h3>
          <p className="text-sm text-muted-foreground">
            If your payment isn&apos;t approved within 24 hours, please contact our support team with your order details.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 h-12">
            <Link href="/courses">
              Browse Other Courses
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 h-12">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
