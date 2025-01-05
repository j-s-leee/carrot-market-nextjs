import CloseModalButton from "@/components/close-modal-button";
import db from "@/lib/db";
import { formatToWon } from "@/utils/format";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function Modal({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }
  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <CloseModalButton />
      <div className="flex w-1/2 max-w-xl min-w-80 justify-center flex-col">
        <div className="relative w-full aspect-square">
          <Image
            className="object-cover rounded-s-md"
            fill
            src={`${product.photo}/public`}
            alt={product.title}
          />
        </div>
        <div className="flex flex-col justify-between bg-neutral-700 rounded-e-md">
          <div className="p-5 flex items-center gap-3 bg-neutral-800">
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
          <div className="w-full bottom-0 max-w-screen-sm p-5 pb-10 flex justify-between items-center">
            <span className="font-semibold text-xl">
              {formatToWon(product.price)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
