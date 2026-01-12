import { setRequestLocale } from "next-intl/server";
import { CountriesTable } from "@/components/admin/countries-table";
import { BasePageProps } from "@/types/page-props";
import { TypographyH2 } from "@/components/ui/typography";

const CountriesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <TypographyH2>Countries</TypographyH2>
      <CountriesTable />
    </div>
  );
};

export default CountriesPage;
