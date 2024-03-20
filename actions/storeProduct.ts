"use server";

import db from "@/db/drizzle";
import { storeProduct } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getProducts = async () => {
  const products = await db.query.storeProduct.findMany({
    with: {
      category: true,
      color: true,
      brand: true,
    },
    orderBy: (storeProduct, { desc }) => [desc(storeProduct.createdAt)],
  });

  return products;
};

export const getProduct = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeProduct.findFirst({
    with: {
      category: true,
      color: true,
      brand: true,
    },
    where: eq(storeProduct.id, id),
  });

  return response;
};

export const createProduct = async ({
  name,
  price,
  isSale,
  saleRate,
  images,
  size,
  categoryId,
  brandId,
  colorId,
}: {
  name: string;
  price: number;
  isSale: boolean;
  saleRate: number;
  images: string[];
  categoryId: string;
  size: string;
  colorId: string;
  brandId: string;
}) => {
  const result = await db
    .insert(storeProduct)
    .values({
      name,
      price,
      isSale,
      saleRate,
      size,
      images,
      categoryId,
      colorId,
      brandId,
    })
    .returning();

  revalidatePath(`${ADMIN_STORE_ROUTES.PRODUCT}`);

  return result;
};

export const updateProduct = async ({
  id,
  name,
  price,
  isSale,
  saleRate,
  images,
  size,
  categoryId,
  brandId,
  colorId,
}: {
  id: string;
  name: string;
  price: number;
  isSale: boolean;
  saleRate: number;
  size: string;
  images: string[];
  categoryId: string;
  colorId: string;
  brandId: string;
}) => {
  const result = await db
    .update(storeProduct)
    .set({
      name,
      price,
      isSale,
      saleRate,
      size,
      images,
      categoryId,
      colorId,
      brandId,
    })
    .where(eq(storeProduct.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.PRODUCT}`);

  return result;
};

export const deleteProduct = async (id: string) => {
  const result = await db.delete(storeProduct).where(eq(storeProduct.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.PRODUCT}`);

  return result;
};
