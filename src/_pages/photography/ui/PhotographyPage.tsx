import Link from "next/link";

import { getGalleryPhotos, type GalleryPhoto } from "@/entities/gallery";

import { GalleryGrid } from "./GalleryGrid";

export async function PhotographyPage() {
  let photos: GalleryPhoto[];
  try {
    photos = await getGalleryPhotos();
  } catch {
    photos = [];
  }

  const featured = photos.find((p) => p.featured) ?? null;
  const rest = featured ? photos.filter((p) => p.id !== featured.id) : photos;
  const hasPhotos = photos.length > 0;

  return (
    <>
      {/* Hero title */}
      <section
        className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[100px]"
        aria-label="Galerie"
      >
        <p className="text-center font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text-secondary">
          (Photographie)
        </p>
        <h1 className="mt-4 text-center font-clash text-[40px] font-semibold uppercase leading-[1.05] text-text tablet:text-[90px] desktop:text-[140px] desktop:tracking-[-3.2px]">
          GALERIE
        </h1>
      </section>

      {/* Gallery */}
      {hasPhotos ? (
        <GalleryGrid featured={featured} photos={rest} />
      ) : (
        <section
          className="mx-auto w-full max-w-[1440px] px-5 py-[80px] tablet:px-[30px] tablet:py-[120px]"
          aria-label="Galerie vide"
        >
          <p className="text-center font-inter text-[16px] text-text-muted">
            Aucune photo n&apos;est encore publiee. Les visuels arriveront tres
            bientot.
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-[80px] tablet:px-[30px] tablet:py-[120px]">
        <h2 className="text-center font-clash text-[40px] font-semibold uppercase leading-[1.05] text-text tablet:text-[90px]">
          Un projet ?
        </h2>
        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="rounded-[10px] bg-text px-10 py-4 font-inter text-[12px] uppercase tracking-wider text-bg transition-colors duration-300 hover:border hover:border-text hover:bg-transparent hover:text-text"
          >
            CONTACTEZ-MOI
          </Link>
        </div>
      </section>
    </>
  );
}
