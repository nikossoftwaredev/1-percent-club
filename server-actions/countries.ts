"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { SeasonWithEpisodeCount } from "./seasons";

export interface CountryWithSeasonCount {
  id: string;
  name: string;
  code: string;
  slug: string;
  flagImage: string | null;
  isActive: boolean;
  _count: {
    seasons: number;
  };
}

export interface CountryWithSeasons {
  id: string;
  name: string;
  code: string;
  slug: string;
  flagImage: string | null;
  isActive: boolean;
  seasons: SeasonWithEpisodeCount[];
}

interface CreateCountryInput {
  name: string;
  code: string;
  flagImage?: string;
}

interface UpdateCountryInput {
  id: string;
  name?: string;
  code?: string;
  flagImage?: string;
  isActive?: boolean;
}

export const getCountries = async (): Promise<CountryWithSeasonCount[]> => {
  return prisma.country.findMany({
    include: {
      _count: {
        select: { seasons: true },
      },
    },
    orderBy: { name: "asc" },
  });
};

export const getCountryById = async (id: string) => {
  return prisma.country.findUnique({
    where: { id },
    include: {
      _count: {
        select: { seasons: true },
      },
    },
  });
};

export const getCountryBySlug = async (slug: string): Promise<CountryWithSeasons | null> => {
  return prisma.country.findUnique({
    where: { slug },
    include: {
      seasons: {
        include: {
          _count: {
            select: { episodes: true },
          },
        },
        orderBy: { number: "asc" },
      },
    },
  });
};

export const createCountry = async (input: CreateCountryInput) => {
  const slug = input.name.toLowerCase().replace(/\s+/g, "-");

  const country = await prisma.country.create({
    data: {
      name: input.name,
      code: input.code.toUpperCase(),
      slug,
      flagImage: input.flagImage || null,
    },
  });

  revalidatePath("/admin/countries");
  return country;
};

export const updateCountry = async (input: UpdateCountryInput) => {
  const { id, ...data } = input;

  const updateData: Record<string, unknown> = { ...data };
  if (data.name) updateData.slug = data.name.toLowerCase().replace(/\s+/g, "-");
  if (data.code) updateData.code = data.code.toUpperCase();

  const country = await prisma.country.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/countries");
  return country;
};

export const deleteCountry = async (id: string) => {
  await prisma.country.delete({
    where: { id },
  });

  revalidatePath("/admin/countries");
};
