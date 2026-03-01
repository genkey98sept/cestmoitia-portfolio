import Image from "next/image";

import type { Project } from "../model/types";

export interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article>
      {/* Cover image */}
      {project.coverImage?.url && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt ?? project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Metadata */}
      <div className="mt-8 space-y-2">
        <h1 className="text-4xl font-bold uppercase">{project.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm uppercase tracking-widest opacity-60">
          {project.client && <span>{project.client}</span>}
          {project.year && <span>{project.year}</span>}
          {project.category && <span>{project.category}</span>}
        </div>
      </div>

      {/* Sub-projects */}
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="mt-12 space-y-12">
          {project.subProjects.map((sub) => (
            <section key={sub.id ?? sub.subTitle}>
              <h2 className="text-2xl font-semibold uppercase">
                {sub.subTitle}
              </h2>
              {/* Rich text rendering placeholder — will be refined in T8 */}
              {sub.subMedia && sub.subMedia.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {sub.subMedia.map((media, i) => (
                    <div
                      key={media.id ?? i}
                      className="relative aspect-video overflow-hidden"
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
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {project.galleryImages.map((item, i) => (
            <div
              key={item.id ?? i}
              className="relative aspect-video overflow-hidden"
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
        <div className="mt-12 aspect-video w-full overflow-hidden">
          <iframe
            src={project.videoUrl}
            title={`Video — ${project.title}`}
            className="h-full w-full"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
