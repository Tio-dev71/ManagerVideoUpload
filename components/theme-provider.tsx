"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: any) {
  // Temporary bypass for React 19 / next-themes script tag error
  return <>{children}</>;
}
