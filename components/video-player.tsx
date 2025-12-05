"use client"

import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  Loader2, 
  Lock, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipForward,
  Settings,
  CheckCircle,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  playbackId?: string
  courseId: string
  chapterId: string
  nextChapterId?: string
  isLocked: boolean
  completeOnEnd: boolean
  title: string
  videoUrl?: string
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  videoUrl,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  
  const router = useRouter()

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle volume
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle seek
  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
    setCurrentTime(newTime)
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  // Handle playback rate
  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
      setShowSettings(false)
    }
  }

  // Handle video end
  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        })

        if (!nextChapterId) {
          toast.success("Course completed! 🎉")
        }
        
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  // Skip to next chapter
  const skipToNext = () => {
    if (nextChapterId) {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
    }
  }

  // SECURITY: Prevent screenshots and screen recording
  useEffect(() => {
    // Prevent PrintScreen key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '3') || (e.metaKey && e.shiftKey && e.key === '4')) {
        e.preventDefault()
        toast.error("Screenshots are not allowed for this content")
        return false
      }
      
      // Keyboard shortcuts for player
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight') {
        if (videoRef.current) videoRef.current.currentTime += 10
      } else if (e.code === 'ArrowLeft') {
        if (videoRef.current) videoRef.current.currentTime -= 10
      } else if (e.code === 'KeyM') {
        toggleMute()
      } else if (e.code === 'KeyF') {
        toggleFullscreen()
      }
    }

    // Detect visibility change (screen recording detection)
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }

    // Detect blur (switching apps for screen recording)
    const handleBlur = () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isPlaying])

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    const container = containerRef.current
    container?.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative aspect-video bg-black rounded-xl overflow-hidden group",
        "ring-1 ring-white/10 select-none"
      )}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        // CSS to block screenshots in some browsers
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* Anti-screenshot overlay - transparent but blocks some capture tools */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'transparent',
          mixBlendMode: 'difference',
        }}
      />

      {/* Loading State */}
      {!isReady && !isLocked && videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-white/70 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Locked State */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-20">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="relative p-6 bg-white/5 rounded-full border border-white/10">
                <Lock className="h-12 w-12 text-white/70" />
              </div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Premium Content</h3>
            <p className="text-white/60 text-sm max-w-xs">
              Enroll in this course to unlock this chapter
            </p>
          </div>
        </div>
      )}

      {/* No Video State */}
      {!isLocked && !videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-20">
          <p className="text-white/60">No video available for this chapter</p>
        </div>
      )}

      {/* Video Element */}
      {!isLocked && videoUrl && (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onCanPlay={() => setIsReady(true)}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onEnded={onEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
            src={videoUrl}
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            playsInline
            onContextMenu={(e) => e.preventDefault()}
            style={{
              pointerEvents: 'auto',
            }}
          />

          {/* Security Watermark */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 text-white/30 text-xs pointer-events-none">
            <Shield className="h-3 w-3" />
            <span>Protected Content</span>
          </div>

          {/* Play/Pause Overlay */}
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-20",
              isPlaying && isReady ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <button
              onClick={togglePlay}
              className="p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white" />
              ) : (
                <Play className="h-12 w-12 text-white ml-1" />
              )}
            </button>
          </div>

          {/* Controls Overlay */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 transition-opacity duration-300 z-20",
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>

                {nextChapterId && (
                  <button
                    onClick={skipToNext}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                    title="Next Chapter"
                  >
                    <SkipForward className="h-5 w-5 text-white" />
                  </button>
                )}

                {/* Volume */}
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </button>
                  <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {/* Time */}
                <span className="text-white/80 text-sm ml-2 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <Settings className="h-5 w-5 text-white" />
                  </button>
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 p-2 min-w-[120px]">
                      <p className="text-white/50 text-xs px-2 mb-1">Speed</p>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={cn(
                            "w-full px-3 py-1.5 text-sm text-left rounded hover:bg-white/10 transition flex items-center justify-between",
                            playbackRate === rate ? "text-primary" : "text-white"
                          )}
                        >
                          {rate}x
                          {playbackRate === rate && <CheckCircle className="h-3 w-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5 text-white" />
                  ) : (
                    <Maximize className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Video Title Overlay */}
          <div 
            className={cn(
              "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 transition-opacity duration-300 z-20",
              showControls ? "opacity-100" : "opacity-0"
            )}
          >
            <h3 className="text-white font-medium text-lg">{title}</h3>
          </div>
        </>
      )}
    </div>
  )
}
