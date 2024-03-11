import db from "@/db/drizzle";
import { passwordResetToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const response = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });

    if (!response) {
      return null;
    }

    return response;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const response = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });

    if (!response) {
      return null;
    }

    return response;
  } catch {
    return null;
  }
};
