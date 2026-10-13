import { getSiteInfo } from "@/entities/site-info";

import { FooterAnimated } from "./FooterAnimated";

export async function Footer() {
  const siteInfo = await getSiteInfo().catch(() => null);
  return (
    <footer className="mt-20 border-t border-border tablet:mt-28">
      <div className="site-shell py-12 tablet:py-20">
        <FooterAnimated
          location={siteInfo?.location}
          instagramUrl={siteInfo?.instagramUrl}
          facebookUrl={siteInfo?.facebookUrl}
        />
      </div>
    </footer>
  );
}
