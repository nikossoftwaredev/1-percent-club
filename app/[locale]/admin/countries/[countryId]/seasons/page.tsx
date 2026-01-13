import { setRequestLocale } from "next-intl/server";
import { SeasonsManager } from "@/components/admin/seasons-manager";
import { TypographyH2 } from "@/components/ui/typography";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/countries">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <TypographyH2>{country?.name ?? "Country"} - Seasons</TypographyH2>
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
