import { ClientsMarquee } from "./ClientsMarquee";

export function Clients() {
  return (
    <section
      aria-label="Clients & partenaires"
      className="w-full overflow-hidden py-[25px]"
      style={{
        borderTop: "1px solid #161616",
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%)",
      }}
    >
      <ClientsMarquee />
    </section>
  );
}
