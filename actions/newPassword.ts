"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { getUserByEmail } from "@/data/user";
import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { NewPasswordSchema } from "@/schemas";
import { passwordResetToken, user } from "@/db/schema";
import db from "@/db/drizzle";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "토큰이 존재하지 않습니다." };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("유효하지 않은 필드가 존재합니다.");
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    throw new Error("유효하지않은 토큰입니다.");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new Error("만료된 토큰입니다.");
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new Error("존재하지 않는 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(user)
    .set({ password: hashedPassword })
    .where(eq(user.id, existingUser.id));

  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.id, existingToken.id));

  return { success: "패스워드 변경을 완료했습니다." };
};
