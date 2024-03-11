"use server";

import * as z from "zod";
import { eq } from "drizzle-orm";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { passwordResetToken } from "@/db/schema";
import db from "@/db/drizzle";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("유효하지 않은 이메일입니다.");
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new Error("존재하지 않은 이메일입니다.");
  }

  const generatedPasswordResetToken = await generatePasswordResetToken(email);

  try {
    await sendPasswordResetEmail(
      generatedPasswordResetToken.email,
      generatedPasswordResetToken.token
    );
  } catch (error) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.email, generatedPasswordResetToken.email));

    throw new Error("메일 발송에 실패하였습니다.");
  }

  return {
    success:
      "비밀번호 재설정을 위한 메일을 발송했습니다. \n메일을 확인해주세요.",
  };
};
