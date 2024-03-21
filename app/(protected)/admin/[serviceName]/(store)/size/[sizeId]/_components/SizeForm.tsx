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

import { TSelectStoreSize } from "@/db/schema";
import { ADMIN_STORE_ROUTES } from "@/routes";
import { createSize, updateSize } from "@/actions/storeSize";
import { sizeFormSchema } from "@/schemas/admin";

interface Props {
  initialData?: TSelectStoreSize;
}

const ColorForm = ({ initialData }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = initialData ? "사이즈 수정하기" : "사이즈 만들기";

  const toastMessage = initialData
    ? "사이즈 수정을 완료했습니다."
    : "새로운 사이즈를 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<z.infer<typeof sizeFormSchema>>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof sizeFormSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        updateSize({ id: initialData.id, name: data.name, value: data.value });
      } else {
        createSize({
          name: data.name,
          value: data.value,
        });
      }

      router.refresh();
      router.push(`${ADMIN_STORE_ROUTES.SIZE}`);
      toast.success(toastMessage);
    } catch (error) {
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
          className="flex flex-col items-center space-y-8 w-full"
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
                      placeholder="ex) S or L "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사이즈</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="ex) 90-95"
                      {...field}
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

export default ColorForm;
