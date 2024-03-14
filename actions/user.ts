"use server";

import db from "@/db/drizzle";
import { UserRole, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getUsers = async () => {
  const users = await db.query.user.findMany({
    with: {
      accounts: true,
    },
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });
  return users;
};

export const getUser = async (id: string) => {
  const response = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  return response;
};

export const updateUser = async ({
  id,
  role,
}: {
  id: string;
  role: UserRole;
}) => {
  const result = await db
    .update(user)
    .set({
      role,
    })
    .where(eq(user.id, id));
  revalidatePath("/");
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await db.delete(user).where(eq(user.id, id));
  revalidatePath("/");
  return result;
};
