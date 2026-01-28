import type { Metadata } from "next";
import { cache } from "react";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getEpisodeForQuiz } from "@/server-actions/episodes";
import { EpisodeQuiz } from "@/components/quiz/episode-quiz";
import { getDifficultyLabel } from "@/lib/quiz/difficulty";

// Cache the data fetch to share between generateMetadata and page
const getEpisodeData = cache(
  async (country: string, seasonNumber: number, episodeNumber: number) => {
    return getEpisodeForQuiz(country, seasonNumber, episodeNumber);
  }
);

interface QuestionPageProps {
  params: Promise<{
    locale: string;
    country: string;
    season: string;
    episode: string;
    question: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: QuestionPageProps): Promise<Metadata> => {
  const { country, season, episode, question } = await params;
  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);
  const questionNumber = parseInt(question, 10);

  const episodeData = await getEpisodeData(country, seasonNumber, episodeNumber);
  const questionData = episodeData?.questions.find(
    (q) => q.orderInShow === questionNumber
  );
  const difficulty = questionData
    ? getDifficultyLabel(questionData.difficulty)
    : "50%";

  const title = `Question ${question} - 1% Club`;
  const description = questionData?.questionText?.slice(0, 150) ||
    "Can you answer this question?";

  return {
    title,
    description,
    openGraph: {
      title: `1% Club - Question ${question}`,
      description: `Only ${difficulty} got this right! Can you?`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `1% Club - Question ${question}`,
      description: `Only ${difficulty} got this right! Can you?`,
    },
  };
};

const QuestionPage = async ({ params }: QuestionPageProps) => {
  const { locale, country, season, episode, question } = await params;
  setRequestLocale(locale);

  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);
  const questionNumber = parseInt(question, 10);

  if (isNaN(seasonNumber) || isNaN(episodeNumber) || isNaN(questionNumber)) {
    notFound();
  }

  const episodeData = await getEpisodeData(country, seasonNumber, episodeNumber);

  if (!episodeData) {
    notFound();
  }

  // Find the question by orderInShow
  const questionIndex = episodeData.questions.findIndex(
    (q) => q.orderInShow === questionNumber
  );

  if (questionIndex === -1) {
    notFound();
  }

  return (
    <EpisodeQuiz
      episode={episodeData}
      initialQuestionIndex={questionIndex}
    />
  );
};

export default QuestionPage;
