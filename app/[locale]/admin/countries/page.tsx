import { setRequestLocale } from "next-intl/server";
import { CountriesManager } from "@/components/admin/countries-manager";
import { BasePageProps } from "@/types/page-props";
import { TypographyH2 } from "@/components/ui/typography";
import { getCountries } from "@/server-actions/countries";

const CountriesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const countries = await getCountries();

  return (
    <div className="space-y-6">
      <TypographyH2>Countries</TypographyH2>
      <CountriesManager initialCountries={countries} />
    </div>
  );
};

export default CountriesPage;
