import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { fontCairo } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },

  description: siteConfig.description,

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
    locale: "ar-SA",
    url: siteConfig.url,
    images: ["/og-image.svg"], // يمكن تركها relative
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.svg"],
  },

  alternates: {
    canonical: siteConfig.url,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="ar"
      dir="rtl"
      className={fontCairo.className}
    >
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-cairo antialiased",
          fontCairo.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}