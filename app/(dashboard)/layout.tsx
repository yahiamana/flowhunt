import { Navbar } from "./_components/navbar"
import { Sidebar } from "./_components/sidebar"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { checkIsBanned } from "@/lib/ban-check"

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  const session = await auth()
  const userId = (session?.user as any)?.id // Safely access ID

  if (userId) {
    const isBanned = await checkIsBanned(userId)
    if (isBanned) {
      return redirect("/sign-in")
    }
  }

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
