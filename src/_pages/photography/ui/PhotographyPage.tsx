import { getGalleryPhotos, type GalleryPhoto } from "@/entities/gallery";

import { GalleryGrid } from "./GalleryGrid";

export async function PhotographyPage() {
  let photos: GalleryPhoto[] = [];
  let unavailable = false;
  try {
    photos = await getGalleryPhotos();
  } catch {
    unavailable = true;
  }
  const featured = photos.find((photo) => photo.featured) ?? null;
  const rest = featured
    ? photos.filter((photo) => photo.id !== featured.id)
    : photos;
  return (
    <>
      <section className="site-shell section-space" aria-label="Galerie">
        <p className="eyebrow mb-5">Photographie</p>
        <h1 className="page-heading">Galerie</h1>
        <p className="mt-6 max-w-xl font-inter text-lg leading-relaxed text-text-muted">
          Un regard sur les lieux, les instants et les détails. Ouvrez une photo
          pour la découvrir en entier.
        </p>
      </section>
      {photos.length ? (
        <GalleryGrid featured={featured} photos={rest} />
      ) : (
        <div className="site-shell py-16">
          <p className="border-y border-border py-10 font-inter text-text-muted">
            {unavailable
              ? "La galerie est momentanément indisponible. Réessayez plus tard."
              : "Aucune photo n’est publiée pour le moment."}
          </p>
        </div>
      )}
    </>
  );
}
