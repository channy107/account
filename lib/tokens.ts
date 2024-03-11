import { v4 as uuidv4 } from "uuid";

import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { verificationToken, passwordResetToken } from "@/db/schema";
import { getPasswordResetTokenByEmail } from "@/data/passwordResetToken";

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.id, existingToken.id));
  }

  const generatedPasswordResetToken = await db
    .insert(passwordResetToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return generatedPasswordResetToken[0];
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.id, existingToken.id));
  }

  const generatedVerificationToken = await db
    .insert(verificationToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return generatedVerificationToken[0];
};
