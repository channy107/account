"use server";

import db from "@/db/drizzle";
import { storeSize } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getSizes = async () => {
  const sizes = await db.query.storeSize.findMany({
    orderBy: (storeSize, { desc }) => [desc(storeSize.createdAt)],
  });

  return sizes;
};

export const getSize = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeSize.findFirst({
    where: eq(storeSize.id, id),
  });

  return response;
};

export const createSize = async ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => {
  const result = await db
    .insert(storeSize)
    .values({
      name,
      value,
    })
    .returning();

  revalidatePath(`${ADMIN_STORE_ROUTES.SIZE}`);

  return result;
};

export const updateSize = async ({
  id,
  name,
  value,
}: {
  id: string;
  name: string;
  value: string;
}) => {
  const result = await db
    .update(storeSize)
    .set({
      name,
      value,
    })
    .where(eq(storeSize.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.SIZE}`);

  return result;
};

export const deleteSize = async (id: string) => {
  const result = await db.delete(storeSize).where(eq(storeSize.id, id));

  revalidatePath(`${ADMIN_STORE_ROUTES.SIZE}`);

  return result;
};
