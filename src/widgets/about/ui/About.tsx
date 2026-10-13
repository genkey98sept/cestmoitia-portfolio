import { RichText } from "@payloadcms/richtext-lexical/react";

import { getSiteInfo, type SiteInfo } from "@/entities/site-info";

import { AboutAnimated } from "./AboutAnimated";

export async function About() {
  let siteInfo: SiteInfo | null;
  try {
    siteInfo = await getSiteInfo();
  } catch {
    siteInfo = null;
  }

  return (
    <section
      id="about"
      className="site-shell section-space"
      aria-label="À propos"
    >
      <AboutAnimated cvUrl={siteInfo?.cvUrl}>
        {typeof siteInfo?.bio === "string" ? (
          <p>{siteInfo.bio}</p>
        ) : siteInfo?.bio &&
          typeof siteInfo.bio === "object" &&
          "root" in siteInfo.bio ? (
          <RichText
            data={siteInfo.bio as React.ComponentProps<typeof RichText>["data"]}
          />
        ) : undefined}
      </AboutAnimated>
    </section>
  );
}
