"use client";

import { MotionProvider } from "@/shared/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
