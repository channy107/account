"use server";

import db from "@/db/drizzle";
import { storeCategory } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getCategories = async (
  type: string = "small",
  parentId: string | null = null
) => {
  const categories = await db.query.storeCategory.findMany({
    orderBy: (storeCategory, { desc }) => [desc(storeCategory.createdAt)],
    where: and(
      eq(storeCategory.type, type),
      parentId ? eq(storeCategory.parentCategoryId, parentId) : undefined
    ),
    with: {
      parentCategory: {
        with: {
          parentCategory: true,
        },
      },
    },
  });

  return categories;
};

export const getCategory = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeCategory.findFirst({
    where: eq(storeCategory.id, id),
    with: {
      parentCategory: true,
    },
  });

  return response;
};

export const getCategoryByName = async (name: string) => {
  const response = await db.query.storeCategory.findFirst({
    where: eq(storeCategory.name, name),
  });
  return response;
};

export const createCategory = async ({
  categoryLarge,
  categoryMedium,
  categorySmall,
}: {
  categoryLarge: { name: string; type: string };
  categoryMedium: { name: string; type: string };
  categorySmall: { name: string; type: string };
}) => {
  try {
    const categoryLargeResult = await db
      .insert(storeCategory)
      .values({
        name: categoryLarge.name,
        type: categoryLarge.type,
      })
      .onConflictDoUpdate({
        target: [storeCategory.name, storeCategory.parentCategoryId],
        set: { name: categoryLarge.name, type: categoryLarge.type },
      })
      .returning();

    const categoryMediumResult = await db
      .insert(storeCategory)
      .values({
        name: categoryMedium.name,
        type: categoryMedium.type,
        parentCategoryId: categoryLargeResult[0].id,
      })
      .onConflictDoUpdate({
        target: [storeCategory.name, storeCategory.parentCategoryId],
        set: { name: categoryMedium.name, type: categoryMedium.type },
      })
      .returning();
    await db
      .insert(storeCategory)
      .values({
        name: categorySmall.name,
        type: categorySmall.type,
        parentCategoryId: categoryMediumResult[0].id,
      })
      .returning();
  } catch (error) {
    console.error(error);
    throw new Error("이미 존재하는 카테고리입니다.");
  }
  revalidatePath(`${ADMIN_STORE_ROUTES.CATEGORY}`);
};

export const deleteCategory = async (id: string) => {
  const result = await db.delete(storeCategory).where(eq(storeCategory.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.CATEGORY}`);

  return result;
};
