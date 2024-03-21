"use server";

import db from "@/db/drizzle";
import { UserRole, service, serviceCategory, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const initialSetting = async () => {
  await db
    .update(user)
    .set({
      role: UserRole.ADMIN,
    })
    .where(eq(user.id, "05887cd3-557b-4aaa-898c-782b6d9ab849"));

  const createdService = await db
    .insert(service)
    .values([
      {
        name: "common",
        label: "공통",
      },
      {
        name: "store",
        label: "쇼핑몰",
      },
    ])
    .returning();

  await db.insert(serviceCategory).values([
    {
      name: "user",
      label: "유저목록",
      isMain: true,
      serviceId: createdService[0].id,
    },
    {
      name: "product",
      label: "상품",
      isMain: true,
      serviceId: createdService[1].id,
    },
    {
      name: "banner",
      label: "배너",
      serviceId: createdService[1].id,
    },
    {
      name: "brand",
      label: "브랜드",
      serviceId: createdService[1].id,
    },
    {
      name: "category",
      label: "카테고리",
      serviceId: createdService[1].id,
    },
    {
      name: "size",
      label: "사이즈",
      serviceId: createdService[1].id,
    },
    {
      name: "color",
      label: "색상",
      serviceId: createdService[1].id,
    },
  ]);
};
