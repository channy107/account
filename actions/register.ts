"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import db from "@/db/drizzle";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { user } from "@/db/schema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("잘못된 입력 값이 존재합니다.");
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("이미 존재하는 계정입니다.");
  }

  await db.insert(user).values({
    name: name,
    email: email,
    password: hashedPassword,
  });

  return { success: "회원 가입 성공!!" };
};
