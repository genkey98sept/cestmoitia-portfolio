import { getPayloadClient } from "@/shared/lib";

import type { SiteInfo } from "../model/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapSiteInfo(raw: any): SiteInfo {
  return {
    id: raw.id ?? "",
    heroTagline: raw.heroTagline,
    bio: raw.bio,
    email: raw.email ?? "",
    phone: raw.phone,
    location: raw.location,
    cvUrl: raw.cvUrl,
    instagramUrl: raw.instagramUrl,
    facebookUrl: raw.facebookUrl,
    twitterUrl: raw.twitterUrl,
    otherLinks: raw.otherLinks,
    services: raw.services,
    experiences: raw.experiences,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getSiteInfo(): Promise<SiteInfo> {
  const payload = await getPayloadClient();
  const siteInfo = await payload.findGlobal({
    slug: "site-info",
  });
  return mapSiteInfo(siteInfo);
}
