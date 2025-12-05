"use client"

import { BarChart, Compass, CreditCard, Layout, List, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"

import { SidebarItem } from "./sidebar-item"

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/courses",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
]

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

const adminRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: List,
    label: "Courses",
    href: "/admin/courses",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: CreditCard,
    label: "Payments",
    href: "/admin/payments",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname()

  const isTeacherPage = pathname?.includes("/teacher")
  const isAdminPage = pathname?.includes("/admin")

  const routes = isTeacherPage ? teacherRoutes : (isAdminPage ? adminRoutes : guestRoutes)

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}
