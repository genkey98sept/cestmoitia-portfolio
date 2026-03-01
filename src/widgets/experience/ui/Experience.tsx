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
      className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[100px]"
      aria-label="Expérience"
    >
      <ExperienceAnimated experiences={siteInfo?.experiences ?? []} />
    </section>
  );
}
