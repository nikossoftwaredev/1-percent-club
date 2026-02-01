import { setRequestLocale } from "next-intl/server";
import { EpisodesManager } from "@/components/admin/episodes-manager";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getEpisodes, getSeasonWithCountry } from "@/server-actions/episodes";

interface EpisodesPageProps {
  params: Promise<{
    locale: string;
    countryId: string;
    seasonId: string;
  }>;
}

const EpisodesPage = async ({ params }: EpisodesPageProps) => {
  const { locale, countryId, seasonId } = await params;
  setRequestLocale(locale);

  const [episodes, season] = await Promise.all([
    getEpisodes(seasonId),
    getSeasonWithCountry(seasonId),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/countries/${countryId}/seasons`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {season?.country?.name} — S{season?.number} Episodes
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select an episode to manage its questions
          </p>
        </div>
      </div>
      <EpisodesManager
        countryId={countryId}
        seasonId={seasonId}
        initialEpisodes={episodes}
      />
    </div>
  );
};

export default EpisodesPage;
