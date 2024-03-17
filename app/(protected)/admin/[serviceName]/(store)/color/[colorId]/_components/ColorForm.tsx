"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
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
import { getServiceByName } from "@/actions/service";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: TSelectStoreColor;
}

const ColorForm = ({ initialData }: Props) => {
  const params = useParams<{ serviceName: string }>();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "수정하기" : "만들기";
  const description = initialData
    ? "수정할 색상 정보를 넣어주세요."
    : "새로 만들 색상의 정보를 넣어주세요.";
  const toastMessage = initialData
    ? "색상 수정을 완료했습니다."
    : "새로운 색상을 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const { watch, setValue } = form;

  const value = watch("value");

  const onSubmit = async (data: ColorFormValues) => {
    startTransition(async () => {
      if (initialData) {
        updateColor({ id: initialData.id, name: data.name, value: data.value })
          .then(() => {
            router.refresh();
            router.push(`/admin/${params.serviceName}/color`);
            toast.success(toastMessage);
          })
          .catch(() => {
            toast.error("문제가 발생 하였습니다.");
          });
      } else {
        const service = await getServiceByName(params.serviceName);
        if (service) {
          createColor({
            serviceId: service.id,
            name: data.name,
            value: data.value,
          })
            .then(() => {
              router.refresh();
              router.push(`/admin/${params.serviceName}/color`);
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
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>값</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isPending}
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

export default ColorForm;
