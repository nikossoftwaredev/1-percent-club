import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { ArrowLeft, Calendar, Play, Film, CheckCircle, Clock } from "lucide-react";
import { getCountryBySlug } from "@/server-actions/countries";

interface SeasonsPageProps {
  params: Promise<{ locale: string; country: string }>;
}

const SeasonsPage = async ({ params }: SeasonsPageProps) => {
  const { locale, country } = await params;
  setRequestLocale(locale);

  const countryData = await getCountryBySlug(country);

  if (!countryData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/countries">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {countryData.flagImage && (
                <img
                  src={countryData.flagImage}
                  alt={countryData.name}
                  className="h-6 w-8 object-cover rounded"
                />
              )}
              <div className="font-bold text-xl">1% Club - {countryData.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Select Season</h1>
            <p className="text-muted-foreground">
              Choose a season to explore all available episodes
            </p>
          </div>

          {countryData.seasons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No seasons available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryData.seasons.map((season) => (
                <Card
                  key={season.id}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                >
                  {/* Season header with gradient */}
                  <div className="relative h-32 bg-linear-to-br from-primary/80 to-primary flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/20">
                      {season.number}
                    </span>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      {season.isFinished ? (
                        <Badge className="bg-green-500/90 text-white border-none">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/90 text-white border-none">
                          <Clock className="h-3 w-3 mr-1" />
                          Airing
                        </Badge>
                      )}
                    </div>

                    {/* Season title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
                      <h2 className="text-xl font-bold text-white">
                        Season {season.number}
                      </h2>
                    </div>
                  </div>

                  {/* Card content */}
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {season.year && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {season.year}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Film className="h-4 w-4" />
                        {season._count.episodes} {season._count.episodes === 1 ? "Episode" : "Episodes"}
                      </div>
                    </div>

                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/countries/${country}/seasons/${season.number}/episodes`}>
                        <Play className="h-4 w-4 mr-2" />
                        Play Season
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeasonsPage;
