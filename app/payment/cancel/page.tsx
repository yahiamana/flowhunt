import Link from "next/link"
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CancelPageProps {
  searchParams: Promise<{
    courseId?: string
  }>
}

export default async function CancelPage({ searchParams }: CancelPageProps) {
  const { courseId } = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Not Completed</h1>
          <p className="text-muted-foreground text-lg">
            Your payment was cancelled or could not be verified.
          </p>
        </div>

        {/* Options */}
        <div className="bg-card rounded-xl border p-6 shadow-sm mb-8">
          <h2 className="font-semibold text-lg mb-4">What would you like to do?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Try Again</h3>
                <p className="text-sm text-muted-foreground">
                  Go back and complete your payment with correct details
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition cursor-pointer">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  If you believe this is an error, reach out to our team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-3">Common issues:</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Payment proof image was unclear or unreadable</li>
            <li>• Transaction amount didn&apos;t match the course price</li>
            <li>• Payment was sent to wrong wallet address</li>
            <li>• Wrong network used (must be TRC20)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {courseId ? (
            <Button asChild className="flex-1 h-12">
              <Link href={`/courses/${courseId}`}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
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
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
