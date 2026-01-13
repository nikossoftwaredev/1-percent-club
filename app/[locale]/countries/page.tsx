import { setRequestLocale } from "next-intl/server";
import { BasePageProps } from "@/types/page-props";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { ArrowLeft, Play, Tv } from "lucide-react";
import { getCountries } from "@/server-actions/countries";

const CountriesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const countries = await getCountries();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="font-bold text-xl">1% Club</div>
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
            <h1 className="text-3xl md:text-4xl font-bold">Select Your Country</h1>
            <p className="text-muted-foreground">
              Choose which version of the 1% Club you want to play
            </p>
          </div>

          {countries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No countries available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => (
                <Card
                  key={country.id}
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    country.isActive
                      ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {/* Flag Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {country.flagImage ? (
                      <img
                        src={country.flagImage}
                        alt={`${country.name} flag`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
                        <span className="text-6xl font-bold text-muted-foreground/30">
                          {country.code}
                        </span>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Season badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white border-none backdrop-blur-sm"
                      >
                        <Tv className="h-3 w-3 mr-1" />
                        {country._count.seasons} {country._count.seasons === 1 ? "Season" : "Seasons"}
                      </Badge>
                    </div>

                    {/* Coming soon overlay */}
                    {!country.isActive && (
                      <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                        <Badge variant="outline" className="text-sm px-4 py-1">
                          Coming Soon
                        </Badge>
                      </div>
                    )}

                    {/* Country name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                        {country.name}
                      </h2>
                    </div>
                  </div>

                  {/* Card content */}
                  <CardContent className="p-4">
                    {country.isActive ? (
                      <Button className="w-full" size="lg" asChild>
                        <Link href={`/countries/${country.slug}/seasons`}>
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CountriesPage;
