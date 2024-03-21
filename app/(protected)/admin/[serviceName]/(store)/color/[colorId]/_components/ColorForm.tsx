"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { HexColorPicker } from "react-colorful";

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

import { TSelectStoreColor } from "@/db/schema";
import { createColor, updateColor } from "@/actions/storeColor";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { ADMIN_STORE_ROUTES } from "@/routes";
import { colorFormSchema } from "@/schemas/admin";

interface Props {
  initialData?: TSelectStoreColor;
}

const ColorForm = ({ initialData }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const title = initialData ? "색상 수정하기" : "색상 만들기";
  const toastMessage = initialData
    ? "색상 수정을 완료했습니다."
    : "새로운 색상을 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<z.infer<typeof colorFormSchema>>({
    resolver: zodResolver(colorFormSchema),
    mode: "onChange",
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const { watch, setValue } = form;

  const value = watch("value");

  const onSubmit = async (data: z.infer<typeof colorFormSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        updateColor({ id: initialData.id, name: data.name, value: data.value });
      } else {
        createColor({
          name: data.name,
          value: data.value,
        });
      }

      router.refresh();
      router.push(`${ADMIN_STORE_ROUTES.COLOR}`);
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>색상 값</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="색상 값을 입력해주세요."
                        {...field}
                      />

                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded-lg border-2 cursor-pointer"
                              style={{ backgroundColor: value }}
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <HexColorPicker
                            color={value}
                            onChange={(value) => {
                              setValue("value", value);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
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
