"use server";

import db from "@/db/drizzle";

export const getServices = async () => {
  const services = await db.query.service.findMany();

  return services;
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
