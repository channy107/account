"use server";

import { eq } from "drizzle-orm";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import db from "@/db/drizzle";
import { user, verificationToken } from "@/db/schema";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    throw new Error("존재하지 않은 토큰입니다.");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new Error("만료된 토큰 입니다.");
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new Error("존재하지 않는 이메일입니다.");
  }

  await db
    .update(user)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(user.id, existingUser.id));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.id, existingToken.id));

  return { success: "가입이 완료되었습니다." };
};
