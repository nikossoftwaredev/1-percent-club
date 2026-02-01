import { setRequestLocale } from "next-intl/server";
import { SeasonsManager } from "@/components/admin/seasons-manager";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getSeasons, getNextSeasonNumber } from "@/server-actions/seasons";
import { getCountryById } from "@/server-actions/countries";

interface SeasonsPageProps {
  params: Promise<{
    locale: string;
    countryId: string;
  }>;
}

const SeasonsPage = async ({ params }: SeasonsPageProps) => {
  const { locale, countryId } = await params;
  setRequestLocale(locale);

  const [seasons, nextSeasonNumber, country] = await Promise.all([
    getSeasons(countryId),
    getNextSeasonNumber(countryId),
    getCountryById(countryId),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/countries">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {country?.name ?? "Country"} — Seasons
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage seasons and episodes
          </p>
        </div>
      </div>
      <SeasonsManager
        countryId={countryId}
        initialSeasons={seasons}
        nextSeasonNumber={nextSeasonNumber}
      />
    </div>
  );
};

export default SeasonsPage;
