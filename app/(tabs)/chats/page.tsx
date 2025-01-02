import db from "@/lib/db";
import getSession from "@/lib/session";
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
      messages: {
        select: {
          payload: true,
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
    <div className="p-5 flex flex-col">
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/chats/${room.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
        >
          <h2 className="text-white text-lg font-semibold">
            {room.messages[0].payload}
          </h2>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
