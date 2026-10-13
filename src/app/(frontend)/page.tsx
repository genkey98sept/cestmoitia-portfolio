import { getSiteInfo } from "@/entities/site-info";
import { HomePage } from "@/_pages/home";
import { buildPersonJsonLd, serializeJsonLd } from "@/shared/lib";
import { SITE_URL } from "@/shared/config";

export default async function Page() {
  let siteInfo = null;
  try {
    siteInfo = await getSiteInfo();
  } catch {
    // Payload may not be available
  }

  return (
    <>
      {siteInfo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(buildPersonJsonLd(siteInfo, SITE_URL)),
          }}
        />
      )}
      <HomePage />
    </>
  );
}
