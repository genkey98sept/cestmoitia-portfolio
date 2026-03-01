import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";

import type { Project } from "../model/types";

export interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="mx-auto max-w-[1440px]">
      {/* Metadata row */}
      <div className="flex items-baseline justify-between px-5 pt-8 tablet:px-[30px] tablet:pt-[60px]">
        {project.year && (
          <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
            {project.year}
          </span>
        )}
        {project.client && (
          <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
            {project.client}
          </span>
        )}
        {project.category && (
          <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
            {project.category}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="mt-6 px-5 font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:mt-8 tablet:px-[30px] tablet:text-[90px] tablet:leading-[70px]">
        {project.title}
      </h1>

      {/* Sub-projects */}
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="mt-10 flex flex-col gap-[73px] tablet:mt-[100px]">
          {project.subProjects.map((sub) => (
            <section key={sub.id ?? sub.subTitle}>
              <h2 className="px-5 font-clash text-[34px] font-semibold uppercase leading-[34px] text-text tablet:px-[30px]">
                {sub.subTitle}
              </h2>

              {sub.subDescription != null && (
                <div className="mt-3 max-w-[650px] px-5 font-inter text-[16px] font-normal leading-[1.5] text-text-muted tablet:px-[30px]">
                  {typeof sub.subDescription === "string" ? (
                    <p>{sub.subDescription}</p>
                  ) : (
                    <RichText data={sub.subDescription} />
                  )}
                </div>
              )}

              {sub.subMedia && sub.subMedia.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-5 px-5 tablet:grid-cols-2 tablet:px-[30px]">
                  {sub.subMedia.map((media, i) => (
                    <div
                      key={media.id ?? i}
                      className="relative aspect-video overflow-hidden rounded-[10px]"
                    >
                      {media.image?.url && (
                        <Image
                          src={media.image.url}
                          alt={media.image.alt ?? `${sub.subTitle} ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 810px) 100vw, 50vw"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Gallery images */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-5 px-5 tablet:grid-cols-2 tablet:px-[30px]">
          {project.galleryImages.map((item, i) => (
            <div
              key={item.id ?? i}
              className="relative aspect-video overflow-hidden rounded-[10px]"
            >
              {item.image?.url && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt ?? `Galerie ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 810px) 100vw, 50vw"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Video embed */}
      {project.videoUrl && (
        <div className="mt-10 aspect-video w-full overflow-hidden rounded-[10px] px-5 tablet:px-[30px]">
          <iframe
            src={project.videoUrl}
            title={`Vidéo — ${project.title}`}
            className="h-full w-full rounded-[10px]"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
