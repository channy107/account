"use server";

import db from "@/db/drizzle";
import { storeBrand } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getBrands = async () => {
  const brands = await db.query.storeBrand.findMany({
    orderBy: (storeBrand, { desc }) => [desc(storeBrand.createdAt)],
  });

  return brands;
};

export const getBrand = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeBrand.findFirst({
    where: eq(storeBrand.id, id),
  });

  return response;
};

export const createBrand = async ({ name }: { name: string }) => {
  const result = await db
    .insert(storeBrand)
    .values({
      name,
    })
    .returning();

  revalidatePath(`${ADMIN_STORE_ROUTES.BRAND}`);

  return result;
};

export const updateBrand = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const result = await db
    .update(storeBrand)
    .set({
      name,
    })
    .where(eq(storeBrand.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.BRAND}`);

  return result;
};

export const deleteBrand = async (id: string) => {
  const result = await db.delete(storeBrand).where(eq(storeBrand.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.BRAND}`);

  return result;
};
