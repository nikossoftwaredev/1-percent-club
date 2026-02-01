import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { Roboto_Mono } from "next/font/google";
import { routing } from "@/lib/i18n/routing";
import { Providers } from "@/components/providers";
import { BaseLayoutProps } from "@/types/page-props";
import "./globals.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "1% Club - The Ultimate Quiz Game",
  description: "Test your knowledge against the nation! Can you make it to the 1% Club?",
  icons: {
    icon: "/1-percent-club-logo.png",
    apple: "/1-percent-club-logo.png",
  },
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const LocaleLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${robotoMono.variable} font-sans antialiased`}>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
