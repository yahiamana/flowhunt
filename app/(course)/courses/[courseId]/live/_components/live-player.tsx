"use client"

import { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import { ExternalLink, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LivePlayerProps {
  url: string
  title: string
}

export const LivePlayer = ({
  url,
  title
}: LivePlayerProps) => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-md border">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
  }

  // Check if the URL is playable by ReactPlayer (Safe TS check)
  const isPlayable = (ReactPlayer as any).canPlay ? (ReactPlayer as any).canPlay(url) : false

  if (!isPlayable) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-black border rounded-lg text-center space-y-4 shadow-sm">
        <h3 className="font-semibold text-lg">Join Live Session</h3>
        <p className="text-sm text-slate-500">
          This live stream cannot be played directly here. Please join via the link below.
        </p>
        <Button size="lg" className="w-full gap-2" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Join Live Stream <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    )
  }

  // Cast to any to avoid type definition issues with the library
  const Player = ReactPlayer as any

  return (
    <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-black shadow-lg">
      <Player
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playing={true}
      />
    </div>
  )
}
