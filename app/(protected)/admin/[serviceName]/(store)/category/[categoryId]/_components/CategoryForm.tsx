"use client";

import * as z from "zod";
import { useTransition } from "react";
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

import { TSelectStoreCategory } from "@/db/schema";
import { createCategory, updateCategory } from "@/actions/storeCategory";
import { getServiceByName } from "@/actions/service";
import { ADMIN_STORE_ROUTES } from "@/routes";

const formSchema = z.object({
  name: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: TSelectStoreCategory;
}

const CategoryForm = ({ initialData }: Props) => {
  const params = useParams<{ serviceName: string }>();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "수정하기" : "만들기";
  const description = initialData
    ? "수정할 카테고리 이름을 넣어주세요."
    : "새로 만들 카테고리의 이름을 넣어주세요.";
  const toastMessage = initialData
    ? "카테고리 수정을 완료했습니다."
    : "새로운 카테고리를 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    startTransition(async () => {
      if (initialData) {
        updateCategory({ id: initialData.id, name: data.name })
          .then(() => {
            router.refresh();
            router.push(`${ADMIN_STORE_ROUTES.CATEGORY}`);
            toast.success(toastMessage);
          })
          .catch(() => {
            toast.error("문제가 발생 하였습니다.");
          });
      } else {
        const service = await getServiceByName(params.serviceName);
        if (service) {
          createCategory({ name: data.name })
            .then(() => {
              router.refresh();
              router.push(`${ADMIN_STORE_ROUTES.CATEGORY}`);
              toast.success(toastMessage);
            })
            .catch(() => {
              toast.error("문제가 발생 하였습니다.");
            });
        }
      }
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
          <div className="grid grid-cols-3 gap-8">
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

export default CategoryForm;
