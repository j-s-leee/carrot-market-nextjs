"use server";

import db from "@/lib/db";

export async function fetchStreamVideos() {
  const streams = await db.liveStream.findMany({
    select: {
      id: true,
      stream_id: true,
      title: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  const videoRequests = streams.map(async (stream) => {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${stream?.stream_id}/videos`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error(`Failed to fetch videos for input ${stream.stream_id}`);
      return [];
    }
    const videoData = await response.json();
    return videoData.result || [];
  });

  const videos = (await Promise.all(videoRequests)).flat();
  return videos;
}
