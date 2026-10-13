import Image from "next/image";

export interface ProjectCardAnimatedProps {
  title: string;
  category?: string;
  imageUrl: string;
  imageAlt: string;
}

export function ProjectCardAnimated({
  title,
  category,
  imageUrl,
  imageAlt,
}: ProjectCardAnimatedProps) {
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
            sizes="(max-width: 810px) 92vw, (max-width: 1440px) 46vw, 646px"
          />
        ) : (
          <div className="flex h-full items-center justify-center border border-border p-8 text-text-secondary">
            <span className="eyebrow">
              {category || "Projet"} · Visuel indisponible
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          {category && <p className="eyebrow">{category}</p>}
          <h3 className="mt-2 font-clash text-2xl font-semibold uppercase leading-tight tablet:text-3xl">
            {title}
          </h3>
        </div>
        <span className="text-2xl text-accent-red" aria-hidden="true">
          ↗
        </span>
      </div>
    </div>
  );
}
