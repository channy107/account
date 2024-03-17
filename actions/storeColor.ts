"use server";

import db from "@/db/drizzle";
import { storeColor } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getColors = async () => {
  const colors = await db.query.storeColor.findMany({
    orderBy: (storeColor, { desc }) => [desc(storeColor.createdAt)],
  });

  return colors;
};

export const getColor = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeColor.findFirst({
    where: eq(storeColor.id, id),
  });

  return response;
};

export const createColor = async ({
  serviceId,
  name,
  value,
}: {
  serviceId: string;
  name: string;
  value: string;
}) => {
  const result = await db
    .insert(storeColor)
    .values({
      serviceId,
      name,
      value,
    })
    .returning();

  revalidatePath("/");

  return result;
};

export const updateColor = async ({
  id,
  name,
  value,
}: {
  id: string;
  name: string;
  value: string;
}) => {
  const result = await db
    .update(storeColor)
    .set({
      name,
      value,
    })
    .where(eq(storeColor.id, id));
  revalidatePath("/");
  return result;
};

export const deleteColor = async (id: string) => {
  const result = await db.delete(storeColor).where(eq(storeColor.id, id));
  revalidatePath("/");
  return result;
};
