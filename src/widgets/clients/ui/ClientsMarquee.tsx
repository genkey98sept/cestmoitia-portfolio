import Image from "next/image";

const logos = [
  { src: "/logos/framer-1-842x339.png", alt: "Exotic Gardens" },
  { src: "/logos/framer-5-842x596.png", alt: "American Express" },
  { src: "/logos/framer-3-3264x2756.png", alt: "Socredo" },
  { src: "/logos/framer-2-596x497.png", alt: "Jiku Kaze" },
  { src: "/logos/framer-4-874x822.png", alt: "Aremiti" },
];

// Une bande statique conserve tous les logos visibles, même sans animation.
export function ClientsMarquee() {
  return (
    <ul className="flex flex-wrap items-center justify-between gap-x-6 gap-y-8 border-b border-border pb-10">
      {logos.map((logo) => (
        <li
          key={logo.src}
          className="relative h-16 w-24 tablet:h-20 tablet:w-32"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            sizes="128px"
            className="object-contain opacity-75"
          />
        </li>
      ))}
    </ul>
  );
}
