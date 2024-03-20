"use server";

import db from "@/db/drizzle";
import { storeCategory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getCategories = async () => {
  const categories = await db.query.storeCategory.findMany({
    orderBy: (storeCategory, { desc }) => [desc(storeCategory.createdAt)],
  });

  return categories;
};

export const getCategory = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeCategory.findFirst({
    where: eq(storeCategory.id, id),
  });

  return response;
};

export const createCategory = async ({ name }: { name: string }) => {
  const result = await db
    .insert(storeCategory)
    .values({
      name,
    })
    .returning();

  revalidatePath(`${ADMIN_STORE_ROUTES.CATEGORY}`);

  return result;
};

export const updateCategory = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const result = await db
    .update(storeCategory)
    .set({
      name,
    })
    .where(eq(storeCategory.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.CATEGORY}`);

  return result;
};

export const deleteCategory = async (id: string) => {
  const result = await db.delete(storeCategory).where(eq(storeCategory.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.CATEGORY}`);

  return result;
};
