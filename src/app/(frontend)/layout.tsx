import type { Metadata } from "next";

import { inter, clashDisplay } from "@/app/fonts";
import { AppProviders } from "@/app/providers";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { SITE_NAME, SITE_DESCRIPTION } from "@/shared/config";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Portfolio`,
  description: SITE_DESCRIPTION,
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
          <Header />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
