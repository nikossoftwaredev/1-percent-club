import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { ArrowLeft } from "lucide-react";
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
                  className="h-6 w-6 rounded object-cover"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.episodes.map((episode) => (
              <Card
                key={episode.id}
                className="relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Episode {episode.number}</span>
                    <Badge variant="secondary">
                      {episode.filledQuestionsCount}/{episode.totalQuestions}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href={`/countries/${country}/seasons/${season}/episodes/${episode.number}`}>
                      Start Episode
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EpisodesPage;