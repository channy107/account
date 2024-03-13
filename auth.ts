import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { UserRole, user as dbUser } from "@/db/schema";
import { getAccountByUserId } from "./data/account";
import db from "./db/drizzle";
import { eq } from "drizzle-orm";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/register",
    signOut: "/logout",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(dbUser)
        .set({ emailVerified: new Date(), role: UserRole.USER })
        .where(eq(dbUser.id, user.id!));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      if (!token.isOAuth) {
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        const existingAccount = await getAccountByUserId(existingUser.id);

        token.isOAuth = existingAccount?.length !== 0;
        token.role = existingUser.role;
        return token;
      }

      return token;
    },
    async session({ token, session }) {
      if (session.user && (!session.user.isOAuth || !session.user.role)) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
