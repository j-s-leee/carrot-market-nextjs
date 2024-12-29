"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { env } from "process";
import { CLOUDFLARE_DELIVERY_URL } from "@/lib/constants";

export default function AddProduct() {
  const [preview, setPreview] = useState("");

  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = await result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) return;

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) return;

    const photoUrl = `${CLOUDFLARE_DELIVERY_URL}${photoId}`;
    formData.set("photo", photoUrl);

    return uploadProduct(_, formData);
  };
  const [state, dispatch] = useActionState(interceptAction, null);
  return (
    <div>
      <form action={dispatch} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          style={{ backgroundImage: `url(${preview})` }}
          className="border-2 aspect-square flex items-center justify-center flex-col
          text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer
          bg-center bg-cover"
        >
          {!preview && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="설명"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
