"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Eye, Loader2, User, Calendar, CreditCard } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatPrice } from "@/lib/format"

interface PendingPaymentsListProps {
  items: {
    id: string
    orderId: string
    proofImageUrl: string | null
    createdAt: Date
    user: {
      id: string
      name: string | null
      email: string | null
    }
    course: {
      id: string
      title: string
      price: number | null
    }
  }[]
}

export const PendingPaymentsList = ({ items }: PendingPaymentsListProps) => {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    try {
      setLoadingId(id)
      await axios.post(`/api/admin/payments/${id}/approve`)
      toast.success("Payment approved! Student enrolled.")
      router.refresh()
    } catch (error) {
      toast.error("Failed to approve payment")
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setLoadingId(id)
      await axios.post(`/api/admin/payments/${id}/reject`)
      toast.success("Payment rejected")
      router.refresh()
    } catch (error) {
      toast.error("Failed to reject payment")
    } finally {
      setLoadingId(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 bg-card rounded-xl border">
        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">No pending payments</p>
        <p className="text-sm text-muted-foreground">All payment requests have been processed</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="bg-card rounded-xl border p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{item.course.title}</h3>
              <p className="text-primary font-bold text-xl mt-1">
                {formatPrice(item.course.price || 0)} USDT
              </p>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
              <div className="p-2 bg-background rounded-full">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.user.name || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{item.user.email}</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
              <div className="p-2 bg-background rounded-full">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Submitted</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Proof
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Payment Proof</DialogTitle>
                  </DialogHeader>
                  {item.proofImageUrl ? (
                    <img
                      src={item.proofImageUrl}
                      alt="Payment proof"
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                      <p className="text-muted-foreground">No proof image uploaded</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button
                size="sm"
                onClick={() => handleApprove(item.id)}
                disabled={loadingId === item.id}
              >
                {loadingId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(item.id)}
                disabled={loadingId === item.id}
              >
                {loadingId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Order ID */}
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            Order: {item.orderId}
          </p>
        </div>
      ))}
    </div>
  )
}
