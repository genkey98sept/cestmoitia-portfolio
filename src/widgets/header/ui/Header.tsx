import { HeaderAnimated } from "./HeaderAnimated";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col gap-[33px] bg-bg/80 pt-[34px] backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1440px]">
        <HeaderAnimated />
      </div>
      <div className="h-px w-full bg-border" />
    </header>
  );
}
