import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/utils/format";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  // const id = Number(params.id);
  const { id } = await params;
  if (isNaN(Number(id))) return notFound();
  const product = await getProduct(Number(id));
  if (!product) return notFound();
  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: { id: true },
    });
    redirect(`/chats/${room.id}`);
  };

  const deleteProduct = async () => {
    "use server";

    await db.product.delete({
      where: { id: Number(id) },
    });
    redirect("/products");
  };
  return (
    <div className="pb-40">
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {product.user.avatar ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 max-w-screen-sm p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner && (
          <>
            <Link
              href={`./${id}/edit`}
              className="bg-yellow-500 px-5 py-2.5 rounded-md text-white font-semibold"
            >
              Edit
            </Link>
            <form action={deleteProduct}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Delete
              </button>
            </form>
          </>
        )}
        <form action={createChatRoom}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}
