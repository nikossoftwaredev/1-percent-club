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
  filledQuestionsCount: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionImage: string | null;
  questionExtraText: string | null;
  layout: string;
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

export const getEpisodes = async (seasonId: string): Promise<EpisodeWithQuestionCount[]> => {
  const episodes = await prisma.episode.findMany({
    where: { seasonId },
    include: {
      _count: {
        select: { questions: true },
      },
      questions: {
        select: { questionText: true },
      },
    },
    orderBy: { number: "asc" },
  });

  return episodes.map((episode) => ({
    id: episode.id,
    number: episode.number,
    title: episode.title,
    airDate: episode.airDate,
    isActive: episode.isActive,
    _count: episode._count,
    filledQuestionsCount: episode.questions.filter((q) => q.questionText.trim() !== "").length,
  }));
};

export const getSeasonWithCountry = async (seasonId: string) => {
  return prisma.season.findUnique({
    where: { id: seasonId },
    include: {
      country: true,
    },
  });
};

export const getEpisodesByCountryAndSeason = async (
  countrySlug: string,
  seasonNumber: number
) => {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
  });

  if (!country) return null;

  const season = await prisma.season.findFirst({
    where: {
      countryId: country.id,
      number: seasonNumber,
    },
  });

  if (!season) return null;

  const episodes = await prisma.episode.findMany({
    where: { seasonId: season.id },
    include: {
      _count: {
        select: { questions: true },
      },
      questions: {
        select: { questionText: true },
      },
    },
    orderBy: { number: "asc" },
  });

  return {
    country,
    season,
    episodes: episodes.map((episode) => ({
      id: episode.id,
      number: episode.number,
      title: episode.title,
      airDate: episode.airDate,
      isActive: episode.isActive,
      totalQuestions: episode._count.questions,
      filledQuestionsCount: episode.questions.filter((q) => q.questionText.trim() !== "").length,
    })),
  };
};

export const getEpisodeForQuiz = async (
  countrySlug: string,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeForQuiz | null> => {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    select: { id: true },
  });

  if (!country) return null;

  const season = await prisma.season.findFirst({
    where: {
      countryId: country.id,
      number: seasonNumber,
    },
    select: { id: true },
  });

  if (!season) return null;

  return prisma.episode.findFirst({
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
          questionText: { not: "" },
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
};
