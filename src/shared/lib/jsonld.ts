interface PersonJsonLdInput {
  email: string;
  location?: {
    city?: string;
    countryCode?: string;
  };
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

interface CreativeWorkJsonLdInput {
  title: string;
  slug: string;
  coverImage?: { url?: string };
  publishedAt?: string;
  category?: string;
}

export function buildPersonJsonLd(
  siteInfo: PersonJsonLdInput,
  siteUrl: string,
): Record<string, unknown> {
  const sameAs = [
    siteInfo.instagramUrl,
    siteInfo.facebookUrl,
    siteInfo.twitterUrl,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tia",
    url: siteUrl,
    email: siteInfo.email,
    jobTitle: "Creatif independant",
    ...(siteInfo.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: siteInfo.location.city,
        addressCountry: siteInfo.location.countryCode,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildCreativeWorkJsonLd(
  project: CreativeWorkJsonLdInput,
  siteUrl: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: `${siteUrl}/work/${project.slug}`,
    ...(project.coverImage?.url && { image: project.coverImage.url }),
    author: {
      "@type": "Person",
      name: "Tia",
    },
    ...(project.publishedAt && { datePublished: project.publishedAt }),
    ...(project.category && { genre: project.category }),
  };
}
