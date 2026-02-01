import type { Metadata } from "next";
import { cache } from "react";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getEpisodeForQuiz } from "@/server-actions/episodes";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const getEpisodeData = cache(
  async (country: string, seasonNumber: number, episodeNumber: number) =>
    getEpisodeForQuiz(country, seasonNumber, episodeNumber)
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

  if (isNaN(seasonNumber) || isNaN(episodeNumber)) notFound();

  const episodeData = await getEpisodeData(country, seasonNumber, episodeNumber);

  if (!episodeData) notFound();

  const totalQuestions = episodeData.questions.length;

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={BACKGROUND_STYLES}
    >
      {/* Layered overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/30" />
      <div className="noise-overlay absolute inset-0" />

      {/* Radial glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-yellow-500/5 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 max-w-xl w-full mx-4">
        <div className="golden-border animate-scale-in">
          <div className="p-10 md:p-14 bg-card backdrop-blur-sm rounded-xl text-center">
            {/* Country Flag & Name */}
            {episodeData.season.country.flagImage && (
              <div className="flex items-center justify-center gap-2.5 mb-6 animate-fade-in delay-200">
                <img
                  src={episodeData.season.country.flagImage}
                  alt={episodeData.season.country.name}
                  className="w-8 h-5.5 object-cover rounded-sm"
                />
                <span className="text-sm tracking-[0.15em] uppercase text-muted-foreground font-medium">
                  {episodeData.season.country.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="animate-fade-up delay-200 golden-shimmer text-4xl md:text-5xl font-black mb-3 tracking-tight">
              1% CLUB
            </h1>

            {/* Episode Info */}
            <div className="animate-fade-up delay-300 text-muted-foreground text-base mb-10">
              <span className="text-foreground font-medium">Season {season}</span>
              <span className="mx-3 text-yellow-500/30">|</span>
              <span className="text-foreground font-medium">Episode {episode}</span>
            </div>

            {/* Question Count */}
            <div className="animate-fade-up delay-400 golden-border-thin mb-10">
              <div className="py-6 px-8 bg-card rounded-lg">
                <p className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-400 to-orange-500 mb-1">
                  {totalQuestions}
                </p>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                  Questions
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="animate-fade-up delay-500 text-sm text-muted-foreground mb-10 leading-relaxed max-w-sm mx-auto">
              Answer questions that get progressively harder.
              Only 1% of people can answer them all.
            </p>

            {/* Start Button */}
            <div className="animate-fade-up delay-600">
              <Button
                asChild
                size="lg"
                className="bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600 text-base px-10 h-12"
              >
                <Link
                  href={`/countries/${country}/seasons/${season}/episodes/${episode}/question/1`}
                >
                  <Play className="h-5 w-5" />
                  Start Quiz
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodePage;
