import { HeaderAnimated } from "./HeaderAnimated";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-bg">
      <div className="mx-auto max-w-[1440px] pt-[34px]">
        <HeaderAnimated />
      </div>
      <div className="h-px w-full bg-border" />
    </header>
  );
}
