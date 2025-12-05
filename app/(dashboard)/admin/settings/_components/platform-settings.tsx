import { BookOpen, Users, ShoppingCart } from "lucide-react"

interface PlatformSettingsProps {
  totalCourses: number
  totalUsers: number
  totalPurchases: number
}

export const PlatformSettings = ({
  totalCourses,
  totalUsers,
  totalPurchases,
}: PlatformSettingsProps) => {
  const stats = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      label: "Total Purchases",
      value: totalPurchases,
      icon: ShoppingCart,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
        >
          <div className="p-2 bg-background rounded-lg">
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
