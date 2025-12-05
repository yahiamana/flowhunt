import { redirect } from "next/navigation"
import { Settings, User, Lock, Bell } from "lucide-react"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ProfileForm } from "./_components/profile-form"
import { PasswordForm } from "./_components/password-form"

export default async function SettingsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/")
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  if (!user) {
    return redirect("/")
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings
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
          <ProfileForm user={user} />
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
      </div>
    </div>
  )
}
