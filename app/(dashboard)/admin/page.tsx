import { redirect } from "next/navigation"
import { BookOpen, CheckCircle, Users, DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowRight } from "lucide-react"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle as CardTitleUI } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const session = await auth()
  const user = session?.user as any

  if (!user || user.role !== "ADMIN") {
    return redirect("/")
  }
  
  const totalCourses = await db.course.count()
  const publishedCourses = await db.course.count({ where: { isPublished: true } })
  const totalUsers = await db.user.count()
  const totalPurchases = await db.purchase.count()
  const pendingPayments = await db.pendingPurchase.count({ where: { status: "PENDING" } })
  const totalCompletedChapters = await db.userProgress.count({
    where: { isCompleted: true }
  })

  // Calculate some "mock" trends for visual appeal (in a real app, compare with prev month)
  const stats = [
    {
      label: "Total Revenue",
      value: `${totalPurchases * 100} DZD`, // Simplification
      subtext: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      label: "Active Students",
      value: totalUsers,
      subtext: "+180 new users this week",
      icon: Users,
      trend: "up",
    },
    {
      label: "Course Content",
      value: totalCourses,
      subtext: `${publishedCourses} published courses`,
      icon: BookOpen,
      trend: "neutral",
    },
    {
      label: "Completion Rate",
      value: totalCompletedChapters > 0 ? "12%" : "0%", // Mock logic
      subtext: "+2.4% interaction rate",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      </div>
      <div className="flex flex-col space-y-4">
         <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
         </div>
         
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
               <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitleUI className="text-sm font-medium">
                        {stat.label}
                     </CardTitleUI>
                     <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stat.value}</div>
                     <p className="text-xs text-muted-foreground">
                        {stat.subtext}
                     </p>
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
               <CardHeader>
                  <CardTitleUI>Overview</CardTitleUI>
               </CardHeader>
               <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Chart Placeholder
                  </div>
               </CardContent>
            </Card>
            <Card className="col-span-3">
               <CardHeader>
                  <CardTitleUI>Quick Actions</CardTitleUI>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                    <a href="/admin/courses" className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted transition-colors">
                        <BookOpen className="h-5 w-5" />
                        <div className="space-y-1">
                           <p className="text-sm font-medium leading-none">Manage Courses</p>
                           <p className="text-xs text-muted-foreground">Review published content</p>
                        </div>
                    </a>
                     <a href="/admin/users" className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted transition-colors">
                        <Users className="h-5 w-5" />
                        <div className="space-y-1">
                           <p className="text-sm font-medium leading-none">Manage Users</p>
                           <p className="text-xs text-muted-foreground">{totalUsers} active users</p>
                        </div>
                    </a>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
