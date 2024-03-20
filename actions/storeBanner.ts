"use server";

import db from "@/db/drizzle";
import { storeBanner } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ADMIN_STORE_ROUTES } from "@/routes";

export const getBanners = async () => {
  const banners = await db.query.storeBanner.findMany({
    orderBy: (storeBanner, { desc }) => [desc(storeBanner.createdAt)],
  });

  return banners;
};

export const getBanner = async (id?: string) => {
  if (!id) return undefined;
  const response = await db.query.storeBanner.findFirst({
    where: eq(storeBanner.id, id),
  });

  return response;
};

export const createBanner = async ({
  name,
  images,
}: {
  name: string;
  images: string[];
}) => {
  const result = await db
    .insert(storeBanner)
    .values({
      name,
      images,
    })
    .returning();

  revalidatePath(`${ADMIN_STORE_ROUTES.BANNER}`);

  return result;
};

export const updateBanner = async ({
  id,
  name,
  images,
}: {
  id: string;
  name: string;
  images: string[];
}) => {
  const result = await db
    .update(storeBanner)
    .set({
      name,
      images,
    })
    .where(eq(storeBanner.id, id));
  revalidatePath(`${ADMIN_STORE_ROUTES.BANNER}`);
  return result;
};

export const deleteBanner = async (id: string) => {
  const result = await db.delete(storeBanner).where(eq(storeBanner.id, id));
  revalidatePath(`${ADMIN_STORE_ROUTES.BANNER}`);
  return result;
};
