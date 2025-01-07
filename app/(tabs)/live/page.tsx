import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Button from "@/components/button";
import { fetchStreamVideos } from "./actions";
import VideoCard from "@/components/video-card";

export default async function Live() {
  const videos = await fetchStreamVideos();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-5">Live Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos &&
            videos.map((video) => <VideoCard key={video.uid} video={video} />)}
        </div>
      </div>
      <Link
        href="/streams/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
