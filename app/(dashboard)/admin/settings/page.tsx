import { redirect } from "next/navigation"
import { Settings, User, Lock, Palette, Globe } from "lucide-react"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ProfileForm } from "../../settings/_components/profile-form"
import { PasswordForm } from "../../settings/_components/password-form"
import { PlatformSettings } from "./_components/platform-settings"

export default async function AdminSettingsPage() {
  const session = await auth()
  const user = session?.user as any

  if (!user || user.role !== "ADMIN") {
    return redirect("/")
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  if (!dbUser) {
    return redirect("/")
  }

  // Get platform stats
  const totalCourses = await db.course.count()
  const totalUsers = await db.user.count()
  const totalPurchases = await db.purchase.count()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and platform settings
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-muted rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your account details</p>
            </div>
          </div>
          <ProfileForm user={dbUser} />
        </div>

        {/* Password Section */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-muted rounded-lg">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Change Password</h2>
              <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
            </div>
          </div>
          <PasswordForm />
        </div>

        {/* Platform Settings */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-muted rounded-lg">
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Platform Overview</h2>
              <p className="text-sm text-muted-foreground">Quick stats about your platform</p>
            </div>
          </div>
          <PlatformSettings 
            totalCourses={totalCourses}
            totalUsers={totalUsers}
            totalPurchases={totalPurchases}
          />
        </div>
      </div>
    </div>
  )
}
