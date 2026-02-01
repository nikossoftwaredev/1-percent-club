import { ArrowLeft, Play, Tv } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { LoginButton } from "@/components/examples/login-button";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { cn } from "@/lib/general/utils";
import { Link } from "@/lib/i18n/navigation";
import { getCountries } from "@/server-actions/countries";
import { BasePageProps } from "@/types/page-props";

const CountriesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const countries = await getCountries();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="font-bold text-lg text-yellow-400">1% Club</span>
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
              Choose Your Edition
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Select Country
            </h1>
            <div className="mt-4 mx-auto w-16 h-px bg-linear-to-r from-transparent via-yellow-500/40 to-transparent" />
          </div>

          {countries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No countries available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country, i) =>
                country.isActive ? (
                  <Link
                    key={country.id}
                    href={`/countries/${country.slug}/seasons`}
                    className={cn(
                      "animate-fade-up group relative overflow-hidden rounded-2xl bg-card border border-white/5 transition-all duration-400 card-glow light-sweep",
                      i === 0 && "delay-100",
                      i === 1 && "delay-200",
                      i === 2 && "delay-300",
                      i >= 3 && "delay-400",
                    )}
                  >
                    {/* Flag Image */}
                    <div className="relative aspect-video overflow-hidden">
                      {country.flagImage ? (
                        <img
                          src={country.flagImage}
                          alt={`${country.name} flag`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                          <span className="text-6xl font-bold text-muted-foreground/20">
                            {country.code}
                          </span>
                        </div>
                      )}

                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Season badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/60 text-white/90 border-none backdrop-blur-md text-xs">
                          <Tv className="h-3 w-3 mr-1" />
                          {country._count.seasons} {country._count.seasons === 1 ? "Season" : "Seasons"}
                        </Badge>
                      </div>

                      {/* Country name */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                          {country.name}
                        </h2>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-yellow-400 transition-colors duration-300">
                      <Play className="h-3.5 w-3.5" />
                      <span className="font-medium tracking-wide">Play Now</span>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={country.id}
                    className="relative overflow-hidden rounded-2xl bg-card border border-white/5 opacity-50 cursor-not-allowed"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {country.flagImage ? (
                        <img
                          src={country.flagImage}
                          alt={`${country.name} flag`}
                          className="w-full h-full object-cover grayscale"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                          <span className="text-6xl font-bold text-muted-foreground/20">
                            {country.code}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                        <Badge variant="outline" className="text-sm px-4 py-1.5 border-white/20">
                          Coming Soon
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="text-2xl font-bold text-white/60 drop-shadow-lg">
                          {country.name}
                        </h2>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                      Coming Soon
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CountriesPage;
