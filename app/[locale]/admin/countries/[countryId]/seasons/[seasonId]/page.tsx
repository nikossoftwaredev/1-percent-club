import { setRequestLocale } from "next-intl/server";
import { EpisodesManager } from "@/components/admin/episodes-manager";
import { TypographyH2 } from "@/components/ui/typography";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/countries/${countryId}/seasons`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <TypographyH2>
          {season?.country?.name} - Season {season?.number} - Episodes
        </TypographyH2>
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
