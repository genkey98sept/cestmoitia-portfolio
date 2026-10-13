import { getSiteInfo, type SiteInfo } from "@/entities/site-info";

import { ServicesAnimated } from "./ServicesAnimated";

export async function Services() {
  let siteInfo: SiteInfo | null;
  try {
    siteInfo = await getSiteInfo();
  } catch {
    siteInfo = null;
  }

  return (
    <section
      id="services"
      className="site-shell section-space"
      aria-label="Services"
    >
      <ServicesAnimated services={siteInfo?.services ?? []} />
    </section>
  );
}
