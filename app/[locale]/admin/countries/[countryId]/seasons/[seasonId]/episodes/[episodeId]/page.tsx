import { setRequestLocale } from "next-intl/server";
import { QuestionsManager } from "@/components/admin/questions-manager";
import { ChevronLeft, Play } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  getQuestions,
  getEpisodeWithSeasonAndCountry,
} from "@/server-actions/questions";

interface QuestionsPageProps {
  params: Promise<{
    locale: string;
    countryId: string;
    seasonId: string;
    episodeId: string;
  }>;
}

const QuestionsPage = async ({ params }: QuestionsPageProps) => {
  const { locale, countryId, seasonId, episodeId } = await params;
  setRequestLocale(locale);

  const [questions, episode] = await Promise.all([
    getQuestions(episodeId),
    getEpisodeWithSeasonAndCountry(episodeId),
  ]);

  const quizUrl = episode
    ? `/countries/${episode.season.country.slug}/seasons/${episode.season.number}/episodes/${episode.number}`
    : undefined;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/countries/${countryId}/seasons/${seasonId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {episode?.season?.country?.name} — S{episode?.season?.number} E
            {episode?.number} Questions
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in questions for this episode
          </p>
        </div>
        {quizUrl && (
          <Button variant="default" size="default" asChild>
            <Link href={quizUrl} target="_blank">
              <Play className="h-4 w-4 mr-2" />
              Play Episode
            </Link>
          </Button>
        )}
      </div>
      <QuestionsManager
        countryId={countryId}
        seasonId={seasonId}
        episodeId={episodeId}
        initialQuestions={questions}
        quizUrl={quizUrl}
      />
    </div>
  );
};

export default QuestionsPage;
