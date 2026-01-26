import type { Metadata } from "next";
import { cache } from "react";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getEpisodeForQuiz } from "@/server-actions/episodes";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Cache the data fetch to share between generateMetadata and page
const getEpisodeData = cache(
  async (country: string, seasonNumber: number, episodeNumber: number) => {
    return getEpisodeForQuiz(country, seasonNumber, episodeNumber);
  }
);

interface EpisodePageProps {
  params: Promise<{
    locale: string;
    country: string;
    season: string;
    episode: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: EpisodePageProps): Promise<Metadata> => {
  const { country, season, episode } = await params;
  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);

  const episodeData = await getEpisodeData(country, seasonNumber, episodeNumber);

  const title = episodeData
    ? `Episode ${episode} - Season ${season} - 1% Club`
    : "Episode - 1% Club";
  const description = episodeData
    ? `Test your knowledge with ${episodeData.questions.length} questions from ${episodeData.season.country.name}!`
    : "Test your knowledge with the 1% Club quiz!";

  return {
    title,
    description,
    openGraph: {
      title: `1% Club - S${season} E${episode}`,
      description,
      type: "website",
    },
  };
};

const BACKGROUND_STYLES = {
  backgroundImage: `url('/background.jpg')`,
  backgroundPosition: "center",
  backgroundSize: "cover",
};

const EpisodePage = async ({ params }: EpisodePageProps) => {
  const { locale, country, season, episode } = await params;
  setRequestLocale(locale);

  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);

  if (isNaN(seasonNumber) || isNaN(episodeNumber)) {
    notFound();
  }

  const episodeData = await getEpisodeData(country, seasonNumber, episodeNumber);

  if (!episodeData) {
    notFound();
  }

  const totalQuestions = episodeData.questions.length;

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={BACKGROUND_STYLES}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className="golden-border">
          <div className="p-12 bg-card backdrop-blur-sm rounded-xl text-center">
            {/* Country Flag & Name */}
            {episodeData.season.country.flagImage && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src={episodeData.season.country.flagImage}
                  alt={episodeData.season.country.name}
                  className="w-10 h-7 object-cover rounded"
                />
                <span className="text-gray-400 text-lg">
                  {episodeData.season.country.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
              1% CLUB
            </h1>

            {/* Episode Info */}
            <div className="text-gray-300 text-xl mb-8">
              Season {season} • Episode {episode}
            </div>

            {/* Question Count */}
            <div className="golden-border-thin mb-8">
              <div className="p-6 bg-card rounded-lg">
                <p className="text-5xl font-bold text-yellow-400 mb-2">
                  {totalQuestions}
                </p>
                <p className="text-gray-400">Questions</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-8">
              Answer questions that get progressively harder. Only 1% of people
              can answer them all!
            </p>

            {/* Start Button */}
            <Button
              asChild
              className="bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600 text-lg px-8 py-6"
            >
              <Link
                href={`/countries/${country}/seasons/${season}/episodes/${episode}/question/1`}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodePage;
