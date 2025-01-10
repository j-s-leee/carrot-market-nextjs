"use client";

import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { userSchema, UserType } from "./schema";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editAvatar, getAvatar, getUploadUrl } from "./actions";
import { CLOUDFLARE_DELIVERY_URL } from "@/lib/constants";
import Button from "@/components/button";

export default function EditProfile() {
  const [preview, setPreview] = useState("");
  const [originAvatar, setOriginAvatar] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    async function fetchAvatar() {
      const data = await getAvatar();
      if (data) {
        setPreview(data.avatar!);
        setOriginAvatar(data.avatar!);
      }
    }
    fetchAvatar();
  }, []);

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = await result;
      setUploadUrl(uploadURL);
      setValue("avatar", `${CLOUDFLARE_DELIVERY_URL}${id}/avatar`);
    }
  };

  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  const onSubmit = handleSubmit(async (data: UserType) => {
    if (!file) return;

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) return;

    const formData = new FormData();
    formData.append("avatar", data.avatar);
    formData.append("originAvatar", originAvatar);
    const errors = await editAvatar(formData);
    if (errors) {
    }
  });

  const onValid = async () => {
    await onSubmit();
  };
  return (
    <div className="p-5 gap-5 flex flex-col">
      <div className="flex justify-between">
        <button onClick={onClose} className="text-neutral-200">
          <XMarkIcon className="size-6" />
        </button>
        <span>프로필 수정</span>
        <span></span>
      </div>
      <form action={onValid} className="flex flex-col gap-5">
        <label
          htmlFor="avatar"
          style={{ backgroundImage: `url(${preview})` }}
          className="border-2 aspect-square flex items-center justify-center flex-col
          text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer
          bg-center bg-cover"
        >
          {!preview && (
            <div className="flex flex-col items-center justify-center bg-cover bg-center">
              <UserIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {errors.avatar?.message}
              </div>
            </div>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          className="hidden"
        />
        <Button text="완료" />
      </form>
    </div>
  );
}
