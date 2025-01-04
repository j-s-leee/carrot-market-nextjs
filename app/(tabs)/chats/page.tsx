import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";

async function getChatRooms() {
  const session = await getSession();
  const rooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id,
        },
      },
    },
    include: {
      users: {
        select: {
          avatar: true,
          username: true,
        },
        where: {
          NOT: {
            id: session.id,
          },
        },
      },
      messages: {
        select: {
          payload: true,
          created_at: true,
        },
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
  return rooms;
}

export default async function Chat() {
  const rooms = await getChatRooms();
  console.log(rooms);
  return (
    <div className="p-5 gap-2 flex flex-col">
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/chats/${room.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex items-center gap-2 last:pb-0 last:border-b-0"
        >
          <Image
            src={room.users[0].avatar!}
            alt={room.users[0].username}
            width={50}
            height={50}
            className="size-8 rounded-full"
          />
          <div className="flex-1">
            <span className="text-white text-lg font-semibold">
              {room.users[0].username}
            </span>
            <div className="text-sm">
              <span className="">{room.messages[0].payload}</span>
            </div>
          </div>
          <div className="text-sm">
            {formatToTimeAgo(room.messages[0].created_at.toString())}
          </div>
        </Link>
      ))}
    </div>
  );
}
