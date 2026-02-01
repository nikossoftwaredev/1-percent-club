import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { BasePageProps } from "@/types/page-props";
import { Link } from "@/lib/i18n/navigation";
import { Trophy, Brain, Globe, TrendingUp, Play, ChevronRight } from "lucide-react";
import Image from "next/image";

const FEATURES = [
  {
    icon: Brain,
    title: "90% to 1%",
    description: "Questions get progressively harder — from what most people know to what almost nobody can answer",
  },
  {
    icon: Globe,
    title: "Global Editions",
    description: "Play quiz versions from different countries, each with unique questions and cultural flair",
  },
  {
    icon: TrendingUp,
    title: "Track Mastery",
    description: "Monitor your performance across episodes and see how you improve over time",
  },
  {
    icon: Trophy,
    title: "Join the 1%",
    description: "Prove you belong among the elite few who can answer every single question",
  },
];

const PERCENTAGES = ["90%", "70%", "50%", "30%", "10%", "1%"];

const Home = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/1-percent-club-logo.png"
              alt="1% Club Logo"
              width={120}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex items-center justify-center overflow-hidden pt-16">
          {/* Background layers */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/background.jpg')` }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />

          {/* Radial golden glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-yellow-500/5 blur-[120px]" />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0" />

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
            {/* Logo */}
            <div className="animate-fade-up">
              <Image
                src="/1-percent-club-logo.png"
                alt="1% Club"
                width={500}
                height={250}
                className="w-auto h-28 md:h-40 lg:h-48 mx-auto"
                priority
              />
            </div>

            {/* Tagline */}
            <div className="animate-fade-up delay-200 mt-6">
              <p className="golden-shimmer text-lg md:text-xl font-bold tracking-[0.2em] uppercase">
                The Ultimate Quiz Challenge
              </p>
            </div>

            {/* Difficulty cascade */}
            <div className="animate-fade-up delay-300 flex items-center justify-center gap-3 md:gap-4 mt-8">
              {PERCENTAGES.map((pct, i) => (
                <span
                  key={pct}
                  className="text-sm md:text-base font-bold transition-colors"
                  style={{
                    color: `hsl(${45 - i * 6}, ${90 + i * 2}%, ${65 - i * 8}%)`,
                    opacity: 1 - i * 0.08,
                  }}
                >
                  {pct}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="animate-fade-up delay-400 mt-8 max-w-2xl mx-auto space-y-4">
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                Start with questions 90% of people get right.
                Work your way down to the impossible 1% questions
                that only the sharpest minds can crack.
              </p>
            </div>

            {/* CTA */}
            <div className="animate-fade-up delay-500 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600 px-8 h-12 text-base" asChild>
                <Link href="/countries">
                  <Play className="h-5 w-5" />
                  Play Now
                </Link>
              </Button>
            </div>

            {/* Decorative separator */}
            <div className="animate-fade-in delay-600 mt-20 deco-line text-yellow-500/40 text-xs tracking-[0.3em] uppercase">
              Why Play
            </div>

            {/* Features Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`animate-fade-up delay-${(i + 5) * 100} group relative p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 card-glow text-left`}
                >
                  <div className="mb-4 inline-flex p-2.5 rounded-lg bg-linear-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-500/20">
                    <feature.icon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="animate-fade-up delay-800 mt-16 mb-8">
              <Link
                href="/countries"
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium tracking-wide group/link"
              >
                Choose your country and start playing
                <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
