import { setRequestLocale } from "next-intl/server";
import { QuestionsManager } from "@/components/admin/questions-manager";
import { TypographyH2 } from "@/components/ui/typography";
import { ChevronLeft } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/countries/${countryId}/seasons/${seasonId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <TypographyH2>
          {episode?.season?.country?.name} - S{episode?.season?.number} E
          {episode?.number} - Questions
        </TypographyH2>
      </div>
      <QuestionsManager
        countryId={countryId}
        seasonId={seasonId}
        episodeId={episodeId}
        initialQuestions={questions}
      />
    </div>
  );
};

export default QuestionsPage;
