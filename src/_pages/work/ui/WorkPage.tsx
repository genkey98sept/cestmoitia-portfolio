import { ProjectGrid } from "@/widgets/project-grid";

export function WorkPage() {
  return (
    <>
      <section
        className="site-shell section-space"
        aria-label="Projets sélectionnés"
      >
        <p className="eyebrow mb-5">
          Portfolio · Audiovisuel & création digitale
        </p>
        <h1 className="page-heading">Les projets</h1>
        <p className="mt-6 max-w-xl font-inter text-lg leading-relaxed text-text-muted">
          Une sélection de mes réalisations en vidéo, graphisme et motion
          design.
        </p>
      </section>
      <ProjectGrid standalone />
    </>
  );
}
