"use server";

import getSession from "@/lib/session";
import { userSchema } from "./schema";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { CLOUDFLARE_API_URL, CLOUDFLARE_DELIVERY_URL } from "@/lib/constants";

export async function getAvatar() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      avatar: true,
    },
  });
  return user;
}

export async function getUploadUrl() {
  const response = await fetch(
    `${CLOUDFLARE_API_URL}${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

export async function editAvatar(formData: FormData) {
  const data = {
    avatar: formData.get("avatar"),
  };

  const result = userSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const user = await db.user.update({
        data: { avatar: result.data.avatar },
        where: { id: session.id },
        select: {
          id: true,
        },
      });

      const origin = formData.get("originAvatar");

      if (origin?.toString().startsWith(CLOUDFLARE_DELIVERY_URL)) {
        const imageId = origin
          .toString()
          .replace(CLOUDFLARE_DELIVERY_URL, "")
          .split("/")[0];
        await fetch(
          `${CLOUDFLARE_API_URL}${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
          }
        );
      }

      redirect("/profile");
    }
  }
}
