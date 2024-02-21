import db from "@/db/drizzle";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.user.findMany({
      where: (user, { eq }) => eq(user.email, email),
    });
    const notFoundUser = user.length === 0;

    return notFoundUser ? null : user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.user.findMany({
      where: (user, { eq }) => eq(user.id, id),
    });

    const notFoundUser = user.length === 0;

    return notFoundUser ? null : user;
  } catch {
    return null;
  }
};
