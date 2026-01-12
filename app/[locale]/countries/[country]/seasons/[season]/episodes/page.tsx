import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EpisodesPageProps {
  params: Promise<{ locale: string; country: string; season: string }>;
}

const EpisodesPage = async ({ params }: EpisodesPageProps) => {
  const { locale, country, season } = await params;
  setRequestLocale(locale);

  // TODO: Fetch season and episodes from database
  const seasonData = {
    id: "1",
    number: parseInt(season),
    title: `Season ${season}`,
    year: 2022,
    description: "The inaugural season of The 1% Club UK with Lee Mack",
    country: {
      name: "United Kingdom",
      slug: "united-kingdom",
      flagEmoji: "🇬🇧"
    },
    episodes: [
      {
        id: "1",
        number: 1,
        title: "Episode 1",
        airDate: new Date("2022-04-09"),
        description: "The series premiere",
        imageUrl: "/images/ep1-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: false, score: null, totalQuestions: 15 }
      },
      {
        id: "2",
        number: 2,
        title: "Episode 2",
        airDate: new Date("2022-04-16"),
        description: "More brain-teasing questions",
        imageUrl: "/images/ep2-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: true, score: 12, totalQuestions: 15 }
      },
      {
        id: "3",
        number: 3,
        title: "Episode 3",
        airDate: new Date("2022-04-23"),
        description: "The questions get tougher",
        imageUrl: "/images/ep3-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: true, score: 10, totalQuestions: 15 }
      },
      {
        id: "4",
        number: 4,
        title: "Episode 4",
        airDate: new Date("2022-04-30"),
        description: "Can you make it to the 1%?",
        imageUrl: "/images/ep4-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: false, score: null, totalQuestions: 15 }
      },
      {
        id: "5",
        number: 5,
        title: "Episode 5",
        airDate: new Date("2022-05-07"),
        description: "Mid-season spectacular",
        imageUrl: "/images/ep5-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: false, score: null, totalQuestions: 15 }
      },
      {
        id: "6",
        number: 6,
        title: "Episode 6",
        airDate: new Date("2022-05-14"),
        description: "The ultimate test of logic",
        imageUrl: "/images/ep6-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: false, score: null, totalQuestions: 15 }
      },
      {
        id: "7",
        number: 7,
        title: "Episode 7",
        airDate: new Date("2022-05-21"),
        description: "Penultimate episode thrills",
        imageUrl: "/images/ep7-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: false, score: null, totalQuestions: 15 }
      },
      {
        id: "8",
        number: 8,
        title: "Episode 8 - Season Finale",
        airDate: new Date("2022-05-28"),
        description: "The grand finale with the toughest questions yet",
        imageUrl: "/images/ep8-thumb.jpg",
        questionCount: 15,
        progress: { isCompleted: false, score: null, totalQuestions: 15 }
      }
    ]
  };

  const completedEpisodes = seasonData.episodes.filter(ep => ep.progress?.isCompleted).length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/countries/${country}/seasons`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{seasonData.country.flagEmoji}</span>
              <div className="font-bold text-xl">{seasonData.title}</div>
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
            {seasonData.episodes.map((episode) => (
              <Card
                key={episode.id}
                className="relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {episode.title}
                        {episode.progress?.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {episode.airDate.toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{episode.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={episode.progress?.isCompleted ? "default" : "secondary"}>
                      {episode.questionCount} Questions
                    </Badge>
                  </div>

                  {episode.progress?.isCompleted && episode.progress.score !== null && (
                    <div className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Your Score:</span>
                        <span className="font-semibold">{episode.progress.score}/{episode.progress.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(episode.progress.score / episode.progress.totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button className="w-full" asChild>
                    <Link href={`/countries/${country}/seasons/${season}/episodes/${episode.number}`}>
                      {episode.progress?.isCompleted ? "Play Again" : "Start Episode"}
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