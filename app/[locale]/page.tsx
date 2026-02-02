import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { BasePageProps } from "@/types/page-props";
import { Link } from "@/lib/i18n/navigation";
import { Trophy, Brain, Globe, TrendingUp, Play } from "lucide-react";
import Image from "next/image";

const FEATURES = [
  { icon: Brain, label: "90% to 1%" },
  { icon: Globe, label: "Global Editions" },
  { icon: TrendingUp, label: "Track Mastery" },
  { icon: Trophy, label: "Join the 1%" },
];

const PERCENTAGES = ["90%", "70%", "50%", "30%", "10%", "1%"];

const Home = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col">
      {/* Background layers */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/background.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-linear-to-b from-background/80 via-transparent to-background/90" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-yellow-500/5 blur-[120px]" />
      <div className="noise-overlay absolute inset-0" />

      {/* Glass Header */}
      <header className="relative z-20 mx-4 md:mx-6 mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-lg shadow-black/10">
        <div className="flex h-12 md:h-14 items-center justify-between px-5 md:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/1-percent-club-logo.png"
              alt="1% Club Logo"
              width={100}
              height={40}
              className="h-7 md:h-8 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-1.5 md:gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero — vertically centered in remaining space */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-4">
        {/* Logo */}
        <div className="animate-fade-up">
          <Image
            src="/1-percent-club-logo.png"
            alt="1% Club"
            width={500}
            height={250}
            className="w-auto h-20 md:h-32 lg:h-40 mx-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="animate-fade-up delay-200 golden-shimmer text-sm md:text-lg font-bold tracking-[0.2em] uppercase mt-4 md:mt-5">
          The Ultimate Quiz Challenge
        </p>

        {/* Difficulty cascade */}
        <div className="animate-fade-up delay-300 flex items-center gap-2.5 md:gap-4 mt-5 md:mt-6">
          {PERCENTAGES.map((pct, i) => (
            <span
              key={pct}
              className="text-xs md:text-base font-bold"
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
        <p className="animate-fade-up delay-400 mt-5 md:mt-6 max-w-lg text-center text-xs md:text-base text-gray-300/90 leading-relaxed">
          Start with questions 90% of people get right.
          Work your way down to the impossible 1% questions
          that only the sharpest minds can crack.
        </p>

        {/* CTA */}
        <div className="animate-fade-up delay-500 mt-7 md:mt-8">
          <Button size="lg" className="bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600 px-8 h-11 md:h-12 text-sm md:text-base" asChild>
            <Link href="/countries">
              <Play className="h-4 w-4 md:h-5 md:w-5" />
              Play Now
            </Link>
          </Button>
        </div>
      </main>

      {/* Bottom feature strip */}
      <div className="relative z-10 pb-5 md:pb-6 px-6">
        <div className="animate-fade-up delay-700 flex items-center justify-center gap-6 md:gap-10">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="flex items-center gap-1.5 md:gap-2">
              <feature.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-500/40" />
              <span className="text-[10px] md:text-xs font-medium tracking-wide text-white/30 hidden sm:inline">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
