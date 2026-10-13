import Link from "next/link";

import { getProjects, ProjectCard, type Project } from "@/entities/project";
import { SectionHeader } from "@/shared/ui";

import { ProjectGridAnimated } from "./ProjectGridAnimated";

export async function ProjectGrid({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  let projects: Project[] = [];
  let unavailable = false;
  try {
    projects = await getProjects();
  } catch {
    unavailable = true;
  }

  return (
    <section
      id="portfolio"
      tabIndex={-1}
      className={`site-shell ${standalone ? "pt-10" : "section-space"}`}
      aria-label="Portfolio"
    >
      {!standalone && (
        <>
          <SectionHeader number="01" label="Portfolio" />
          <h2 className="section-heading mb-8">Les projets</h2>
        </>
      )}
      {projects.length > 0 ? (
        <ProjectGridAnimated>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ProjectGridAnimated>
      ) : (
        <div className="border-y border-border py-10 tablet:py-16">
          <p className="max-w-2xl font-clash text-2xl font-medium tablet:text-3xl">
            {unavailable
              ? "Les projets sont momentanément indisponibles."
              : "Aucun projet n’est publié pour le moment."}
          </p>
          <p className="mt-4 max-w-xl font-inter text-text-muted">
            {unavailable
              ? "Vous pouvez réessayer plus tard ou me contacter directement."
              : "Découvrez mon regard à travers la galerie photo, ou parlons de votre projet."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/photography" className="secondary-link">
              Découvrir la galerie
            </Link>
            <Link href="/contact" className="primary-link">
              Parlons de votre projet
            </Link>
          </div>
        </div>
      )}
      {!standalone && projects.length > 0 && (
        <Link href="/work" className="secondary-link mt-8">
          Tous les projets <span aria-hidden="true">↗</span>
        </Link>
      )}
    </section>
  );
}
