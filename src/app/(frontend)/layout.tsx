import type { Metadata } from "next";

import { inter, clashDisplay } from "@/app/fonts";
import { AppProviders } from "@/app/providers";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { CustomCursor, SmoothScroll } from "@/shared/ui";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/shared/config";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — Portfolio`,
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  other: {
    "geo.region": "PF",
    "geo.placename": "Tahiti, Polynesie francaise",
  },
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${clashDisplay.variable}`}>
      <body>
        <AppProviders>
          <SmoothScroll />
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
