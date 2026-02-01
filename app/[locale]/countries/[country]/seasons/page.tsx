import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { cn } from "@/lib/general/utils";
import { ArrowLeft, Calendar, Play, Film, CheckCircle, Clock } from "lucide-react";
import { getCountryBySlug } from "@/server-actions/countries";

interface SeasonsPageProps {
  params: Promise<{ locale: string; country: string }>;
}

const SeasonsPage = async ({ params }: SeasonsPageProps) => {
  const { locale, country } = await params;
  setRequestLocale(locale);

  const countryData = await getCountryBySlug(country);

  if (!countryData) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/countries">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2.5">
              {countryData.flagImage && (
                <img
                  src={countryData.flagImage}
                  alt={countryData.name}
                  className="h-5 w-7 object-cover rounded-sm"
                />
              )}
              <span className="font-bold text-lg">
                <span className="text-yellow-400">1% Club</span>
                <span className="text-muted-foreground mx-2">·</span>
                <span className="text-foreground">{countryData.name}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-500/60 mb-3">
              {countryData.name} Edition
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Select Season
            </h1>
            <div className="mt-4 mx-auto w-16 h-px bg-linear-to-r from-transparent via-yellow-500/40 to-transparent" />
          </div>

          {countryData.seasons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No seasons available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryData.seasons.map((season, i) => (
                <Link
                  key={season.id}
                  href={`/countries/${country}/seasons/${season.number}/episodes`}
                  className={cn(
                    "animate-fade-up group relative overflow-hidden rounded-2xl bg-card border border-white/5 transition-all duration-400 card-glow",
                    i === 0 && "delay-100",
                    i === 1 && "delay-200",
                    i === 2 && "delay-300",
                    i >= 3 && "delay-400",
                  )}
                >
                  {/* Season visual header */}
                  <div className="relative h-36 overflow-hidden bg-linear-to-br from-yellow-500/20 via-orange-500/10 to-transparent">
                    {/* Large background number */}
                    <span className="absolute -right-2 -top-4 text-8xl font-black text-white/[0.04] leading-none select-none">
                      {String(season.number).padStart(2, "0")}
                    </span>

                    {/* Season number display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-500/50 mb-1">Season</p>
                        <p className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-400 to-orange-500">
                          {String(season.number).padStart(2, "0")}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      {season.isFinished ? (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Clock className="h-3 w-3 mr-1" />
                          Airing
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-linear-to-r from-transparent via-yellow-500/20 to-transparent" />

                  {/* Card content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {season.year ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-yellow-500/50" />
                          <span>{season.year}</span>
                        </div>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1.5">
                        <Film className="h-3.5 w-3.5 text-yellow-500/50" />
                        <span>{season._count.episodes} {season._count.episodes === 1 ? "Episode" : "Episodes"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-yellow-400 transition-colors duration-300">
                      <Play className="h-3.5 w-3.5" />
                      <span className="font-medium tracking-wide">Play Season</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeasonsPage;
