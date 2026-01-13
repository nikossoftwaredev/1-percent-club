"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export interface QuestionWithAnswers {
  id: string;
  questionText: string;
  questionImage: string | null;
  difficulty: string;
  explanation: string;
  orderInShow: number | null;
  isActive: boolean;
  answers: {
    id: string;
    answerText: string;
    answerImage: string | null;
    isCorrect: boolean;
    orderIndex: number;
  }[];
}

export const getQuestions = async (episodeId: string): Promise<QuestionWithAnswers[]> => {
  const questions = await prisma.question.findMany({
    where: { episodeId },
    include: {
      answers: {
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: { orderInShow: "asc" },
  });

  return questions;
};

export const getEpisodeWithSeasonAndCountry = async (episodeId: string) => {
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      season: {
        include: {
          country: true,
        },
      },
    },
  });

  return episode;
};

interface UpdateQuestionInput {
  id: string;
  questionText: string;
  questionImage?: string | null;
  explanation: string;
  answers?: {
    id?: string;
    answerText: string;
    answerImage?: string | null;
    isCorrect: boolean;
    orderIndex: number;
  }[];
}

export const updateQuestion = async (
  input: UpdateQuestionInput,
  episodeId: string,
  seasonId: string,
  countryId: string
) => {
  const { id, answers, ...data } = input;

  // Update question and answers in a transaction
  const question = await prisma.$transaction(async (tx) => {
    // Update the question
    const updatedQuestion = await tx.question.update({
      where: { id },
      data,
    });

    // Delete existing answers and create new ones if provided
    if (answers && answers.length > 0) {
      await tx.answer.deleteMany({
        where: { questionId: id },
      });

      await tx.answer.createMany({
        data: answers.map((a) => ({
          questionId: id,
          answerText: a.answerText,
          answerImage: a.answerImage || null,
          isCorrect: a.isCorrect,
          orderIndex: a.orderIndex,
        })),
      });
    }

    return updatedQuestion;
  });

  revalidatePath(
    `/admin/countries/${countryId}/seasons/${seasonId}/episodes/${episodeId}`
  );
  return question;
};
