import db from "@/db/drizzle";
import { verificationToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const response = await db.query.verificationToken.findFirst({
      where: eq(verificationToken.token, token),
    });

    if (!response) {
      return null;
    }

    return response;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const response = await db.query.verificationToken.findFirst({
      where: eq(verificationToken.email, email),
    });

    if (!response) {
      return null;
    }

    return response;
  } catch {
    return null;
  }
};
