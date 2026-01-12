import { setRequestLocale } from "next-intl/server";
import { BasePageProps } from "@/types/page-props";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { ThemeSwitcher } from "@/components/examples/ThemeSwitcher";
import { LoginButton } from "@/components/examples/login-button";
import { LanguageSwitcher } from "@/components/examples/language-switcher";
import { ArrowLeft } from "lucide-react";

// Mock data for countries - in production this would come from the database
const countries = [
  { id: "gb", code: "GB", name: "United Kingdom", slug: "united-kingdom", flagEmoji: "🇬🇧", isActive: true },
  { id: "us", code: "US", name: "United States", slug: "united-states", flagEmoji: "🇺🇸", isActive: true },
  { id: "au", code: "AU", name: "Australia", slug: "australia", flagEmoji: "🇦🇺", isActive: true },
  { id: "nl", code: "NL", name: "Netherlands", slug: "netherlands", flagEmoji: "🇳🇱", isActive: true },
  { id: "fr", code: "FR", name: "France", slug: "france", flagEmoji: "🇫🇷", isActive: false },
  { id: "de", code: "DE", name: "Germany", slug: "germany", flagEmoji: "🇩🇪", isActive: false },
  { id: "es", code: "ES", name: "Spain", slug: "spain", flagEmoji: "🇪🇸", isActive: false },
];

const CountriesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {countries.map((country) => (
              <Card
                key={country.id}
                className={`relative overflow-hidden transition-all ${
                  country.isActive
                    ? "hover:shadow-lg hover:scale-105 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {!country.isActive && (
                  <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                    <span className="bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-2">{country.flagEmoji}</div>
                  <CardTitle className="text-lg">{country.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-4">
                  {country.isActive && (
                    <Button className="w-full" asChild>
                      <Link href={`/countries/${country.slug}/seasons`}>
                        Play
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CountriesPage;