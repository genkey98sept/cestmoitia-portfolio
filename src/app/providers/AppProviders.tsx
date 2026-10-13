"use client";

import { SmoothScroll } from "@/shared/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
