import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { BasePageProps } from "@/types/page-props";
import { Link } from "@/lib/i18n/navigation";
import { Trophy, Brain, Users, TrendingUp, Play } from "lucide-react";

const Home = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="font-bold text-xl">1% Club</div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  1% Club
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                The Ultimate Quiz Game
              </p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-lg text-foreground/80">
                Test your knowledge against the nation! Start with questions that 90% of people get right,
                and work your way down to the ultra-challenging 1% questions that only the brightest minds can solve.
              </p>
              <p className="text-lg text-foreground/80">
                Can you make it to the elite 1% Club? Challenge yourself with questions from different countries
                and prove you&apos;re among the smartest!
              </p>
            </div>

            <div className="pt-8">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/countries">
                  <Play className="h-5 w-5" />
                  Play Now
                </Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Challenge Your Mind</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Questions ranging from easy to extremely difficult
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Compete Globally</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Play versions from different countries
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Monitor your performance and improvement
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Join the Elite</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Prove you belong in the 1% Club
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;