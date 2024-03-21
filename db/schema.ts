import { relations } from "drizzle-orm";
import {
  text,
  timestamp,
  pgTable,
  primaryKey,
  integer,
  uuid,
  boolean,
  AnyPgColumn,
  unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Account

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role")
    .$type<UserRole>()
    .$default(() => UserRole.USER),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TSelectUser = typeof user.$inferSelect;
export type TInsertUser = typeof user.$inferInsert;

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
}));

export const verificationToken = pgTable("verificationToken", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires").notNull(),
});

export const passwordResetToken = pgTable("passwordResetToken", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires").notNull(),
});

export const account = pgTable(
  "account",
  {
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull().unique(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    expires_in: integer("expires_in"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Admin

export const service = pgTable("service", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type TSelectService = typeof service.$inferSelect;

export const serviceRelations = relations(service, ({ many }) => ({
  serviceCategories: many(serviceCategory),
}));

export const serviceCategory = pgTable("serviceCategory", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  isMain: boolean("isMain").default(false),
  serviceId: uuid("serviceId")
    .notNull()
    .references(() => service.id, { onDelete: "cascade" }),
});

export type TSelectServiceCategory = typeof serviceCategory.$inferSelect;

export const serviceCategoryRelations = relations(
  serviceCategory,
  ({ one }) => ({
    service: one(service, {
      fields: [serviceCategory.serviceId],
      references: [service.id],
    }),
  })
);

// Admin > Store Service

export const storeBanner = pgTable("banner", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  images: text("images").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TSelectBanner = typeof storeBanner.$inferSelect;

export const storeCategory = pgTable(
  "storeCategory",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    type: text("type").notNull(),
    parentCategoryId: uuid("parentCategoryId").references(
      (): AnyPgColumn => storeCategory.id,
      { onDelete: "cascade" }
    ),
  },
  (table) => ({
    unq: unique().on(table.parentCategoryId, table.name).nullsNotDistinct(),
  })
);

export type TSelectStoreCategory = typeof storeCategory.$inferSelect;

export const storeCategoryRelations = relations(
  storeCategory,
  ({ one, many }) => ({
    parentCategory: one(storeCategory, {
      fields: [storeCategory.parentCategoryId],
      references: [storeCategory.id],
    }),
    products: many(storeProduct),
  })
);

export const storeColor = pgTable("storeColor", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TSelectStoreColor = typeof storeColor.$inferSelect;

export const storeColorRelations = relations(storeColor, ({ many }) => ({
  colorsToProducts: many(colorsToProducts),
}));

export const storeSize = pgTable("storeSize", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TSelectStoreSize = typeof storeSize.$inferSelect;

export const storeSizeRelations = relations(storeSize, ({ many }) => ({
  sizesToProducts: many(sizesToProducts),
}));

export const storeBrand = pgTable("storeBrand", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TSelectStoreBrand = typeof storeBrand.$inferSelect;

export const storeBrandRelations = relations(storeBrand, ({ many }) => ({
  products: many(storeProduct),
}));

export const storeProduct = pgTable("storeProduct", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  isSale: boolean("isSale"),
  saleRate: integer("saleRate"),
  isSoldOut: boolean("isSoldOut").default(false),
  images: text("images").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => storeCategory.id, { onDelete: "cascade" }),
  brandId: uuid("brandId")
    .notNull()
    .references(() => storeBrand.id, { onDelete: "cascade" }),
});

export type TSelectStoreProduct = typeof storeProduct.$inferSelect;

export const storeProductsRelations = relations(
  storeProduct,
  ({ one, many }) => ({
    category: one(storeCategory, {
      fields: [storeProduct.categoryId],
      references: [storeCategory.id],
    }),
    brand: one(storeBrand, {
      fields: [storeProduct.brandId],
      references: [storeBrand.id],
    }),
    colorsToProducts: many(colorsToProducts),
    sizesToProducts: many(sizesToProducts),
  })
);

export const colorsToProducts = pgTable("colorsToProducts", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  colorId: uuid("colorId")
    .notNull()
    .references(() => storeColor.id),
  productId: uuid("productId")
    .notNull()
    .references(() => storeProduct.id),
});

export const colorsToProductsRelations = relations(
  colorsToProducts,
  ({ one }) => ({
    color: one(storeColor, {
      fields: [colorsToProducts.colorId],
      references: [storeColor.id],
    }),
    product: one(storeProduct, {
      fields: [colorsToProducts.productId],
      references: [storeProduct.id],
    }),
  })
);

export const sizesToProducts = pgTable("sizesToProducts", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  sizeId: uuid("sizeId")
    .notNull()
    .references(() => storeSize.id),
  productId: uuid("productId")
    .notNull()
    .references(() => storeProduct.id),
});

export const sizesToProductsRelations = relations(
  sizesToProducts,
  ({ one }) => ({
    size: one(storeSize, {
      fields: [sizesToProducts.sizeId],
      references: [storeSize.id],
    }),
    product: one(storeProduct, {
      fields: [sizesToProducts.productId],
      references: [storeProduct.id],
    }),
  })
);
