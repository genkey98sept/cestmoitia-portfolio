export type SiteInfoLocation = {
  city?: string;
  zipCode?: string;
  country?: string;
  countryCode?: string;
};

export type SiteInfoLink = {
  id?: string;
  label: string;
  url: string;
};

export type SiteInfoService = {
  id?: string;
  title: string;
  description?: string;
};

export type SiteInfoExperience = {
  id?: string;
  company: string;
  position: string;
  year: string;
  description?: string;
};

export type SiteInfo = {
  id: string;
  heroTagline?: string;
  bio?: unknown;
  email: string;
  phone?: string;
  location?: SiteInfoLocation;
  cvUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  otherLinks?: SiteInfoLink[];
  services?: SiteInfoService[];
  experiences?: SiteInfoExperience[];
  createdAt?: string;
  updatedAt?: string;
};
