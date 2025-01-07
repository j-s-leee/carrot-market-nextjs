import Image from "next/image";

type Video = {
  uid: string;
  thumbnail: string;
  duration: number;
  meta: {
    name: string;
  };
};

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <div className="relative aspect-video">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.meta.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-800 h-full text-white">
            No Thumbnail
          </div>
        )}
      </div>
      <div className="p-3">
        <h2 className="text-lg font-bold">
          {video.meta.name || "Unnamed Video"}
        </h2>
        <p className="text-sm text-gray-400">
          Duration: {Math.round(video.duration / 60)}:{video.duration % 60}
        </p>
      </div>
    </div>
  );
}
