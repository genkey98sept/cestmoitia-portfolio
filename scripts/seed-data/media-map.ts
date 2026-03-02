/**
 * Mapping complet des fichiers médias locaux vers leurs rôles dans le seed.
 *
 * MEDIA_ROOT pointe vers le dossier SwissTransfer dans public/.
 * Tous les chemins sont relatifs à MEDIA_ROOT.
 */

export const MEDIA_ROOT =
  "public/swisstransfer_019ba9cd-bb4c-4317-b1e5-85ddac5b7a52/Portfolio 2026 maybe";

export type MediaEntry = {
  sourcePath: string;
  alt: string;
  caption?: string;
  role: "cover" | "gallery" | "sub-media" | "profile" | "branding" | "photography";
  project?: string;
  subProject?: string;
};

export const mediaMap: Record<string, MediaEntry> = {
  // ═══════════════════════════════════════════════════
  // COVERS DE PROJETS
  // ═══════════════════════════════════════════════════
  "amex-cover": {
    sourcePath: "VIDEO/Amex/amex cover.jpg",
    alt: "Campagne publicitaire AMEX Padel Cup 2024",
    role: "cover",
    project: "amex",
  },
  "socredo-cover": {
    sourcePath: "VIDEO/Socredo/mpv-shot0013.jpg",
    alt: "Collaboration Socredo x Miss Tahiti",
    role: "cover",
    project: "socredo",
  },
  "exotic-garden-cover": {
    sourcePath: "VIDEO/Exotic Garden/mpv-shot0010.jpg",
    alt: "Tahiti Fashion Week - Exotic Garden",
    role: "cover",
    project: "exotic-garden",
  },
  "aremiti-cover": {
    sourcePath: "PHOTO/Aremiti/vlcsnap-2024-10-02-11h24m47s318.png",
    alt: "Mission community management Aremiti",
    role: "cover",
    project: "aremiti",
  },
  "biga-ranx-cover": {
    sourcePath: "PHOTO/Biga ranx/Biga_Ranx ft. Kea - Natural Woman (Clip officiel).jpeg",
    alt: "Clip Natural Woman - Biga Ranx ft. Kea",
    role: "cover",
    project: "biga-ranx",
  },
  "projet-perso-cover": {
    sourcePath: "PHOTO/Mes photos/DSC03876.JPG",
    alt: "Projets personnels vidéo et création",
    role: "cover",
    project: "projet-perso",
  },

  // ═══════════════════════════════════════════════════
  // GALERIE — AMEX (6 captures vidéo)
  // ═══════════════════════════════════════════════════
  "amex-gallery-1": {
    sourcePath: "VIDEO/Amex/mpv-shot0001.jpg",
    alt: "AMEX - Campagne publicitaire multi-supports",
    role: "gallery",
    project: "amex",
  },
  "amex-gallery-2": {
    sourcePath: "VIDEO/Amex/mpv-shot0002.jpg",
    alt: "AMEX - Spot publicitaire TV",
    role: "gallery",
    project: "amex",
  },
  "amex-gallery-3": {
    sourcePath: "VIDEO/Amex/mpv-shot0003.jpg",
    alt: "AMEX - Production vidéo",
    role: "gallery",
    project: "amex",
  },
  "amex-gallery-4": {
    sourcePath: "VIDEO/Amex/mpv-shot0004.jpg",
    alt: "AMEX - Tournage publicitaire",
    role: "gallery",
    project: "amex",
  },
  "amex-gallery-5": {
    sourcePath: "VIDEO/Amex/mpv-shot0005.jpg",
    alt: "AMEX - Post-production",
    role: "gallery",
    project: "amex",
  },
  "amex-gallery-6": {
    sourcePath: "VIDEO/Amex/mpv-shot0009.jpg",
    alt: "AMEX - Aftermovie Padel Cup",
    role: "gallery",
    project: "amex",
  },

  // ═══════════════════════════════════════════════════
  // GALERIE — SOCREDO
  // ═══════════════════════════════════════════════════
  "socredo-gallery-1": {
    sourcePath: "PHOTO/Socredo/SOC REO V9-100.jpg",
    alt: "Design campagne publicitaire Socredo",
    role: "gallery",
    project: "socredo",
  },
  "socredo-gallery-2": {
    sourcePath: "VIDEO/Socredo/mpv-shot0014.jpg",
    alt: "Aftermovie soirée annuelle Socredo",
    role: "gallery",
    project: "socredo",
  },
  "socredo-gallery-3": {
    sourcePath: "VIDEO/Socredo/mpv-shot0015.jpg",
    alt: "Événement solidaire Socredo AOA SOS Village",
    role: "gallery",
    project: "socredo",
  },
  "socredo-gallery-4": {
    sourcePath: "PHOTO/Socredo/SOC REO 1 V1.png",
    alt: "Conception graphique Socredo - première itération",
    role: "gallery",
    project: "socredo",
  },

  // ═══════════════════════════════════════════════════
  // GALERIE — AREMITI
  // ═══════════════════════════════════════════════════
  "aremiti-gallery-1": {
    sourcePath: "PHOTO/Aremiti/Artboard 1-100.jpg",
    alt: "Design graphique Aremiti - Artboard 1",
    role: "gallery",
    project: "aremiti",
  },
  "aremiti-gallery-2": {
    sourcePath: "PHOTO/Aremiti/Artboard 2-100.jpg",
    alt: "Création visuelle Aremiti - Artboard 2",
    role: "gallery",
    project: "aremiti",
  },
  "aremiti-gallery-3": {
    sourcePath: "PHOTO/Aremiti/473081670_122176346474253446_462802626672466873_n.jpg",
    alt: "Publication social media Aremiti",
    role: "gallery",
    project: "aremiti",
  },
  "aremiti-gallery-4": {
    sourcePath: "PHOTO/Aremiti/473189292_122176361252253446_8942406050503205912_n.jpg",
    alt: "Contenu réseaux sociaux Aremiti",
    role: "gallery",
    project: "aremiti",
  },
  "aremiti-gallery-5": {
    sourcePath: "VIDEO/Aremiti/mpv-shot0016.jpg",
    alt: "Vidéo consignes de sécurité Aremiti",
    role: "gallery",
    project: "aremiti",
  },

  // ═══════════════════════════════════════════════════
  // GALERIE — BIGA RANX
  // ═══════════════════════════════════════════════════
  "biga-ranx-gallery-1": {
    sourcePath: "PHOTO/Biga ranx/Biga_Ranx ft. Kea - Natural Woman (Clip officiel) (1).jpeg",
    alt: "Still du clip Natural Woman - Biga Ranx ft. Kea",
    role: "gallery",
    project: "biga-ranx",
  },
  "biga-ranx-gallery-2": {
    sourcePath: "PHOTO/Biga ranx/WhatsApp Image 2025-06-09 at 13.28.14.jpeg",
    alt: "Behind the scenes - tournage Natural Woman",
    role: "gallery",
    project: "biga-ranx",
  },
  "biga-ranx-gallery-3": {
    sourcePath: "PHOTO/Biga ranx/WhatsApp Image 2025-06-09 at 13.28.15.jpeg",
    alt: "Plateau de tournage clip Natural Woman",
    role: "gallery",
    project: "biga-ranx",
  },
  "biga-ranx-gallery-4": {
    sourcePath: "PHOTO/Biga ranx/WhatsApp Image 2025-06-12 at 03.00.06.jpeg",
    alt: "Production clip vidéo Biga Ranx",
    role: "gallery",
    project: "biga-ranx",
  },

  // ═══════════════════════════════════════════════════
  // PROFIL & BRANDING
  // ═══════════════════════════════════════════════════
  "profile-main": {
    sourcePath: "PHOTO/Moi + logo/bigblack.jpg",
    alt: "Tia - Filmmaker et graphiste basé à Tahiti",
    role: "profile",
  },
  "profile-alt": {
    sourcePath: "PHOTO/Moi + logo/bigpa.jpg",
    alt: "Tia - Portrait",
    role: "profile",
  },
  "logo": {
    sourcePath: "PHOTO/Moi + logo/Untitled-1.png",
    alt: "Logo cestmoitia",
    role: "branding",
  },

  // ═══════════════════════════════════════════════════
  // PHOTOGRAPHIE — Sélection pour la page /photography
  // On exclut les doublons (" 2.JPG") et les screenshots
  // ═══════════════════════════════════════════════════
  "photo-001": { sourcePath: "PHOTO/Mes photos/DSC02808.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-002": { sourcePath: "PHOTO/Mes photos/DSC02833.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-003": { sourcePath: "PHOTO/Mes photos/DSC03224.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-004": { sourcePath: "PHOTO/Mes photos/DSC03876.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-005": { sourcePath: "PHOTO/Mes photos/DSC03925.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-006": { sourcePath: "PHOTO/Mes photos/DSC04018.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-007": { sourcePath: "PHOTO/Mes photos/DSC04083.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-008": { sourcePath: "PHOTO/Mes photos/DSC04093.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-009": { sourcePath: "PHOTO/Mes photos/DSC04146.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-010": { sourcePath: "PHOTO/Mes photos/DSC04216.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-011": { sourcePath: "PHOTO/Mes photos/DSC04444.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-012": { sourcePath: "PHOTO/Mes photos/DSC04467.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-013": { sourcePath: "PHOTO/Mes photos/DSC04836.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-014": { sourcePath: "PHOTO/Mes photos/DSC04846.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-015": { sourcePath: "PHOTO/Mes photos/DSC04862.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-016": { sourcePath: "PHOTO/Mes photos/DSC04903.JPG.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-017": { sourcePath: "PHOTO/Mes photos/DSC05911.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-018": { sourcePath: "PHOTO/Mes photos/DSC05918.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-019": { sourcePath: "PHOTO/Mes photos/DSC05919.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-020": { sourcePath: "PHOTO/Mes photos/DSC05928.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-021": { sourcePath: "PHOTO/Mes photos/DSC05937.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-022": { sourcePath: "PHOTO/Mes photos/DSC05940.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-023": { sourcePath: "PHOTO/Mes photos/DSC07402.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-024": { sourcePath: "PHOTO/Mes photos/DSC07413.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-025": { sourcePath: "PHOTO/Mes photos/DSC07419.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-026": { sourcePath: "PHOTO/Mes photos/DSC07422.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-027": { sourcePath: "PHOTO/Mes photos/DSC08096.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-028": { sourcePath: "PHOTO/Mes photos/DSC08119.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-029": { sourcePath: "PHOTO/Mes photos/DSC08121.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-030": { sourcePath: "PHOTO/Mes photos/IMG_0165.jpeg", alt: "Photographie par Tia", role: "photography" },
  "photo-031": { sourcePath: "PHOTO/Mes photos/IMG_0167.jpeg", alt: "Photographie par Tia", role: "photography" },
  "photo-032": { sourcePath: "PHOTO/Mes photos/IMG_3611.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-033": { sourcePath: "PHOTO/Mes photos/IMG_4144.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-034": { sourcePath: "PHOTO/Mes photos/IMG_4164.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-035": { sourcePath: "PHOTO/Mes photos/IMG_4186.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-036": { sourcePath: "PHOTO/Mes photos/IMG_4189.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-037": { sourcePath: "PHOTO/Mes photos/IMG_4198A0FFEAF1-1.jpg", alt: "Photographie par Tia", role: "photography" },
  "photo-038": { sourcePath: "PHOTO/Mes photos/IMG_4216.jpeg", alt: "Photographie par Tia", role: "photography" },
  "photo-039": { sourcePath: "PHOTO/Mes photos/IMG_4219.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-040": { sourcePath: "PHOTO/Mes photos/IMG_6890.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-041": { sourcePath: "PHOTO/Mes photos/IMG_6891.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-042": { sourcePath: "PHOTO/Mes photos/IMG_7033.jpeg", alt: "Photographie par Tia", role: "photography" },
  "photo-043": { sourcePath: "PHOTO/Mes photos/IMG_9484.jpeg", alt: "Photographie par Tia", role: "photography" },
  "photo-044": { sourcePath: "PHOTO/Mes photos/IMG_9760.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-045": { sourcePath: "PHOTO/Mes photos/172DE725-884B-47C3-9D9C-9317F7B76961.jpeg", alt: "Photographie par Tia", role: "photography" },
  "photo-046": { sourcePath: "PHOTO/Mes photos/CD8D537C-BB26-41D2-9952-AA3D721BAA74.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-047": { sourcePath: "PHOTO/Mes photos/DF2B2106-A3C6-46F4-89B5-6ECDDE9DB714.JPG", alt: "Photographie par Tia", role: "photography" },
  "photo-048": { sourcePath: "PHOTO/A8B16355-8057-467E-A26C-5E4CBE5C8C81.JPG", alt: "Photographie par Tia", role: "photography" },
};

/** Retourne uniquement les entrées d'un rôle donné */
export function getMediaByRole(role: MediaEntry["role"]): [string, MediaEntry][] {
  return Object.entries(mediaMap).filter(([, entry]) => entry.role === role);
}

/** Retourne les entrées galerie d'un projet donné */
export function getGalleryForProject(projectSlug: string): [string, MediaEntry][] {
  return Object.entries(mediaMap).filter(
    ([, entry]) => entry.role === "gallery" && entry.project === projectSlug,
  );
}
