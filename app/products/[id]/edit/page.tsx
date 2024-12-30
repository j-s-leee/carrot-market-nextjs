"use client";

import { useEffect, useState } from "react";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getProduct, updateProduct, getUploadUrl } from "./actions";
import { CLOUDFLARE_DELIVERY_URL } from "@/lib/constants";
import { use } from "react";

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // params Promise 해제

  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [product, setProduct] = useState<any>({});

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProduct(id); // Promise 해제 후 사용
      if (data) {
        setProduct(data);
        setPreview(`${data.photo}/public`);
        setPhotoId(data.photo.split(CLOUDFLARE_DELIVERY_URL)[1]);
      }
    }
    fetchProduct();
  }, [id]);

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id: photoId, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(photoId);
    }
  };

  const interceptAction = async (formData: FormData) => {
    const file = formData.get("photo");
    console.log(formData);
    if (file) {
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });

      if (response.status === 200) {
        const photoUrl = `${CLOUDFLARE_DELIVERY_URL}${photoId}`;
        formData.set("photo", photoUrl);
      }
    }

    formData.set("id", id); // Promise 해제 후 사용
    return updateProduct(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await interceptAction(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
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
          defaultValue={product.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          defaultValue={product.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="설명"
          defaultValue={product.description}
        />
        <Button text="수정 완료" />
      </form>
    </div>
  );
}
