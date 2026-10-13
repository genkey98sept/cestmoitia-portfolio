import { ClientsMarquee } from "./ClientsMarquee";

export function Clients() {
  return (
    <section
      aria-label="Clients & partenaires"
      className="site-shell py-10 tablet:py-14"
    >
      <ClientsMarquee />
    </section>
  );
}
