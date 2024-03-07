import db from "@/db/drizzle";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.query.account.findMany({
      where: (account, { eq }) => eq(account.id, userId),
    });

    return account;
  } catch {
    return null;
  }
};
