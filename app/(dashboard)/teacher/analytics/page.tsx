import { redirect } from "next/navigation"
import { BarChart3, TrendingUp, DollarSign } from "lucide-react"

import { auth } from "@/lib/auth"
import { getAnalytics } from "@/actions/get-analytics"
import { formatPrice } from "@/lib/format"
import { Chart } from "./_components/chart"
import { Card, CardContent, CardHeader, CardTitle as CardTitleUI } from "@/components/ui/card"

const AnalyticsPage = async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect("/")
  }

  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(userId)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitleUI className="text-sm font-medium">
                Total Revenue
             </CardTitleUI>
             <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
             <p className="text-xs text-muted-foreground">
                Lifetime earnings
             </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitleUI className="text-sm font-medium">
                Total Sales
             </CardTitleUI>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{totalSales}</div>
             <p className="text-xs text-muted-foreground">
                Course purchases
             </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="col-span-4">
         <CardHeader>
            <CardTitleUI>Revenue Analysis</CardTitleUI>
         </CardHeader>
         <CardContent className="pl-2">
            <Chart data={data} />
         </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPage
