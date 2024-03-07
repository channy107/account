import { relations } from "drizzle-orm";
import { text, timestamp, pgTable, uuid, integer } from "drizzle-orm/pg-core";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  image: text("image"),
  password: text("password").notNull(),
  role: text("role")
    .notNull()
    .$type<UserRole>()
    .$default(() => UserRole.USER),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
}));

export const account = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId").notNull(),
  type: text("userId").notNull(),
  provider: text("provider").notNull().unique(),
  providerAccountId: text("providerAccountId").notNull().unique(),
  refreshToken: text("refreshToken"),
  accessToken: text("accessToken"),
  expiresAt: integer("expiresAt"),
  tokenType: text("tokenType"),
  scope: text("scope"),
  idToken: text("idToken"),
  sessionState: text("sessionState"),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
