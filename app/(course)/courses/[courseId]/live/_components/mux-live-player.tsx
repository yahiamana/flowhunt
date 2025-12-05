"use client"

import MuxPlayer from "@mux/mux-player-react"

import { cn } from "@/lib/utils"

interface MuxLivePlayerProps {
  playbackId: string
  title: string
}

export const MuxLivePlayer = ({
  playbackId,
  title
}: MuxLivePlayerProps) => {
  return (
    <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-black shadow-lg">
      <MuxPlayer
        playbackId={playbackId}
        streamType="live"
        autoPlay
        muted={false} // Auto-play might require mute, but user can unmute
        metadata={{
           video_title: title,
           player_name: "Internal Live Player"
        }}
        className={cn(
           "w-full h-full"
        )}
      />
    </div>
  )
}
