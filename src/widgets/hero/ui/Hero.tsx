import { getSiteInfo } from "@/entities/site-info";

import { HeroAnimated } from "./HeroAnimated";

export async function Hero() {
  const siteInfo = await getSiteInfo().catch(() => null);
  return (
    <section
      id="hero"
      className="site-shell pt-8 tablet:pt-12"
      aria-label="Présentation"
    >
      <HeroAnimated
        location={siteInfo?.location}
        tagline={siteInfo?.heroTagline}
      />
    </section>
  );
}
