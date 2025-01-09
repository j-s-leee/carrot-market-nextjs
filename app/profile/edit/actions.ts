"use server";

import getSession from "@/lib/session";
import { userSchema } from "./schema";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
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
      redirect("/profile");
    }
  }
}
