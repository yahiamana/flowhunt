"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Loader2, Copy, Check, Upload, Shield, Clock, CheckCircle2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

import { Suspense } from "react"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const courseId = searchParams.get("courseId")
  const orderId = searchParams.get("orderId")
  const price = parseFloat(searchParams.get("price") || "0")
  const title = searchParams.get("title") || "Course"
  
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [proofImage, setProofImage] = useState<string | null>(null)

  // Your USDT wallet address - UPDATE THIS
  const walletAddress = "TYourBinanceWalletAddressHere"

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    toast.success("Wallet address copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const onUploadProof = (result: any) => {
    setProofImage(result.info.secure_url)
    toast.success("Payment proof uploaded!")
  }

  const handleSubmitPayment = async () => {
    if (!proofImage) {
      toast.error("Please upload payment proof screenshot")
      return
    }

    try {
      setIsLoading(true)
      
      await axios.post(`/api/payment/submit`, {
        courseId,
        orderId,
        proofImageUrl: proofImage,
      })
      
      toast.success("Payment submitted! You're on the waitlist.")
      router.push(`/payment/pending?courseId=${courseId}`)
    } catch (error: any) {
      toast.error(error?.response?.data || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (!courseId || !orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Invalid payment session</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Complete Your Payment</h1>
              <p className="text-sm text-muted-foreground">Secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column - Payment Steps */}
          <div className="md:col-span-3 space-y-6">
            {/* Step 1: Course Details */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="font-semibold text-lg">Course Details</h2>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-medium text-lg">{decodeURIComponent(title)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-primary">{formatPrice(price)}</span>
                  <span className="text-muted-foreground">USDT</span>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Instructions */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="font-semibold text-lg">Send Payment</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Send <span className="font-semibold text-foreground">{formatPrice(price)} USDT (TRC20)</span> to the following address:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm bg-background p-3 rounded-lg border break-all font-mono">
                      {walletAddress}
                    </code>
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="shrink-0"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <Shield className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <p>Only send <strong>USDT on TRC20 network</strong>. Sending other tokens or using wrong network may result in loss of funds.</p>
                </div>
              </div>
            </div>

            {/* Step 3: Upload Proof */}
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${proofImage ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                  {proofImage ? <Check className="h-4 w-4" /> : "3"}
                </div>
                <h2 className="font-semibold text-lg">Upload Payment Proof</h2>
              </div>
              
              {proofImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                    <img 
                      src={proofImage} 
                      alt="Payment proof" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setProofImage(null)}
                  >
                    Change Screenshot
                  </Button>
                </div>
              ) : (
                <CldUploadWidget
                  onSuccess={onUploadProof}
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{
                    maxFiles: 1,
                    resourceType: "image",
                    folder: "payment-proofs",
                  }}
                >
                  {({ open }) => (
                    <div 
                      onClick={() => open()}
                      className="flex flex-col items-center justify-center h-48 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition border-2 border-dashed border-muted-foreground/25 hover:border-primary/50"
                    >
                      <div className="p-3 bg-primary/10 rounded-full mb-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">Click to upload screenshot</p>
                      <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-xl border p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-medium">{decodeURIComponent(title)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs">{orderId?.slice(-12)}</span>
                </div>
              </div>

              <div className="py-4 border-b">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{formatPrice(price)}</span>
                    <span className="text-muted-foreground ml-1">USDT</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  className="w-full h-12 text-base"
                  onClick={handleSubmitPayment}
                  disabled={isLoading || !proofImage}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Approval"
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel Payment
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>24h Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Instant Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-orange-500" />
                    <span>USDT TRC20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
