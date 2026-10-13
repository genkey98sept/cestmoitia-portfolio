import { getSiteInfo, type SiteInfo } from "@/entities/site-info";

import { ExperienceAnimated } from "./ExperienceAnimated";

export async function Experience() {
  let siteInfo: SiteInfo | null;
  try {
    siteInfo = await getSiteInfo();
  } catch {
    siteInfo = null;
  }

  return (
    <section
      id="experience"
      className="site-shell section-space"
      aria-label="Expérience"
    >
      <ExperienceAnimated experiences={siteInfo?.experiences ?? []} />
    </section>
  );
}
