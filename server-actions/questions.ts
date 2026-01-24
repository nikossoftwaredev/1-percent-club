"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { Prisma, QuestionLayout } from "@prisma/client";

export type QuestionWithAnswers = Prisma.QuestionGetPayload<{
  include: { answers: true };
}>;

interface UpdateQuestionInput {
  id: string;
  questionText: string;
  questionImage?: string | null;
  questionExtraText?: string | null;
  layout?: QuestionLayout;
  explanation: string;
  answers?: {
    answerText: string;
    answerImage?: string | null;
    isCorrect: boolean;
    orderIndex: number;
  }[];
}

export const getQuestions = async (episodeId: string): Promise<QuestionWithAnswers[]> => {
  return prisma.question.findMany({
    where: { episodeId },
    include: {
      answers: {
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: { orderInShow: "asc" },
  });
};

export const getEpisodeWithSeasonAndCountry = async (episodeId: string) => {
  return prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      season: {
        include: {
          country: {
            select: {
              id: true,
              name: true,
              slug: true,
              flagImage: true,
            },
          },
        },
      },
    },
  });
};

export const updateQuestion = async (
  input: UpdateQuestionInput,
  episodeId: string,
  seasonId: string,
  countryId: string
) => {
  const { id, answers, ...data } = input;

  // Update question
  const question = await prisma.question.update({
    where: { id },
    data,
  });

  // Update answers if provided
  if (answers && answers.length > 0) {
    await prisma.answer.deleteMany({
      where: { questionId: id },
    });

    await prisma.answer.createMany({
      data: answers.map((a) => ({
        questionId: id,
        answerText: a.answerText,
        answerImage: a.answerImage || null,
        isCorrect: a.isCorrect,
        orderIndex: a.orderIndex,
      })),
    });
  }

  revalidatePath(
    `/admin/countries/${countryId}/seasons/${seasonId}/episodes/${episodeId}`
  );
  return question;
};
