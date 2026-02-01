import { setRequestLocale } from "next-intl/server";
import { CountriesManager } from "@/components/admin/countries-manager";
import { BasePageProps } from "@/types/page-props";
import { getCountries } from "@/server-actions/countries";

const CountriesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const countries = await getCountries();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Countries</h2>
        <p className="text-sm text-muted-foreground">
          Manage countries and their quiz content
        </p>
      </div>
      <CountriesManager initialCountries={countries} />
    </div>
  );
};

export default CountriesPage;
