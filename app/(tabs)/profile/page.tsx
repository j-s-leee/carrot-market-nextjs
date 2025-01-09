import Button from "@/components/button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const editProfile = async () => {
    "use server";
    redirect("/profile/edit");
  };
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="p-5 gap-5 flex flex-col justify-center">
      <div className="flex gap-3 items-center">
        <div className="size-20 rounded-full overflow-hidden">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              height={80}
              width={80}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <h3>{user?.username}</h3>
      </div>
      <form action={editProfile}>
        <Button text="프로필 수정" />
      </form>
      <form action={logOut}>
        <Button text="로그아웃" />
      </form>
    </div>
  );
}
