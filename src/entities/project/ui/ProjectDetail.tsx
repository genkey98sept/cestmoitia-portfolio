import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { toYoutubeEmbed } from "@/shared/lib";
import type { Media } from "@/shared/model";

import type { Project } from "../model/types";

type LexicalData = React.ComponentProps<typeof RichText>["data"];

function Description({ content }: { content: unknown }) {
  if (typeof content === "string") return <p>{content}</p>;
  if (content && typeof content === "object" && "root" in content)
    return <RichText data={content as LexicalData} />;
  return null;
}

function ProjectImage({ image, alt }: { image: Media; alt: string }) {
  if (!image?.url) return null;
  return (
    <figure>
      <Image
        src={image.url}
        alt={image.alt || alt}
        width={image.width || 1600}
        height={image.height || 1000}
        className="h-auto w-full"
        sizes="(max-width: 810px) 92vw, (max-width: 1440px) 46vw, 646px"
      />
      {image.caption && (
        <figcaption className="mt-3 font-inter text-sm text-text-secondary">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ProjectVideo({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-bg-alt">
      <iframe
        src={url}
        title={`Vidéo — ${title}`}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="site-shell section-space">
      <nav
        aria-label="Fil d’Ariane"
        className="mb-8 font-inter text-sm text-text-secondary"
      >
        <Link
          href="/work"
          className="inline-flex min-h-12 items-center gap-2 hover:text-text"
        >
          <span aria-hidden="true">←</span> Retour aux projets
        </Link>
      </nav>
      <h1 className="page-heading text-[clamp(32px,6vw,96px)]">
        {project.title}
      </h1>
      <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5 border-y border-border py-6">
        {project.year && (
          <div>
            <dt className="eyebrow mb-2">Année</dt>
            <dd>{project.year}</dd>
          </div>
        )}
        {project.client && (
          <div className="min-w-0 max-w-full">
            <dt className="eyebrow mb-2">Client</dt>
            <dd className="[overflow-wrap:anywhere]">{project.client}</dd>
          </div>
        )}
        {project.category && (
          <div className="min-w-0 max-w-full">
            <dt className="eyebrow mb-2">Discipline</dt>
            <dd className="[overflow-wrap:anywhere]">{project.category}</dd>
          </div>
        )}
      </dl>
      {project.description != null && (
        <div className="mt-8 max-w-3xl space-y-4 font-inter text-lg leading-relaxed text-text-muted">
          <Description content={project.description} />
        </div>
      )}
      {project.coverImage?.url && (
        <div className="mt-10">
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.title}
            width={project.coverImage.width || 1600}
            height={project.coverImage.height || 1000}
            className="h-auto w-full"
            sizes="(max-width: 1440px) 92vw, 1320px"
          />
        </div>
      )}
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="mt-12 space-y-16 tablet:mt-20">
          {project.subProjects.map((sub) => {
            const embedUrl = sub.youtubeUrl
              ? toYoutubeEmbed(sub.youtubeUrl)
              : null;
            return (
              <section key={sub.id || sub.subTitle}>
                <h2 className="font-clash text-3xl font-semibold uppercase leading-tight tablet:text-4xl">
                  {sub.subTitle}
                </h2>
                {sub.subDescription != null && (
                  <div className="mt-4 max-w-3xl space-y-4 font-inter leading-relaxed text-text-muted">
                    <Description content={sub.subDescription} />
                  </div>
                )}
                {embedUrl && (
                  <div className="mt-6">
                    <ProjectVideo url={embedUrl} title={sub.subTitle} />
                  </div>
                )}
                {sub.subMedia && (
                  <div className="mt-6 grid items-start gap-6 tablet:grid-cols-2">
                    {sub.subMedia
                      .filter((media) => media.image?.url)
                      .map((media, index) => (
                        <ProjectImage
                          key={media.id || index}
                          image={media.image}
                          alt={`${sub.subTitle} — ${index + 1}`}
                        />
                      ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
      {project.galleryImages && (
        <div className="mt-10 grid items-start gap-6 tablet:grid-cols-2">
          {project.galleryImages
            .filter((item) => item.image?.url)
            .map((item, index) => (
              <ProjectImage
                key={item.id || index}
                image={item.image}
                alt={`${project.title} — ${index + 1}`}
              />
            ))}
        </div>
      )}
      {project.videoUrl && (
        <div className="mt-10">
          <ProjectVideo
            url={toYoutubeEmbed(project.videoUrl) || project.videoUrl}
            title={project.title}
          />
        </div>
      )}
      <div className="mt-12">
        <Link href="/contact" className="secondary-link">
          Parlons de votre projet <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
