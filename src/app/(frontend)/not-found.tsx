import Link from "next/link";

export default function NotFound() {
  return (
    <section className="site-shell flex min-h-[65vh] flex-col items-start justify-center py-16">
      <p className="eyebrow mb-5">Erreur 404</p>
      <h1 className="page-heading">Hors champ.</h1>
      <p className="mt-6 max-w-lg font-inter text-lg leading-relaxed text-text-muted">
        Cette page n&apos;existe pas ou a été déplacée. Retrouvez les projets ou
        reprenez la visite depuis l&apos;accueil.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="primary-link">
          Retour à l’accueil
        </Link>
        <Link href="/work" className="secondary-link">
          Voir les projets
        </Link>
      </div>
    </section>
  );
}
