"use client"

import { useState } from "react"
import axios from "axios"
import { Copy, Key, Loader2, RefreshCw, Server, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface MuxLiveFormProps {
  initialData: {
    muxLiveStreamId?: string
    muxStreamKey?: string
    muxPlaybackId?: string
  }
  courseId: string
}

export const MuxLiveForm = ({
  initialData,
  courseId
}: MuxLiveFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      await axios.post(`/api/courses/${courseId}/live`)
      toast.success("Live stream keys generated")
      router.refresh()
    } catch (error: any) {
      toast.error(error.response?.data || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return ( // Render logic based on existence of keys
    <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
      <div className="font-medium mb-4 flex items-center justify-between">
        Internal Live Sreaming
      </div>
      
      {!initialData.muxStreamKey ? (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
           <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-full">
            <Video className="w-8 h-8 text-sky-600 dark:text-sky-300" />
           </div>
           <p className="text-center text-sm text-slate-500 max-w-sm">
             Generate stream keys to broadcast directly from this platform using OBS, Wirecast, or other software.
           </p>
           <Button onClick={onSubmit} disabled={isLoading}>
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
             Generate Stream Keys
           </Button>
        </div>
      ) : (
        <div className="space-y-4">
           <div className="p-4 bg-white dark:bg-black rounded-lg border space-y-4">
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase text-slate-500">RTMP Server URL</label>
                 <div className="flex items-center gap-x-2">
                    <code className="flex-1 bg-slate-200 dark:bg-slate-800 p-2 rounded text-sm truncate">
                       rtmp://global-live.mux.com:5222/app
                    </code>
                    <Button size="icon" variant="ghost" onClick={() => onCopy("rtmp://global-live.mux.com:5222/app")}>
                       <Copy className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase text-slate-500">Stream Key (Keep Private)</label>
                 <div className="flex items-center gap-x-2">
                    <code className="flex-1 bg-slate-200 dark:bg-slate-800 p-2 rounded text-sm truncate blur-sm hover:blur-none transition-all cursor-pointer">
                       {initialData.muxStreamKey}
                    </code>
                    <Button size="icon" variant="ghost" onClick={() => onCopy(initialData.muxStreamKey!)}>
                       <Copy className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-x-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
             <Server className="w-4 h-4" />
             <span className="text-xs">
                Enter these credentials into your streaming software (OBS, etc).
             </span>
           </div>

           <Button onClick={onSubmit} variant="outline" size="sm" disabled={isLoading} className="w-full">
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
             Reset Keys
           </Button>
        </div>
      )}
    </div>
  )
}
