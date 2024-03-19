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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";

import {
  TSelectStoreBrand,
  TSelectStoreCategory,
  TSelectStoreColor,
  TSelectStoreProduct,
} from "@/db/schema";
import { getServiceByName } from "@/actions/service";
import { uploadImage } from "@/actions/imageUpload";
import { createProduct, updateProduct } from "@/actions/storeProduct";
import ImageUpload from "@/components/admin/ImageUpload";

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.instanceof(File).array(),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  size: z.string().min(1),
  isSale: z.boolean().default(false).optional(),
  saleRate: z.coerce.number().default(0).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: TSelectStoreProduct;
  categories: TSelectStoreCategory[];
  brands: TSelectStoreBrand[];
  colors: TSelectStoreColor[];
}

const ProjectForm = ({ initialData, categories, brands, colors }: Props) => {
  const initialPreviewUrls = initialData ? initialData.images : [];
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialPreviewUrls);
  const params = useParams<{ serviceName: string }>();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const title = initialData ? "수정하기" : "만들기";
  const description = initialData
    ? "수정할 상품 이름을 넣어주세요."
    : "새로 만들 상품의 이름을 넣어주세요.";
  const toastMessage = initialData
    ? "상품 수정을 완료했습니다."
    : "새로운 상품을 만들었습니다.";
  const action = initialData ? "수정 완료" : "만들기";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      isSale: initialData?.isSale || false,
      saleRate: initialData?.saleRate || 0,
      size: initialData?.size || "",
      brandId: initialData?.brandId || "",
      categoryId: initialData?.categoryId || "",
      colorId: initialData?.colorId || "",
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

  const onSubmit = async (data: ProductFormValues) => {
    console.log("호출", data);
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
            updateProduct({
              id: initialData.id,
              name: data.name,
              price: data.price,
              isSale: data.isSale || false,
              saleRate: data.saleRate || 0,
              brandId: data.brandId,
              categoryId: data.categoryId,
              size: data.size,
              colorId: data.colorId,
              images: imageUrls,
            })
              .then(() => {
                router.refresh();
                router.push(`/admin/${params.serviceName}/product`);
                toast.success(toastMessage);
              })
              .catch(() => {
                toast.error("문제가 발생 하였습니다.");
              });
          } else {
            const service = await getServiceByName(params.serviceName);
            if (service) {
              createProduct({
                serviceId: service.id,
                name: data.name,
                price: data.price,
                isSale: data.isSale || false,
                saleRate: data.saleRate || 0,
                brandId: data.brandId,
                categoryId: data.categoryId,
                size: data.size,
                colorId: data.colorId,
                images: imageUrls,
              })
                .then(() => {
                  router.refresh();
                  router.push(`/admin/${params.serviceName}/product`);
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
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품 이름</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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
                      disabled={isPending}
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
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품 사이즈</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="상품 사이즈를 입력해주세요."
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
                    disabled={isPending}
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
                          {category.name}
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
                    disabled={isPending}
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
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>색상</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="색상을 선택해주세요."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
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
              name="isSale"
              render={({ field }) => (
                <FormItem className="flex flex-fow items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>할인여부</FormLabel>
                    <FormDescription>
                      할인 상품이라면 체크해주세요.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saleRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>할인율</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
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
              name="images"
              render={() => (
                <FormItem className="my-3">
                  <FormLabel>상품 이미지</FormLabel>
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

export default ProjectForm;
