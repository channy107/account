"use client";

import * as z from "zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  TSelectStoreBrand,
  TSelectStoreCategory,
  TSelectStoreColor,
  TSelectStoreProduct,
  TSelectStoreSize,
} from "@/db/schema";
import { uploadImage } from "@/actions/imageUpload";
import { createProduct, updateProduct } from "@/actions/storeProduct";
import ImageUpload from "@/components/admin/ImageUpload";
import { ADMIN_STORE_ROUTES } from "@/routes";
import MultiSelect from "@/components/admin/MultiSelect";
import { productFormSchema } from "@/schemas/admin";

interface ICategory extends TSelectStoreCategory {
  fullCategory: string;
}

interface Props {
  initialData?: TSelectStoreProduct;
  categories: ICategory[];
  brands: TSelectStoreBrand[];
  sizes: TSelectStoreSize[];
  colors: TSelectStoreColor[];
}

const ProjectForm = ({
  initialData,
  categories,
  sizes,
  brands,
  colors,
}: Props) => {
  const initialPreviewUrls = initialData ? initialData.images : [];
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialPreviewUrls);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = initialData ? "상품 수정하기" : "상품 만들기";
  const toastMessage = initialData
    ? "상품 수정을 완료했습니다."
    : "새로운 상품을 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      saleRate: initialData?.saleRate || 0,
      brandId: initialData?.brandId || "",
      colors: [],
      sizes: [],
      categoryId: initialData?.categoryId || "",
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

  const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
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
        updateProduct({
          id: initialData.id,
          name: data.name,
          price: data.price,
          saleRate: data.saleRate || 0,
          brandId: data.brandId,
          categoryId: data.categoryId,
          sizes: data.sizes,
          colors: data.colors,
          images: imageUrls,
        });
      } else {
        createProduct({
          name: data.name,
          price: data.price,
          saleRate: data.saleRate || 0,
          brandId: data.brandId,
          categoryId: data.categoryId,
          sizes: data.sizes,
          colors: data.colors,
          images: imageUrls,
        });
      }

      router.refresh();
      router.push(`${ADMIN_STORE_ROUTES.PRODUCT}`);
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
    <FormProvider {...form}>
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
                  <FormLabel>상품 이름</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="상품 이름을 입력해주세요."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>가격</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="10,000원"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="카테고리를 선택해주세요."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.fullCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>브랜드</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="브랜드를 선택해주세요."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={() => (
                <FormItem>
                  <FormLabel>상품 사이즈</FormLabel>
                  <FormControl>
                    <MultiSelect items={sizes} name={"sizes"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colors"
              render={() => (
                <FormItem>
                  <FormLabel>색상</FormLabel>
                  <FormControl>
                    <MultiSelect items={colors} name={"colors"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saleRate"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>할인율</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="ex) 10%"
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
                  <FormLabel>상품 이미지</FormLabel>
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
    </FormProvider>
  );
};

export default ProjectForm;
