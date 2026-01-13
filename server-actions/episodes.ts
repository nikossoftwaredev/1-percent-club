"use server";

import { prisma } from "@/lib/db";

export interface EpisodeWithQuestionCount {
  id: string;
  number: number;
  title: string | null;
  airDate: Date | null;
  isActive: boolean;
  _count: {
    questions: number;
  };
}

export const getEpisodes = async (seasonId: string): Promise<EpisodeWithQuestionCount[]> => {
  const episodes = await prisma.episode.findMany({
    where: { seasonId },
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { number: "asc" },
  });

  return episodes;
};

export const getSeasonWithCountry = async (seasonId: string) => {
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    include: {
      country: true,
    },
  });

  return season;
};

// Public: Get episode with questions for quiz
export interface QuizQuestion {
  id: string;
  questionText: string;
  questionImage: string | null;
  difficulty: string;
  explanation: string;
  orderInShow: number | null;
  answers: {
    id: string;
    answerText: string;
    answerImage: string | null;
    isCorrect: boolean;
    orderIndex: number;
  }[];
}

export interface EpisodeForQuiz {
  id: string;
  number: number;
  title: string | null;
  season: {
    number: number;
    country: {
      name: string;
      slug: string;
      flagImage: string | null;
    };
  };
  questions: QuizQuestion[];
}

export const getEpisodeForQuiz = async (
  countrySlug: string,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeForQuiz | null> => {
  // First find the country
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    select: { id: true },
  });

  if (!country) return null;

  // Find the season
  const season = await prisma.season.findFirst({
    where: {
      countryId: country.id,
      number: seasonNumber,
    },
    select: { id: true },
  });

  if (!season) return null;

  // Find the episode with questions
  const episode = await prisma.episode.findFirst({
    where: {
      seasonId: season.id,
      number: episodeNumber,
    },
    include: {
      season: {
        include: {
          country: {
            select: {
              name: true,
              slug: true,
              flagImage: true,
            },
          },
        },
      },
      questions: {
        where: {
          isActive: true,
          questionText: { not: "" }, // Only include filled questions
        },
        include: {
          answers: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderInShow: "asc" },
      },
    },
  });

  return episode;
};
