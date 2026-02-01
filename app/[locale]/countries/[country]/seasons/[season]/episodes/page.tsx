import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/countries/${country}/seasons`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {data.country.flagImage && (
                <img
                  src={data.country.flagImage}
                  alt={data.country.name}
                  className="h-6 w-8 object-cover rounded"
                />
              )}
              <div className="font-bold text-xl">
                {data.country.name} - Season {data.season.number}
              </div>
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
            <h1 className="text-3xl md:text-4xl font-bold">Select Episode</h1>
            <p className="text-muted-foreground">
              Choose an episode to start playing
            </p>
          </div>

          {data.episodes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No episodes available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.episodes.map((episode) => (
                <Link
                  key={episode.id}
                  href={`/countries/${country}/seasons/${season}/episodes/${episode.number}`}
                  className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
                >
                  {/* Episode number header */}
                  <div className="relative h-24 bg-linear-to-br from-primary/80 to-primary flex items-center justify-center">
                    <span className="text-5xl font-bold text-white/20">
                      {String(episode.number).padStart(2, "0")}
                    </span>

                    {/* Question count badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/50 text-white border-none backdrop-blur-sm text-xs">
                        {episode.filledQuestionsCount}/{episode.totalQuestions}
                      </Badge>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/60 to-transparent">
                      <h2 className="text-sm font-bold text-white">
                        Episode {episode.number}
                      </h2>
                    </div>
                  </div>

                  {/* Play action */}
                  <div className="p-3 flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Play className="h-3.5 w-3.5" />
                    <span>Play</span>
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

export default EpisodesPage;
