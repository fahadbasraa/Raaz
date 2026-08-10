import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Curtain } from "@/components/curtain";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { CartDrawer } from "@/components/cart-drawer";

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

export const metadata: Metadata = {
  title: "RAAZ — Kept quiet, worn loudly",
  description:
    "RAAZ (راز) — quiet luxury, made slowly, in small numbers. An unveiling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ivory font-ui">
        <Curtain />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <CartDrawer />
      </body>
    </html>
  );
}
