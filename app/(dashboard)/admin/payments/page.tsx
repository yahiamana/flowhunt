import { redirect } from "next/navigation"
import { CreditCard, Clock } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { PendingPaymentsList } from "./_components/pending-payments-list"

export default async function PendingPaymentsPage() {
  const session = await auth()
  const user = session?.user as any

  if (!user || user.role !== "ADMIN") {
    return redirect("/")
  }

  const pendingPurchases = await db.pendingPurchase.findMany({
    where: {
      status: "PENDING"
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      course: {
        select: {
          id: true,
          title: true,
          price: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Payment Requests</h1>
            <p className="text-muted-foreground">
              Review and approve student payments
            </p>
          </div>
        </div>
        {pendingPurchases.length > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">{pendingPurchases.length} Pending</span>
          </div>
        )}
      </div>
      
      <PendingPaymentsList items={pendingPurchases} />
    </div>
  )
}
