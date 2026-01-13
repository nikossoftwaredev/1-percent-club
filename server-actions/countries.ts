"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

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

export const getCountries = async (): Promise<CountryWithSeasonCount[]> => {
  const countries = await prisma.country.findMany({
    include: {
      _count: {
        select: { seasons: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return countries;
};

export const getCountryById = async (id: string) => {
  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      _count: {
        select: { seasons: true },
      },
    },
  });

  return country;
};

interface CreateCountryInput {
  name: string;
  code: string;
  flagImage?: string;
}

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

interface UpdateCountryInput {
  id: string;
  name?: string;
  code?: string;
  flagImage?: string;
  isActive?: boolean;
}

export const updateCountry = async (input: UpdateCountryInput) => {
  const { id, ...data } = input;

  // If name is being updated, update the slug too
  const updateData: Record<string, unknown> = { ...data };
  if (data.name) {
    updateData.slug = data.name.toLowerCase().replace(/\s+/g, "-");
  }
  if (data.code) {
    updateData.code = data.code.toUpperCase();
  }

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

// Public: Get country by slug with seasons and episode counts
export interface SeasonWithEpisodeCount {
  id: string;
  number: number;
  year: number | null;
  isFinished: boolean;
  isActive: boolean;
  _count: {
    episodes: number;
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

export const getCountryBySlug = async (slug: string): Promise<CountryWithSeasons | null> => {
  const country = await prisma.country.findUnique({
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

  return country;
};
