"use server";

import db from "@/db/drizzle";
import { colorsToProducts, sizesToProducts, storeProduct } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getProducts = async () => {
  const products = await db.query.storeProduct.findMany({
    with: {
      category: true,
      brand: true,
      colorsToProducts: {
        with: {
          color: {
            columns: {
              name: true,
            },
          },
        },
      },
      sizesToProducts: {
        with: {
          size: {
            columns: {
              name: true,
            },
          },
        },
      },
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
      brand: true,
      colorsToProducts: {
        with: {
          color: {
            columns: {
              name: true,
            },
          },
        },
      },
      sizesToProducts: {
        with: {
          size: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
    where: eq(storeProduct.id, id),
  });

  return response;
};

export const createProduct = async ({
  name,
  price,
  saleRate,
  images,
  sizes,
  categoryId,
  brandId,
  colors,
}: {
  name: string;
  price: number;
  saleRate: number;
  images: string[];
  categoryId: string;
  sizes: Array<{ id: string; name: string }>;
  colors: Array<{ id: string; name: string }>;
  brandId: string;
}) => {
  const result = await db
    .insert(storeProduct)
    .values({
      name,
      price,
      isSale: saleRate !== 0,
      saleRate,
      images,
      categoryId,
      brandId,
    })
    .returning();

  colors.forEach(async (color) => {
    await db.insert(colorsToProducts).values({
      productId: result[0].id,
      colorId: color.id,
    });
  });

  sizes.forEach(async (size) => {
    await db.insert(sizesToProducts).values({
      productId: result[0].id,
      sizeId: size.id,
    });
  });

  revalidatePath(`${ADMIN_STORE_ROUTES.PRODUCT}`);

  return result;
};

export const updateProduct = async ({
  id,
  name,
  price,
  saleRate,
  images,
  sizes,
  categoryId,
  brandId,
  colors,
}: {
  id: string;
  name: string;
  price: number;
  saleRate: number;
  sizes: Array<{ id: string; name: string }>;
  images: string[];
  categoryId: string;
  colors: Array<{ id: string; name: string }>;
  brandId: string;
}) => {
  const result = await db
    .update(storeProduct)
    .set({
      name,
      price,
      isSale: saleRate !== 0,
      saleRate,
      images,
      categoryId,
      brandId,
    })
    .where(eq(storeProduct.id, id));

  colors.forEach(async (color) => {
    await db
      .update(colorsToProducts)
      .set({
        colorId: color.id,
      })
      .where(eq(colorsToProducts.productId, id));
  });

  sizes.forEach(async (size) => {
    await db
      .update(sizesToProducts)
      .set({
        sizeId: size.id,
      })
      .where(eq(sizesToProducts.productId, id));
  });

  revalidatePath(`${ADMIN_STORE_ROUTES.PRODUCT}`);

  return result;
};

export const deleteProduct = async (id: string) => {
  const result = await db.delete(storeProduct).where(eq(storeProduct.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.PRODUCT}`);

  return result;
};
