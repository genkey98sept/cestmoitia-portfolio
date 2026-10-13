import Image from "next/image";

import { SectionHeader } from "@/shared/ui";

export function AboutAnimated({
  cvUrl,
  children,
}: {
  cvUrl?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <SectionHeader number="02" label="À propos" />
      <div className="grid gap-10 tablet:grid-cols-2 tablet:gap-16">
        <div>
          <h2 className="section-heading mb-8">Moi, c’est Tia.</h2>
          <div className="space-y-5 [&_p+p]:mt-5 font-inter text-lg leading-relaxed text-text-muted">
            {children || (
              <>
                <p>
                  Moi, c&apos;est Tia, un jeune créatif passionné par
                  l&apos;audiovisuel, avec plus de 7 ans d&apos;expérience
                  professionnelle en entreprise et en freelance.
                </p>
                <p>
                  Je crée, j&apos;imagine et je construis dans le monde digital,
                  là où tout devient possible.
                </p>
                <p>
                  Curieux et motivé, je continue chaque jour à apprendre à
                  travers de nouvelles expériences et de nouveaux projets.
                  Parfois un peu désordonné, mais toujours animé par la
                  créativité et l&apos;efficacité.
                </p>
              </>
            )}
          </div>
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-link mt-8"
              aria-label="Télécharger le CV de Tia (ouvre un nouvel onglet)"
            >
              Mon CV <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/about-tia.jpg"
            alt="Portrait de Tia"
            fill
            className="object-cover"
            sizes="(max-width: 810px) 92vw, (max-width: 1440px) 46vw, 630px"
          />
        </div>
      </div>
    </div>
  );
}
