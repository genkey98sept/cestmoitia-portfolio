import { SectionHeader } from "@/shared/ui";

interface ExperienceItem {
  id?: string;
  company: string;
  position: string;
  year: string;
  description?: string;
}

export function ExperienceAnimated({
  experiences,
}: {
  experiences: ExperienceItem[];
}) {
  return (
    <div>
      <SectionHeader number="04" label="Parcours" />
      <h2 className="section-heading mb-8">Expérience</h2>
      {!experiences.length && (
        <p className="max-w-xl font-inter text-text-muted">
          Le détail de mon parcours n’est pas disponible pour le moment.
          Contactez-moi pour en savoir plus.
        </p>
      )}
      <div className="border-b border-border">
        {experiences.map((experience, index) => (
          <div
            key={experience.id || index}
            className="grid gap-4 border-t border-border py-8 tablet:grid-cols-[1fr_1.3fr] tablet:gap-12"
          >
            <div>
              <p className="eyebrow mb-3">{experience.year}</p>
              <h3 className="font-clash text-2xl font-semibold uppercase leading-tight tablet:text-3xl">
                {experience.company}
              </h3>
            </div>
            <div>
              <p className="font-clash text-lg font-medium">
                {experience.position}
              </p>
              {experience.description && (
                <p className="mt-3 max-w-2xl font-inter leading-relaxed text-text-muted">
                  {experience.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
