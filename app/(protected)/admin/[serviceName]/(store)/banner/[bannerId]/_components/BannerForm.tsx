"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
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
import { getServiceByName } from "@/actions/service";
import ImageUpload from "@/components/admin/ImageUpload";
import { uploadImage } from "@/actions/imageUpload";
import { ADMIN_STORE_ROUTES } from "@/routes";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.instanceof(File).array(),
});

type BannerFormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: { id: string; name: string; images: string[] };
}

const BannerForm = ({ initialData }: Props) => {
  const initialPreviewUrls = initialData ? initialData.images : [];
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialPreviewUrls);
  const params = useParams<{ serviceName: string }>();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "수정하기" : "만들기";
  const description = initialData
    ? "수정할 배너 정보를 넣어주세요."
    : "새로 만들 배너의 정보를 넣어주세요.";
  const toastMessage = initialData
    ? "배너 수정을 완료했습니다."
    : "새로운 배너를 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData ? initialData.name : "",
      images: [],
    },
  });

  const { setValue } = form;

  const onDrop = async (acceptedFiles: File[]) => {
    setValue("images", acceptedFiles);
    setPreviewUrls(() =>
      acceptedFiles.map((file) => URL.createObjectURL(file))
    );
  };

  const onSubmit = async (data: BannerFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      data.images.forEach((file) => {
        formData.append("name", data.name);
        formData.append("file", file, file.name);
      });
      await uploadImage(formData)
        .then(async () => {
          const imageUrls = data.images.map(
            (image) =>
              `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/${data.name}/${image.name}`
          );
          if (initialData) {
            updateBanner({
              id: initialData.id,
              name: data.name,
              images: imageUrls,
            })
              .then(() => {
                router.refresh();
                router.push(`${ADMIN_STORE_ROUTES.BANNER}`);
                toast.success(toastMessage);
              })
              .catch(() => {
                toast.error("문제가 발생 하였습니다.");
              });
          } else {
            const service = await getServiceByName(params.serviceName);
            if (service) {
              createBanner({
                name: data.name,
                images: imageUrls,
              })
                .then(() => {
                  router.refresh();
                  router.push(`${ADMIN_STORE_ROUTES.BANNER}`);
                  toast.success(toastMessage);
                })
                .catch(() => {
                  toast.error("문제가 발생 하였습니다.");
                });
            }
          }
        })
        .catch((error) => {
          toast.error(error.message);
          console.error("error", error);
        });
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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
                    <ImageUpload previewUrls={previewUrls} onDrop={onDrop} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            variant={"secondary"}
            className="ml-auto mr-2"
            onClick={onCancel}
            type="button"
          >
            취소
          </Button>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BannerForm;
