import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { cn } from "@/lib/general/utils";
import { ArrowLeft, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEpisodesByCountryAndSeason } from "@/server-actions/episodes";
import { notFound } from "next/navigation";

interface EpisodesPageProps {
  params: Promise<{ locale: string; country: string; season: string }>;
}

const EpisodesPage = async ({ params }: EpisodesPageProps) => {
  const { locale, country, season } = await params;
  setRequestLocale(locale);

  const data = await getEpisodesByCountryAndSeason(country, parseInt(season));
  if (!data) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/countries/${country}/seasons`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2.5">
              {data.country.flagImage && (
                <img
                  src={data.country.flagImage}
                  alt={data.country.name}
                  className="h-5 w-7 object-cover rounded-sm"
                />
              )}
              <span className="font-bold text-lg">
                <span className="text-yellow-400">1% Club</span>
                <span className="text-muted-foreground mx-2">·</span>
                <span className="text-foreground">{data.country.name}</span>
                <span className="text-muted-foreground mx-1.5">S{String(data.season.number).padStart(2, "0")}</span>
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
              Season {data.season.number}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Select Episode
            </h1>
            <div className="mt-4 mx-auto w-16 h-px bg-linear-to-r from-transparent via-yellow-500/40 to-transparent" />
          </div>

          {data.episodes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No episodes available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.episodes.map((episode, i) => {
                const progress = episode.totalQuestions > 0
                  ? Math.round((episode.filledQuestionsCount / episode.totalQuestions) * 100)
                  : 0;

                return (
                  <Link
                    key={episode.id}
                    href={`/countries/${country}/seasons/${season}/episodes/${episode.number}`}
                    className={cn(
                      "animate-fade-up group relative overflow-hidden rounded-2xl bg-card border border-white/5 transition-all duration-400 card-glow",
                      i < 5 && `delay-${(i + 1) * 100}`,
                      i >= 5 && "delay-500",
                    )}
                  >
                    {/* Episode visual */}
                    <div className="relative aspect-square overflow-hidden bg-linear-to-br from-yellow-500/10 via-transparent to-orange-500/5">
                      {/* Large background number */}
                      <span className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white/4 leading-none select-none">
                        {String(episode.number).padStart(2, "0")}
                      </span>

                      {/* Episode number */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-500/40">EP</p>
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-400 to-orange-500">
                          {String(episode.number).padStart(2, "0")}
                        </p>
                      </div>

                      {/* Question count badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <Badge className="bg-black/60 text-white/80 border-none backdrop-blur-md text-[10px] px-1.5 py-0.5">
                          {episode.filledQuestionsCount}/{episode.totalQuestions}
                        </Badge>
                      </div>

                      {/* Progress bar at bottom */}
                      {episode.totalQuestions > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
                          <div
                            className="h-full bg-linear-to-r from-yellow-400 to-orange-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground group-hover:text-yellow-400 transition-colors duration-300">
                      <Play className="h-3 w-3" />
                      <span className="font-medium tracking-wide">Play</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EpisodesPage;
