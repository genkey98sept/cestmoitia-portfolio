import Link from "next/link";

import { PhotoGalleryAnimated } from "./PhotoGalleryAnimated";

export function PhotographyPage() {
  return (
    <>
      {/* Hero title */}
      <section
        className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[100px]"
        aria-label="Galerie Photo"
      >
        <h1 className="text-center font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px] desktop:text-[140px] desktop:leading-[110px] desktop:tracking-[-3.2px]">
          <span className="block">Gallerie</span>
          <span className="block">PHOTO</span>
        </h1>
      </section>

      {/* Photo gallery */}
      <PhotoGalleryAnimated />

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-[80px] tablet:px-[30px] tablet:py-[120px]">
        <h2 className="text-center font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px]">
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
