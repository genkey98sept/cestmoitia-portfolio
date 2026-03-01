import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-5">
      <h1 className="font-clash text-[120px] font-semibold uppercase leading-[100px] text-text tablet:text-[200px] tablet:leading-[160px]">
        404
      </h1>
      <p className="mt-6 max-w-[500px] text-center font-inter text-[16px] leading-[1.5] text-text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center rounded-[60px] border border-text px-[24px] py-[14px] font-clash text-[14px] font-semibold uppercase text-text transition-colors duration-300 hover:bg-text hover:text-bg"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
