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

import { TSelectStoreCategory } from "@/db/schema";
import { createCategory, getCategories } from "@/actions/storeCategory";
import { ADMIN_STORE_ROUTES } from "@/routes";
import CategorySelect from "./CategorySelect";
import { categoryFormSchema } from "@/schemas/admin";

export type TCategoryType =
  | "largeCategoryName"
  | "mediumCategoryName"
  | "smallCategoryName";

interface Props {
  largeCategories: TSelectStoreCategory[];
}

const CategoryForm = ({ largeCategories }: Props) => {
  const router = useRouter();
  const [isNew, setIsNew] = useState({
    largeCategoryName: false,
    mediumCategoryName: false,
    smallCategoryName: false,
  });
  const [mediumCategories, setMediumCategories] = useState<
    TSelectStoreCategory[]
  >([]);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onChange",
    defaultValues: {
      largeCategoryName: "",
      mediumCategoryName: "",
      smallCategoryName: "",
    },
  });

  const { watch, setValue, clearErrors } = form;

  const [largeCategoryName, mediumCategoryName] = watch([
    "largeCategoryName",
    "mediumCategoryName",
  ]);

  const onSelect = async ({
    id,
    name,
    value,
  }: {
    id: string;
    name: TCategoryType;
    value: string;
  }) => {
    if (name === "largeCategoryName") {
      try {
        setLoading(true);
        const response = await getCategories("medium", id);
        setMediumCategories(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    setValue(name, value);
    clearErrors(name);
  };

  const onSubmit = async (data: z.infer<typeof categoryFormSchema>) => {
    try {
      setLoading(true);
      await createCategory({
        categoryLarge: { name: data.largeCategoryName, type: "large" },
        categoryMedium: { name: data.mediumCategoryName, type: "medium" },
        categorySmall: { name: data.smallCategoryName, type: "small" },
      });
      router.refresh();
      router.push(`${ADMIN_STORE_ROUTES.CATEGORY}`);
      toast.success("새로운 카테고리를 만들었습니다.");
    } catch (error) {
      console.log("error", error);
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
        <Heading
          title={"카테고리 만들기"}
          description={"카테고리 정보를 넣어주세요."}
        />
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
              name="largeCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>대분류</FormLabel>
                  <FormControl>
                    {isNew.largeCategoryName ? (
                      <>
                        <Input
                          disabled={loading}
                          placeholder="대분류 카테고리를 입력해주세요."
                          {...field}
                        />
                        <Button
                          onClick={() => {
                            setIsNew((prev) => ({
                              ...prev,
                              largeCategoryName: false,
                            }));
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          기존 대분류 선택
                        </Button>
                      </>
                    ) : (
                      <CategorySelect
                        disabled={loading}
                        value={largeCategoryName}
                        name="largeCategoryName"
                        type="대분류"
                        items={largeCategories}
                        setIsNew={setIsNew}
                        onSelect={onSelect}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediumCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>중분류</FormLabel>
                  <FormControl>
                    {isNew.mediumCategoryName ? (
                      <>
                        <Input
                          disabled={loading}
                          placeholder="중분류 카테고리를 입력해주세요."
                          {...field}
                        />
                        <Button
                          onClick={() => {
                            setIsNew((prev) => ({
                              ...prev,
                              mediumCategoryName: false,
                            }));
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          기존 중분류 선택
                        </Button>
                      </>
                    ) : (
                      <CategorySelect
                        disabled={loading}
                        value={mediumCategoryName}
                        name="mediumCategoryName"
                        type="중분류"
                        items={mediumCategories}
                        setIsNew={setIsNew}
                        onSelect={onSelect}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smallCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>소분류</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="소분류 카테고리를 입력해주세요."
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
              만들기
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default CategoryForm;
