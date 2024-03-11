"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { user, verificationToken } from "@/db/schema";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

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

  const generatedVerificationToken = await generateVerificationToken(email);

  try {
    await sendVerificationEmail(
      generatedVerificationToken.email,
      generatedVerificationToken.token
    );
  } catch (error) {
    await db.delete(user).where(eq(user.email, email));
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.email, generatedVerificationToken.email));

    throw new Error("메일 발송에 실패하였습니다.");
  }

  return {
    success: "회원가입을 위한 이메일을 발송했습니다. \n이메일을 확인해주세요.",
  };
};
