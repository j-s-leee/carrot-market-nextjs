import { PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { formatToTimeAgo } from "@/utils/format";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

async function getPosts() {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          Comment: true,
          Like: true,
        },
      },
    },
    take: PAGE_SIZE,
    orderBy: {
      created_at: "desc",
    },
  });
  return posts;
}

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.Like}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.Comment}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
