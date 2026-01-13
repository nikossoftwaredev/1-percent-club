"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

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

export const getSeasons = async (countryId: string): Promise<SeasonWithEpisodeCount[]> => {
  const seasons = await prisma.season.findMany({
    where: { countryId },
    include: {
      _count: {
        select: { episodes: true },
      },
    },
    orderBy: { number: "asc" },
  });

  return seasons;
};

export const getNextSeasonNumber = async (countryId: string): Promise<number> => {
  const lastSeason = await prisma.season.findFirst({
    where: { countryId },
    orderBy: { number: "desc" },
    select: { number: true },
  });

  return (lastSeason?.number ?? 0) + 1;
};

// Standard 15-question difficulty levels for 1% Club
const DIFFICULTY_ORDER = [
  "NINETY",
  "EIGHTY",
  "SEVENTY",
  "SIXTY",
  "FIFTY",
  "FORTYFIVE",
  "FORTY",
  "THIRTYFIVE",
  "THIRTY",
  "TWENTYFIVE",
  "TWENTY",
  "FIFTEEN",
  "TEN",
  "FIVE",
  "ONE",
] as const;

interface CreateSeasonInput {
  countryId: string;
  year?: number;
  isFinished?: boolean;
  episodeCount?: number; // Number of episodes to pre-create
}

export const createSeason = async (input: CreateSeasonInput) => {
  const nextNumber = await getNextSeasonNumber(input.countryId);

  // Create season with episodes and questions in a transaction
  // Increase timeout to 30 seconds for creating many episodes/questions
  const season = await prisma.$transaction(
    async (tx) => {
      // Create the season
      const newSeason = await tx.season.create({
        data: {
          countryId: input.countryId,
          number: nextNumber,
          year: input.year || null,
          isFinished: input.isFinished ?? true,
        },
      });

      // Pre-create episodes with 15 questions each
      if (input.episodeCount && input.episodeCount > 0) {
        for (let i = 0; i < input.episodeCount; i++) {
          // Create episode
          const episode = await tx.episode.create({
            data: {
              seasonId: newSeason.id,
              number: i + 1,
            },
          });

          // Create 15 questions with correct difficulty levels
          const questions = DIFFICULTY_ORDER.map((difficulty, index) => ({
            episodeId: episode.id,
            questionText: "",
            explanation: "",
            difficulty,
            orderInShow: index + 1,
          }));

          await tx.question.createMany({
            data: questions,
          });
        }
      }

      return newSeason;
    },
    {
      maxWait: 10000, // 10 seconds to acquire connection
      timeout: 30000, // 30 seconds to complete transaction
    }
  );

  revalidatePath(`/admin/countries/${input.countryId}/seasons`);
  return season;
};

interface UpdateSeasonInput {
  id: string;
  countryId: string;
  year?: number | null;
  isFinished?: boolean;
}

export const updateSeason = async (input: UpdateSeasonInput) => {
  const { id, countryId, ...data } = input;

  const season = await prisma.season.update({
    where: { id },
    data,
  });

  revalidatePath(`/admin/countries/${countryId}/seasons`);
  return season;
};

export const deleteSeason = async (id: string, countryId: string) => {
  await prisma.season.delete({
    where: { id },
  });

  revalidatePath(`/admin/countries/${countryId}/seasons`);
};
