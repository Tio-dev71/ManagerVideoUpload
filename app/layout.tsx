import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "AutoReel Lite — Auto-post Videos to Social Media",
  description:
    "Schedule and auto-post short videos to Facebook Reels, Instagram Reels, and YouTube Shorts. Simple, beautiful, powerful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-sans)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
