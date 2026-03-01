import { getPayloadClient } from "@/shared/lib";

import type { SiteInfo } from "../model/types";

export async function getSiteInfo(): Promise<SiteInfo> {
  const payload = await getPayloadClient();
  const siteInfo = await payload.findGlobal({
    slug: "site-info",
  });
  return siteInfo as unknown as SiteInfo;
}
