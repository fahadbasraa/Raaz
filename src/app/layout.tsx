import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Curtain } from "@/components/curtain";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "RAAZ — Kept quiet, worn loudly";
const description =
  "RAAZ (راز) — quiet luxury, made slowly, in small numbers. An unveiling.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — RAAZ" },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "RAAZ",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1654765435666-72cb4e1f7ee3?w=1200&q=80&auto=format",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ivory font-ui">
        <SessionProvider>
          <Curtain />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <CartDrawer />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
