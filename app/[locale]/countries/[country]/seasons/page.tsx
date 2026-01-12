import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { ArrowLeft, Calendar, PlayCircle } from "lucide-react";

interface SeasonsPageProps {
  params: Promise<{ locale: string; country: string }>;
}

const SeasonsPage = async ({ params }: SeasonsPageProps) => {
  const { locale, country } = await params;
  setRequestLocale(locale);

  // TODO: Fetch country and seasons from database based on country slug
  const countryData = {
    id: "1",
    name: "United Kingdom",
    slug: "united-kingdom",
    flagEmoji: "🇬🇧",
    seoTitle: "The 1% Club UK - All Seasons & Episodes",
    seoDescription: "Play all questions from The 1% Club UK. Test yourself with questions that only 1% of the population can answer correctly!",
    seasons: [
      {
        id: "1",
        number: 1,
        title: "Season 1",
        year: 2022,
        description: "The inaugural season of The 1% Club UK with Lee Mack",
        imageUrl: "/images/uk-season-1.jpg",
        episodeCount: 8
      },
      {
        id: "2",
        number: 2,
        title: "Season 2",
        year: 2023,
        description: "The second season brings even tougher questions",
        imageUrl: "/images/uk-season-2.jpg",
        episodeCount: 10
      },
      {
        id: "3",
        number: 3,
        title: "Season 3",
        year: 2024,
        description: "The latest season with mind-bending challenges",
        imageUrl: "/images/uk-season-3.jpg",
        episodeCount: 12
      }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/countries">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{countryData.flagEmoji}</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryData.seasons.map((season) => (
              <Card
                key={season.id}
                className="relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {season.title}
                    <PlayCircle className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {season.year}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {season.episodeCount} Episodes Available
                  </p>
                  {season.description && (
                    <p className="text-sm">{season.description}</p>
                  )}
                  <Button className="w-full" asChild>
                    <Link href={`/countries/${country}/seasons/${season.number}/episodes`}>
                      View Episodes
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

export default SeasonsPage;