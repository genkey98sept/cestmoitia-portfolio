import { HeroAnimated } from "./HeroAnimated";

export function Hero() {
  return (
    <section id="hero" className="relative w-full" aria-label="Hero">
      <div className="mx-auto max-w-[1440px]">
        <HeroAnimated />
      </div>
    </section>
  );
}
