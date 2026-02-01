import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { cache } from "react";

import { EpisodeQuiz } from "@/components/quiz/episode-quiz";
import { getDifficultyLabel } from "@/lib/quiz/difficulty";
import { getEpisodeForQuiz } from "@/server-actions/episodes";

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

  const questionText = questionData?.questionText ?? "";
  const countryName = episodeData?.season.country.name ?? country;

  // Include the question text in the title so Google can match searches
  const title = questionText
    ? `${questionText.slice(0, 70)} - 1% Club`
    : `Question ${question} - 1% Club`;

  // Full question text in description for search matching
  const description = questionText
    ? `${questionText} | 1% Club ${countryName} S${season} E${episode} - Only ${difficulty} of people can answer this. Can you?`
    : "Can you answer this question? Test your knowledge with the 1% Club quiz!";

  return {
    title,
    description,
    openGraph: {
      title: questionText
        ? `${questionText.slice(0, 100)} | 1% Club`
        : `1% Club - Question ${question}`,
      description: `Only ${difficulty} of people got this right! ${countryName} Season ${season}, Episode ${episode}. Can you answer it?`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: questionText
        ? `${questionText.slice(0, 100)} | 1% Club`
        : `1% Club - Question ${question}`,
      description: `Only ${difficulty} of people got this right! Can you?`,
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
