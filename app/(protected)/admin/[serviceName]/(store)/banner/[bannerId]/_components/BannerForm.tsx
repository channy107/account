"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/admin/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBanner, updateBanner } from "@/actions/storeBanner";
import ImageUpload from "@/components/admin/ImageUpload";
import { uploadImage } from "@/actions/imageUpload";
import { ADMIN_STORE_ROUTES } from "@/routes";
import { bannerFormSchema } from "@/schemas/admin";

interface Props {
  initialData?: { id: string; name: string; images: string[] };
}

const BannerForm = ({ initialData }: Props) => {
  const initialPreviewUrls = initialData ? initialData.images : [];
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialPreviewUrls);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "배너 수정하기" : "배너 만들기";
  const toastMessage = initialData
    ? "배너 수정을 완료했습니다."
    : "새로운 배너를 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData ? initialData.name : "",
      images: [],
    },
  });

  const { watch, setValue, clearErrors, setError } = form;
  const currentImages = watch("images");

  const onDrop = async (acceptedFiles: File[]) => {
    setValue("images", acceptedFiles);
    setPreviewUrls(() =>
      acceptedFiles.map((file) => URL.createObjectURL(file))
    );
    clearErrors("images");
  };

  const onDelete = (index: number) => {
    const newPreviewUrls = previewUrls.filter((_, idx) => idx !== index);
    const newImages = currentImages.filter((_, idx) => idx !== index);

    if (newImages.length === 0) {
      setError("images", {
        type: "required",
        message: "상품 이미지를 업로드해주세요.",
      });
    }

    setValue("images", newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const onSubmit = async (data: z.infer<typeof bannerFormSchema>) => {
    const formData = new FormData();
    const imageUrls = data.images.map(
      (image) =>
        `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/${data.name}/${image.name}`
    );

    data.images.forEach((file) => {
      formData.append("name", data.name);
      formData.append("file", file, file.name);
    });

    try {
      setLoading(true);
      await uploadImage(formData);

      if (initialData) {
        updateBanner({
          id: initialData.id,
          name: data.name,
          images: imageUrls,
        });
      } else {
        createBanner({
          name: data.name,
          images: imageUrls,
        });
      }
      router.refresh();
      router.push(`${ADMIN_STORE_ROUTES.BANNER}`);
      toast.success(toastMessage);
    } catch {
      toast.error("문제가 발생 하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Heading title={title} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center first-letter:space-y-8 w-full"
        >
          <div className="flex flex-col gap-5 w-[500px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="이름을 입력해주세요."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem className="my-3">
                  <FormLabel>배너 이미지</FormLabel>
                  <FormControl>
                    <ImageUpload
                      previewUrls={previewUrls}
                      onDrop={onDrop}
                      onDelete={onDelete}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              variant={"secondary"}
              className="ml-auto mr-2"
              onClick={onCancel}
              type="button"
            >
              취소
            </Button>
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BannerForm;
