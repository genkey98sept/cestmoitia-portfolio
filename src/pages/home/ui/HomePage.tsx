import { Hero } from "@/widgets/hero";
import { ProjectGrid } from "@/widgets/project-grid";
import { About } from "@/widgets/about";
import { Services } from "@/widgets/services";
import { Vision } from "@/widgets/vision";
import { Experience } from "@/widgets/experience";

export function HomePage() {
  return (
    <>
      <Hero />
      <ProjectGrid />
      <About />
      <Services />
      <Vision />
      <Experience />
    </>
  );
}
