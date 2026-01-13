import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getEpisodeForQuiz } from "@/server-actions/episodes";
import { EpisodeQuiz } from "@/components/quiz/episode-quiz";

interface EpisodeQuizPageProps {
  params: Promise<{
    locale: string;
    country: string;
    season: string;
    episode: string;
  }>;
}

const EpisodeQuizPage = async ({ params }: EpisodeQuizPageProps) => {
  const { locale, country, season, episode } = await params;
  setRequestLocale(locale);

  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);

  if (isNaN(seasonNumber) || isNaN(episodeNumber)) {
    notFound();
  }

  const episodeData = await getEpisodeForQuiz(country, seasonNumber, episodeNumber);

  if (!episodeData) {
    notFound();
  }

  return <EpisodeQuiz episode={episodeData} />;
};

export default EpisodeQuizPage;
