import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "이름을 입력해주세요.",
  }),
  price: z.coerce.number().min(1, {
    message: "가격을 입력해주세요.",
  }),
  images: z.instanceof(File).array().min(1, {
    message: "상품 이미지를 업로드해주세요.",
  }),
  brandId: z.string().min(1, {
    message: "브랜드 이름을 선택해주세요.",
  }),
  categoryId: z.string().min(1, {
    message: "카테고리를 선택해주세요.",
  }),
  colors: z.object({ id: z.string(), name: z.string() }).array().min(1, {
    message: "최소 한 개 이상 선택해주세요.",
  }),
  sizes: z.object({ id: z.string(), name: z.string() }).array().min(1, {
    message: "최소 한 개 이상 선택해주세요.",
  }),
  saleRate: z.coerce.number().min(0, {
    message: "0 이상 값만 입력할 수 있습니다.",
  }),
});

export const bannerFormSchema = z.object({
  name: z.string().min(1, {
    message: "이름을 입력해주세요.",
  }),
  images: z.instanceof(File).array().min(1, {
    message: "상품 이미지를 업로드해주세요.",
  }),
});

export const brandFormSchema = z.object({
  name: z.string().min(1, {
    message: "이름을 입력해주세요.",
  }),
});

export const categoryFormSchema = z.object({
  largeCategoryName: z.string().min(1, {
    message: "대분류를 선택하거나 입력해주세요.",
  }),
  mediumCategoryName: z.string().min(1, {
    message: "중분류를 선택하거나 입력해주세요.",
  }),
  smallCategoryName: z.string().min(1, {
    message: "소분류를 입력해주세요.",
  }),
});

export const colorFormSchema = z.object({
  name: z.string().min(1, {
    message: "이름을 입력해주세요.",
  }),
  value: z.string().min(1, {
    message: "색상 값을 입력해주세요.",
  }),
});

export const sizeFormSchema = z.object({
  name: z.string().min(1, {
    message: "이름을 입력해주세요.",
  }),
  value: z.string().min(1, {
    message: "사이즈 값을 입력해주세요.",
  }),
});
