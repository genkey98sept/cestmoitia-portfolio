"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const logos = [
  { src: "/logos/framer-1-842x339.png", alt: "Exotic Gardens" },
  { src: "/logos/framer-5-842x596.png", alt: "American Express" },
  { src: "/logos/framer-3-3264x2756.png", alt: "Socredo" },
  { src: "/logos/framer-2-596x497.png", alt: "Jiku Kaze" },
  { src: "/logos/framer-4-874x822.png", alt: "Aremiti" },
];

const CARD_W = 240;
const CARD_H = 180;
const GAP = 20;
const SPEED = 50; // px/s — identique au site de ref (Framer Ticker speed: 50)

export function ClientsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Largeur d'un set complet (items + gaps entre eux + gap de transition vers set suivant)
    const totalWidth = logos.length * CARD_W + logos.length * GAP;
    const duration = (totalWidth / SPEED) * 1000;

    const anim = track.animate(
      [
        { transform: "translateX(0px)" },
        { transform: `translateX(-${totalWidth}px)` },
      ],
      { duration, iterations: Infinity, easing: "linear" }
    );

    const onVisibility = () => {
      document.hidden ? anim.pause() : anim.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      anim.cancel();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // 3 sets pour un loop parfaitement seamless
  const items = [...logos, ...logos, ...logos];

  return (
    <div
      ref={trackRef}
      style={{
        display: "flex",
        gap: `${GAP}px`,
        width: "max-content",
        willChange: "transform",
      }}
    >
      {items.map((logo, i) => (
        <div
          key={i}
          aria-hidden={i >= logos.length ? "true" : undefined}
          style={{
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            borderRadius: "10px",
            border: "1px solid #161616",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", width: "100px", height: "100px" }}>
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
