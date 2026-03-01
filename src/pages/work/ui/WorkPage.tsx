import { ProjectGrid } from "@/widgets/project-grid";

export function WorkPage() {
  return (
    <>
      {/* Hero title */}
      <section
        className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[100px]"
        aria-label="Selected Works"
      >
        <p className="text-center font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-[#808080]">
          (Portfolio)
        </p>
        <h1 className="mt-4 text-center font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px] desktop:text-[140px] desktop:leading-[110px] desktop:tracking-[-3.2px]">
          <span className="block">SELECTED</span>
          <span className="block">WORKS</span>
        </h1>
      </section>

      {/* Reuse the same ProjectGrid widget */}
      <ProjectGrid />
    </>
  );
}
