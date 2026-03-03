import { HeaderAnimated } from "./HeaderAnimated";

export function Header() {
  return (
    <header className="flex w-full flex-col gap-[33px] pt-[34px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <HeaderAnimated />
      </div>
      <div className="h-px w-full bg-border" />
    </header>
  );
}
