import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, PlayCircle, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Master the Skills of the <span className="text-primary">Future</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Join the elite bootcamp platform designed for serious learners. 
            Secure, premium, and instructor-led courses to accelerate your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Browse Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <PlayCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Premium Video Content</h3>
              <p className="text-muted-foreground">
                High-quality video lessons with secure streaming. No downloads, just pure learning.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and course content are protected with enterprise-grade security.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Certified Learning</h3>
              <p className="text-muted-foreground">
                Track your progress and earn recognition for your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are transforming their careers with HUNT.
          </p>
          <Link href="/sign-up">
            <Button variant="secondary" size="lg" className="mt-4">
              Join Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
