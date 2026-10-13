"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

import type { GalleryPhoto } from "@/entities/gallery";
import { Modal } from "@/shared/ui";

export function GalleryGrid({
  featured,
  photos,
}: {
  featured: GalleryPhoto | null;
  photos: GalleryPhoto[];
}) {
  const items = (featured ? [featured, ...photos] : photos).filter(
    (photo) => photo.image?.url,
  );
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const move = (delta: number) =>
    setSelected((current) =>
      current === null ? null : (current + delta + items.length) % items.length,
    );
  const active = selected === null ? null : items[selected];

  return (
    <section className="site-shell pt-10" aria-label="Mosaïque de photos">
      <div className="columns-1 gap-6 tablet:columns-2 min-[1200px]:columns-3">
        {items.map((photo, index) => (
          <figure key={photo.id} className="mb-8 break-inside-avoid">
            <button
              type="button"
              onClick={() => setSelected(index)}
              className="group block w-full text-left"
              aria-label={`Voir la photo : ${photo.caption || photo.image.alt || `Photo ${index + 1}`}`}
              aria-haspopup="dialog"
            >
              <div className="overflow-hidden">
                <Image
                  src={photo.image.url!}
                  alt={
                    photo.image.alt || photo.caption || "Photographie de Tia"
                  }
                  width={photo.image.width || 1200}
                  height={photo.image.height || 1600}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 810px) 92vw, (max-width: 1200px) 46vw, (max-width: 1440px) 30vw, 424px"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
                />
              </div>
              <span className="mt-3 flex items-baseline justify-between gap-4 text-sm text-text-muted">
                <span>
                  {photo.caption || photo.image.alt || `Photo ${index + 1}`}
                </span>
                <span aria-hidden="true" className="text-accent-red">
                  ↗
                </span>
              </span>
            </button>
            {photo.caption && (
              <figcaption className="sr-only">{photo.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
      <Modal
        open={selected !== null}
        onClose={close}
        label="Visionneuse de photos"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {active && (
          <>
            <div className="relative mt-5 h-[min(65dvh,850px)] w-full">
              <Image
                src={active.image.url!}
                alt={
                  active.image.alt || active.caption || "Photographie de Tia"
                }
                fill
                className="object-contain"
                sizes="(max-width: 1440px) 90vw, 1250px"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p
                className="min-w-0 flex-1 font-inter text-sm"
                aria-live="polite"
                aria-atomic="true"
              >
                {active.caption || active.image.alt || `Photo ${selected! + 1}`}{" "}
                <span className="ml-2 text-text-secondary">
                  {selected! + 1} / {items.length}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="secondary-link"
                  aria-label="Photo précédente"
                  onClick={() => move(-1)}
                >
                  ← <span className="hidden tablet:inline">Précédente</span>
                </button>
                <button
                  type="button"
                  className="secondary-link"
                  aria-label="Photo suivante"
                  onClick={() => move(1)}
                >
                  <span className="hidden tablet:inline">Suivante</span> →
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
