import { NextResponse } from "next/server"
import Mux from "@mux/mux-node"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return new NextResponse("Missing Mux Credentials", { status: 500 });
    }

    // 1. Fetch current data to handle cleanup (optional, skipping clean up for MVP speed/reliability)
    // Actually, good practice to delete old stream if exists to save Mux slots.
    // We need to fetch via Raw SQL due to stale client.
    const rawCourse = await db.$queryRaw<any[]>`SELECT "muxLiveStreamId" FROM "Course" WHERE "id" = ${courseId} AND "userId" = ${userId}`
    const existingStreamId = rawCourse[0]?.muxLiveStreamId;

    if (existingStreamId) {
      try {
        await mux.video.liveStreams.delete(existingStreamId)
      } catch (e) {
        console.log("Error deleting old stream:", e)
      }
    }

    // 2. Create new Live Stream
    const stream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
      reconnect_window: 60, // allow disconnect for 60s
    })

    if (!stream.id || !stream.stream_key || !stream.playback_ids?.[0]?.id) {
       return new NextResponse("Mux Error", { status: 500 })
    }

    // 3. Update DB via Raw SQL
    await db.$executeRaw`
      UPDATE "Course" 
      SET "muxLiveStreamId" = ${stream.id},
          "muxStreamKey" = ${stream.stream_key},
          "muxPlaybackId" = ${stream.playback_ids[0].id}
      WHERE "id" = ${courseId}
    `

    return NextResponse.json({
      muxLiveStreamId: stream.id,
      muxStreamKey: stream.stream_key,
      muxPlaybackId: stream.playback_ids[0].id
    })
  } catch (error) {
    console.log("[COURSE_LIVE_STREAM_POST]", error)
    return new NextResponse(error instanceof Error ? error.message : "Internal Error", { status: 500 })
  }
}
