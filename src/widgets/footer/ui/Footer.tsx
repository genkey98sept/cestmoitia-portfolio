import { getSiteInfo, type SiteInfo } from "@/entities/site-info";

import { FooterAnimated } from "./FooterAnimated";

export async function Footer() {
  let siteInfo: SiteInfo | null;
  try {
    siteInfo = await getSiteInfo();
  } catch {
    siteInfo = null;
  }

  return (
    <footer className="w-full bg-bg">
      <div className="h-px w-full bg-border" />

      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-[60px] tablet:px-[30px] tablet:pb-[100px] tablet:pt-[120px]">
        <FooterAnimated
          location={siteInfo?.location}
          instagramUrl={siteInfo?.instagramUrl}
          facebookUrl={siteInfo?.facebookUrl}
        />
      </div>
    </footer>
  );
}
