"use server";
import z from "zod";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z.string().optional(),
  title: z.string(),
  price: z.coerce.number(),
  description: z.string(),
});

export async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id: Number(id) },
    select: {
      title: true,
      price: true,
      description: true,
      photo: true,
    },
  });
  return product;
}

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
  return response.json();
}

export async function updateProduct(formData: FormData) {
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo") || undefined,
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  await db.product.update({
    where: { id: Number(data.id) },
    data: {
      title: result.data.title,
      price: result.data.price,
      description: result.data.description,
      photo: result.data.photo || undefined,
    },
  });
  redirect(`/products/${data.id}`);
}
