"use server";

import db from "@/db/drizzle";
import { service } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getServices = async () => {
  const services = await db.query.service.findMany();

  return services;
};

export const getServiceByName = async (name: string) => {
  const response = await db.query.service.findFirst({
    where: eq(service.name, name),
  });

  return response;
};

export const getCategories = async (name: string) => {
  const response = await db.query.serviceCategory.findMany({
    with: {
      service: true,
    },
    orderBy: (serviceCategory, { desc }) => [desc(serviceCategory.isMain)],
  });

  const categories = response.filter(
    (category) => category.service.name === name
  );

  return categories;
};
